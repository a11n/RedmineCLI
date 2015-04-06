var redmine = require('../module/redmine.js');
var printer = require('../module/printer.js');

exports.handleConnect = function(url, apiKey){
  try{
    redmine.connect(url, apiKey);
  } catch(err){console.error(err)}
}

exports.handleProjects = function(){
  try{
    var projects = redmine.getProjects();
    printer.printProjects(projects);
  } catch(err){console.error(err)}
}

exports.handleProject = function(identifier){
  try{
    var project = redmine.getProject(identifier);
    var memberships = redmine.getProjectMemberships(identifier);

    project.memberships = memberships.memberships

    printer.printProject(project);
  } catch(err){console.error(err)}
}

exports.handleIssues = function(options){
  try{
    var issues = redmine.getIssues();
    printer.printIssues(issues);
  } catch(err){console.error(err)}
}

exports.handleIssue = function(id){
  try{
    var issue = redmine.getIssue(id);
    printer.printIssue(issue.issue);
  } catch(err){console.error(err)}
}

exports.handleStatuses = function(options){
  try{
    var statuses = redmine.getStatuses();
    printer.printStatuses(statuses);
  } catch(err){console.error(err)}
}
