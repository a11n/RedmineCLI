var request = require('sync-request');
var nconf = require('nconf');
var open = require('open');
var querystring = require('querystring');

nconf.file('config.json');

var throwWhenNotConnected = function(){
  if(!nconf.get('serverUrl') || !nconf.get('apiKey'))
    throw 'Not connected.'
}

var get = function(path){
  var url = nconf.get('serverUrl') + path;
  var options = { headers: {'X-Redmine-API-Key': nconf.get('apiKey')}};
  return request('GET', url, options);
}

exports.connect = function(serverUrl, apiKey){
  nconf.set('serverUrl', serverUrl);
  nconf.set('apiKey', apiKey);
  nconf.save();
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

exports.getProjectMemberships = function(identifier){
  throwWhenNotConnected();

  var response = get('/projects/'+ identifier +'/memberships.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load project.'}
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

exports.getIssue = function(id){
  throwWhenNotConnected();

  var response = get('/issues/'+ id +'.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issue.'}
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

  throw '\''+ name +'\' is not valid status.';
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

  throw '\''+ name +'\' is not valid tracker.';
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

  throw '\''+ name +'\' is not valid priority.';
}

exports.open = function(id){
  throwWhenNotConnected();

  var url = nconf.get('serverUrl') + '/issues/' + id;
  open(url);
}
