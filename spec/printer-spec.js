describe('printer.js', function() {
  var rewire = require("rewire");
  var printer = rewire("../module/printer.js");

  var tmpl = printer.__get__('tmpl');

  it("should print successfully connected", function() {
    var user = {login: 'login'};

    spyOn(console, 'log');

    printer.printSuccessfullyConnected('url', user)

    expect(console.log).toHaveBeenCalledWith('Successfully connected \'login\' to \'url\'.');
  });

  it("should print projects", function() {
    var projects = {projects: []};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printProjects(projects);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/projects.tmpl', projects);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print project", function() {
    var project = {project: {}};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printProject(project);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/project.tmpl', project);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print issues", function() {
    var issues = {issues: []};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printIssues(issues);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/issues.tmpl', issues);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print issue", function() {
    var issue = {issue: {}};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printIssue(issue);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/issue.tmpl', issue);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print statuses", function() {
    var statuses = {statuses: []};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printStatuses(statuses);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/statuses.tmpl', statuses);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print trackers", function() {
    var trackers = {trackers: []};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printTrackers(trackers);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/trackers.tmpl', trackers);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print priorities", function() {
    var priorities = {priorities: []};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printPriorities(priorities);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/priorities.tmpl', priorities);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print users", function() {
    var users = {users: []};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printUsers(users);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/users.tmpl', users);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print user", function() {
    var user = {user: {}};
    var out = 'output';

    spyOn(tmpl, 'renderFile').andReturn(out);
    spyOn(console, 'log');

    printer.printUser(user);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/user.tmpl', user);
    expect(console.log).toHaveBeenCalledWith(out);
  });

});
