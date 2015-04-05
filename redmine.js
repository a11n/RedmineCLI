var request = require('sync-request');

var _serverUrl;
var _apiKey;

var throwWhenNotConnected = function(){
  if(!_serverUrl || !_apiKey)
  throw 'Not connected.'
}

var get = function(path){
  return request('GET', _serverUrl + path);
}

exports.connect = function(serverUrl, apiKey){
  _serverUrl = serverUrl;
  _apiKey = apiKey;
}

exports.getIssues = function(){
  throwWhenNotConnected();

  var response = get('/issues.json');
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
