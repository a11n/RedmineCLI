var request = require('sync-request');
var nconf = require('nconf');

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

exports.getIssues = function(){
  throwWhenNotConnected();

  var response = get('/issues.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issues.'}
}

exports.getProjects = function(){
  throwWhenNotConnected();

  var response = get('/projects.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load projects.'}
}

exports.getIssue = function(id){
  throwWhenNotConnected();

  var response = get('/issues/'+ id +'.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issue.'}
}
