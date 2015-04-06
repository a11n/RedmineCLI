var tmpl = require('./template-engine.js');

exports.printProjects = function(projects){
  var out = tmpl.renderFile('template/projects.tmpl', {'projects': projects});
  console.log(out);
}

exports.printProject = function(project){
  var out = tmpl.renderFile('template/project.tmpl', project);
  console.log(out);
}

exports.printIssues = function(issues){
  var out = tmpl.renderFile('template/issues.tmpl', {'issues': issues});
  console.log(out);
}

exports.printIssue = function(issue){
  var out = tmpl.renderFile('template/issue.tmpl', issue);
  console.log(out);
}
