var request = require('sync-request');
var nconf = require('nconf');
var openInBrowser = require('open');
var querystring = require('querystring');
var resolver = require('./resolver.js');

nconf.file(__dirname + '/../config.json');

var throwWhenNotConnected = function(){
  if(!nconf.get('serverUrl') || !nconf.get('apiKey'))
    throw 'Not connected.'
}

var req = function(method, serverUrl, apiKey, path, options){
  serverUrl = serverUrl || nconf.get('serverUrl');
  apiKey = apiKey || nconf.get('apiKey');

  var url = serverUrl + path;
  options.headers = {'X-Redmine-API-Key': apiKey};
  return request(method, url, options);
}

var get = function(path, serverUrl, apiKey){
  return req('GET', serverUrl, apiKey, path, {});
}

var put = function(path, body){
  return req('PUT', null, null, path, {'json': body});
}

var post = function(path, body){
  return req('POST', null, null, path, {'json': body});
}

exports.connect = function(serverUrl, apiKey){
  var response = get('/users/current.json', serverUrl, apiKey);

  var user;
  try{
    user = JSON.parse(response.getBody('utf8'));
    if(user.user)
      user = user.user;
    else
      throw 'Invalid result';
  } catch(err) {throw 'Connection to \'' + serverUrl + '\' failed.'};

  nconf.set('serverUrl', serverUrl);
  nconf.set('apiKey', apiKey);
  nconf.save();

  return user;
}

exports.getProjects = function(){
  throwWhenNotConnected();

  var response = get('/projects.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load projects.'}
}

exports.getProject = function(identifier){
  throwWhenNotConnected();

  var response = get('/projects/'+ identifier +'.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load project.'}
}

exports.updateProject = function(identifier, options){
  throwWhenNotConnected();

  try{
    var project = {project:{}};

    if(options.description) project.project.description = options.description;
    if(options.public) project.project.is_public = options.public;
    if(options.parent && typeof options.parent == 'string')
      project.project.parent_id = options.parent;

    var response = put('/projects/' + identifier + '.json', project);
    if(response.statusCode != 200)
      throw 'Server responded with statuscode ' + response.statusCode;

  } catch(err) {throw 'Could not update project:\n' + err}
}

exports.createProject = function(name, identifier, options){
  throwWhenNotConnected();

  try{
    var project = {project:{'name':name,'identifier':identifier}};

    if(options.description) project.project.description = options.description;
    if(options.public) project.project.is_public = true;
    else project.project.is_public = false;
    if(options.parent && typeof options.parent == 'string')
      project.project.parent_id = options.parent;

    var response = post('/projects.json', project);

    if(response.statusCode != 201)
      throw 'Server responded with statuscode ' + response.statusCode;

    var project = JSON.parse(response.getBody('utf8'));
    return project;
  } catch(err) {throw 'Could not create project:\n' + err}
}

exports.getProjectMemberships = function(identifier){
  throwWhenNotConnected();

  var response = get('/projects/'+ identifier +'/memberships.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load project memberships.'}
}

exports.getProjectMembershipsGroupedByRole = function(identifier){
  var roles = {};
  var memberships = exports.getProjectMemberships(identifier).memberships;
  for(var i = 0; i < memberships.length; i++){
    var membership = memberships[i];
    for(var j = 0; j < membership.roles.length; j++){
      var role = membership.roles[j];
      if(!(role.name in roles)) roles[role.name] = {'name': role.name, 'members': []};
      roles[role.name].members.push(membership.user.name);
    }
  }

  return roles;
}

exports.getIssues = function(filters){
  throwWhenNotConnected();

  var query = querystring.stringify(filters);
  var response = get('/issues.json' + (query ? '?' + query : query));
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issues.'}
}

exports.getIssue = function(id, options){
  throwWhenNotConnected();

  var include = '';
  if(options.history)
    include = '?include=journals';
  var response = get('/issues/'+ id +'.json' + include);
  try{
    var issue = JSON.parse(response.getBody('utf8'));
    if(issue.issue.journals)
      resolver.resolveHistoryIdsToNames(issue.issue);

    return issue;
  } catch(err) {throw 'Could not load issue.'}
}

exports.updateIssue = function(id, options){
  throwWhenNotConnected();

  try{
    var issue = {issue:{}};

    if(options.priority)
      issue.issue.priority_id = exports.getPriorityIdByName(options.priority);
    if(options.assignee) issue.issue.assigned_to_id = options.assignee;
    if(options.status)
      issue.issue.status_id = exports.getStatusIdByName(options.status);
    if(options.tracker)
      issue.issue.tracker_id = exports.getTrackerIdByName(options.tracker);
    if(options.subject) issue.issue.subject = options.subject;
    if(options.description) issue.issue.description = options.description;

    var response = put('/issues/' + id + '.json', issue);
    if(response.statusCode != 200)
      throw 'Server responded with statuscode ' + response.statusCode;
  } catch(err) {throw 'Could not update issue:\n' + err }
}

