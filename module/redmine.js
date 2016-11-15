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
    if(options.parent && typeof options.parent == 'string') issue.issue.parent_issue_id = options.parent;
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
