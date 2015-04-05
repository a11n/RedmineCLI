var Table = require('cli-table');
var swig = require('swig');

exports.printIssues = function(issues){
  var table = new Table({
      head: ['ID', 'Tracker', 'Status', 'Priority', 'Assignee', 'Updated']
  });
  for(var i=0; i<issues.length;i++){
    var issue = issues[i];
    var id = issue.id;
    var tracker = issue.tracker.name;
    var status = issue.status.name;
    var priority = issue.priority.name;
    var assignee;
    if(!!issue.assigned_to)
      assignee = issue.assigned_to.name;
    else
      assignee = '(not assigned)';

    table.push([id, tracker, status, priority, assignee, issue.updated_on]);
  }

  console.log(table.toString());
}

exports.printIssue = function(issue){
  var out = swig.renderFile('tmpl/issue.tmpl', issue);
  console.log(out);
}

exports.printProjects = function(projects){
  var table = new Table({
      head: ['Name', 'Key']
  });
  for(var i=0; i<projects.length;i++){
    var project = projects[i];
    var name = project.name;
    var identifier = project.identifier;

    table.push([name, identifier]);
  }

  console.log(table.toString());
}