exports.createIssue = function(project, subject, options){
  throwWhenNotConnected();

  try{
    var issue = {issue:{'project_id':project,'subject':subject}};

    if(options.priority)
      issue.issue.priority_id = exports.getPriorityIdByName(options.priority);
    if(options.assignee) issue.issue.assigned_to_id = options.assignee;
    if(options.status)
      issue.issue.status_id = exports.getStatusIdByName(options.status);
    if(options.tracker)
      issue.issue.tracker_id = exports.getTrackerIdByName(options.tracker);
    if(options.description) issue.issue.description = options.description;

    var response = post('/issues.json', issue);

    if(response.statusCode == 404){
      throw 'Server responded with statuscode 404.\n' +
            'This is most likely the case when the specified project does not exist.\n' +
            'Does project \''+ project +'\' exist?';
    }
    else if(response.statusCode != 201)
      throw 'Server responded with statuscode ' + response.statusCode;

    var issue = JSON.parse(response.getBody('utf8'));
    return issue;
  } catch(err) {throw 'Could not create issue:\n' + err}
}

exports.importModel = function (filePath, model, options){
  try {
    var fs = require('fs');
    var path = require('path');

    var modelPath = path.join(__dirname, '..', 'issues-models', model + '.json');

    if (fs.existsSync(modelPath) && !options.force)
      throw 'Model exists. Remove it first or use --force.'

    var encoding = "utf8";
    if (options.encoding) encoding = options.encoding;

    var modelData = fs.readFileSync(filePath, encoding);
    var fd = fs.openSync(modelPath, "wx");
    fs.writeSync(fd, modelData, 0, encoding);
  } catch (err) {throw 'Could not import model:\n' + err}
}

exports.removeModel = function (model){
  try {
    var fs = require('fs');
    var path = require('path');

    var modelPath = path.join(__dirname, '..', 'issues-models', model + '.json');
    if (!fs.existsSync(modelPath))
      throw 'Model not found.'

    fs.unlinkSync(modelPath);
  } catch (err) {throw 'Could not remove model:\n' + err}
}

exports.listModels = function (){
  try {
    var fs = require('fs');
    var path = require('path');

    var issuesModelPath = path.join(__dirname, '..', 'issues-models');
    const models = fs.readdirSync(issuesModelPath);
    var result = [];
    for (var m in models)
      result.push(models[m].replace('.json', ''));
    
    return result;

  } catch (err) {throw 'Could not list models:\n' + err}
}

exports.parseModel = function(model){
  var fs = require('fs');
  var path = require('path');

  try {
    // loading model JSON
    var filePath = path.join(__dirname, '..', 'issues-models', model + '.json');
    var modelObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // model pre-validation
    if (!modelObject)
      throw 'Invalid JSON';

    if (modelObject.issues instanceof Array == false)
      throw 'Expected property `issues` (Array) on model';

    if (modelObject.issues.length == 0)
      throw 'Expected property `issues` (Array) containing at least 1 element on model';

    if (typeof(modelObject.issues[0]) != "object")
      throw 'Invalid property `issues` (Array<' + typeof(modelObject.issues[0]) + '>) on model. Expected Array<object>.';

    if (typeof(modelObject.globals) != "object")
      throw 'Invalid property `globals` (' + typeof(modelObject.globals) + ') on model. Expected object.';

    // parsing globals
    for (var p in modelObject.globals) {
      for (var i in modelObject.issues) {
        modelObject.issues[i][p] = modelObject.globals[p];
      }
    }

    // model post-validation
    for (var i in modelObject.issues) {
        if (typeof(modelObject.issues[i].subject) != "string" || modelObject.issues[i].subject.length == 0)
          throw 'Expected property `subject` in all issues' 
    }
    
    
    return modelObject.issues;
  } catch(err) {throw 'Could not parse the model:\n' + err}
}


