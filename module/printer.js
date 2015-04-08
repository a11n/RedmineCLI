var tmpl = require('./template-engine.js');

exports.printSuccessfullyConnected = function(url, user){
  console.log('Successfully connected \'' + user.login + '\' to \'' + url + '\'.');
}

exports.printProjects = function(projects){
  var out = tmpl.renderFile('template/projects.tmpl', projects);
  console.log(out);
}

exports.printProject = function(project){
  var out = tmpl.renderFile('template/project.tmpl', project);
  console.log(out);
}

exports.printIssues = function(issues){
  var out = tmpl.renderFile('template/issues.tmpl', issues);
  console.log(out);
}

exports.printIssue = function(issue){
  var out = tmpl.renderFile('template/issue.tmpl', issue);
  console.log(out);
}

exports.printStatuses = function(statuses){
  var out = tmpl.renderFile('template/statuses.tmpl', statuses);
  console.log(out);
}

exports.printTrackers = function(trackers){
  var out = tmpl.renderFile('template/trackers.tmpl', trackers);
  console.log(out);
}

exports.printPriorities = function(priorities){
  var out = tmpl.renderFile('template/priorities.tmpl', priorities);
  console.log(out);
}

exports.printUsers = function(users){
  var out = tmpl.renderFile('template/users.tmpl', users);
  console.log(out);
}