//TODO: rollback in case of error (delete issues that were created)
exports.generateIssues = function(project, model, options){
  throwWhenNotConnected();

  var successIds = []

  try{
    // processing the model
    var issuesModel = exports.parseModel(model);
    for(var i in issuesModel){

      // translating issuesModel properties to redmine API
      var issue = {issue:{'project_id':project, 'subject': issuesModel[i].subject}};

      // setting model properties
      if(issuesModel[i].priority)
        issue.issue.priority_id = exports.getStatusIdByName(issuesModel[i].priority);
      if(issuesModel[i].assignee)
        issue.issue.assigned_to_id = issuesModel[i].assignee;
      if(issuesModel[i].parent)
        issue.issue.parent_issue_id = issuesModel[i].parent;
      if(issuesModel[i].estimated)
        issue.issue.estimated_hours = issuesModel[i].estimated;
      if(issuesModel[i].status)
        issue.issue.status_id = exports.getStatusIdByName(issuesModel[i].status);
      if(issuesModel[i].tracker)
        issue.issue.tracker_id = exports.getTrackerIdByName(issuesModel[i].tracker);
      if(issuesModel[i].description)
        issue.issue.description = issuesModel[i].description;
      
      // overriding issuesModel options with command line options
      if(options.priority)
        issue.issue.priority_id = exports.getStatusIdByName(options.priority);
      if(options.assignee)
        issue.issue.assigned_to_id = options.assignee;
      if(options.parent && typeof options.parent == 'string')
        issue.issue.parent_issue_id = options.parent;
      if(options.estimated)
        issue.issue.estimated_hours = options.estimated;
      if(options.status)
        issue.issue.status_id = exports.getStatusIdByName(options.status);
      if(options.tracker)
        issue.issue.tracker_id = exports.getTrackerIdByName(options.tracker);
      if(options.description && typeof options.description == 'string')
        issue.issue.description = options.description;
      if(options.subject)
        issue.issue.subject = options.subject;

      // creating issues
      var response = post('/issues.json', issue);
      var issue = JSON.parse(response.getBody('utf8'));
      successIds.push(issue.issue.id);

      if(response.statusCode == 404){
        throw 'Server responded with statuscode 404.\n' +
              'This is most likely the case when the specified project does not exist.\n' +
              'Does project \''+ project +'\' exist?';
      }
      else if(response.statusCode != 201){
        throw 'Server responded with statuscode ' + response.statusCode + '\n' +
              'Model with error:\n' + modelObject.issues[i];
      }
    }

    return successIds;
  } catch(err) {
    if (successIds.length > 0) {
      throw 'Could not generate all issues. Issues created: ' + successIds.length.join(', ') + '. Error:\n' + err
    }
    else {
      throw 'Could not generate any issue:\n' + err
    }
  }
}

exports.getStatuses = function(){
  throwWhenNotConnected();

  var response = get('/issue_statuses.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issue statuses.'}
}

exports.getStatusIdByName = function(name){
  var statuses = exports.getStatuses().issue_statuses;
  for(var i = 0; i < statuses.length; i++){
    if(name == statuses[i].name)
      return statuses[i].id;
  }

  throw '\''+ name +'\' is no valid status.';
}

exports.getStatusNameById = function(id){
  var statuses = exports.getStatuses().issue_statuses;
  for(var i = 0; i < statuses.length; i++){
    if(id == statuses[i].id)
      return statuses[i].name;
  }

  throw '\''+ id +'\' is no valid status id.';
}

exports.getTrackers = function(){
  throwWhenNotConnected();

  var response = get('/trackers.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load trackers.'}
}

exports.getTrackerIdByName = function(name){
  var trackers = exports.getTrackers().trackers;
  for(var i = 0; i < trackers.length; i++){
    if(name == trackers[i].name)
      return trackers[i].id;
  }

  throw '\''+ name +'\' is no valid tracker.';
}

exports.getTrackerNameById = function(id){
  var trackers = exports.getTrackers().trackers;
  for(var i = 0; i < trackers.length; i++){
    if(id == trackers[i].id)
      return trackers[i].name;
  }

  throw '\''+ id +'\' is no valid tracker id.';
}

exports.getPriorities = function(){
  throwWhenNotConnected();

  var response = get('/enumerations/issue_priorities.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issue priorities.'}
}

exports.getPriorityIdByName = function(name){
  var priorities = exports.getPriorities().issue_priorities;
  for(var i = 0; i < priorities.length; i++){
    if(name == priorities[i].name)
      return priorities[i].id;
  }

  throw '\''+ name +'\' is no valid priority.';
}

exports.getPriorityNameById = function(id){
  var priorities = exports.getPriorities().issue_priorities;
  for(var i = 0; i < priorities.length; i++){
    if(id == priorities[i].id)
      return priorities[i].name;
  }

  throw '\''+ id +'\' is no valid priority id.';
}

exports.getUsers = function(){
  throwWhenNotConnected();

  var response = get('/users.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load users.'}
}

exports.getUser = function(id){
  throwWhenNotConnected();

  var response = get('/users/' + id + '.json?include=memberships');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load user.'}
}

exports.getAssigneeNameById = function(id){
  var users = exports.getUsers().users;
  for(var i = 0; i < users.length; i++){
    if(id == users[i].id)
      return users[i].firstname + ' ' + users[i].lastname;
  }

  throw '\''+ id +'\' is no valid assignee id.';
}

exports.open = function(id){
  throwWhenNotConnected();

  var url = nconf.get('serverUrl') + '/issues/' + id;
  openInBrowser(url);
}
