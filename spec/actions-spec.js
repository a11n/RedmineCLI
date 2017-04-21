describe('actions.js', function() {
  var rewire = require("rewire");
  var actions = rewire("../module/actions.js");

  var redmine = actions.__get__('redmine');
  var printer = actions.__get__('printer');
  var filter = actions.__get__('filter');

  it("should handle connect", function() {
    var user = {user: 'name'};

    spyOn(redmine, 'connect').andReturn(user);
    spyOn(printer, 'printSuccessfullyConnected');

    actions.handleConnect('url', 'apiKey');

    expect(redmine.connect).toHaveBeenCalledWith('url', 'apiKey');
    expect(printer.printSuccessfullyConnected).toHaveBeenCalledWith('url', user);
  });

  it("should handle connect and catch error", function() {
    spyOn(redmine, 'connect').andThrow('error');
    spyOn(console, 'error');

    actions.handleConnect();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle projects", function() {
    var projects = {projects: []};

    spyOn(redmine, 'getProjects').andReturn(projects);
    spyOn(printer, 'printProjects');

    actions.handleProjects();

    expect(redmine.getProjects).toHaveBeenCalled();
    expect(printer.printProjects).toHaveBeenCalledWith(projects);
  });

  it("should handle projects and catch error", function() {
    spyOn(redmine, 'getProjects').andThrow('error');
    spyOn(console, 'error');

    actions.handleProjects();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle project", function() {
    var project = {project: {}};
    var roles = {roles: []};

    spyOn(redmine, 'getProject').andReturn(project);
    spyOn(redmine, 'getProjectMembershipsGroupedByRole').andReturn(roles);
    spyOn(printer, 'printProject');

    actions.handleProject('project');

    expect(project.roles).toEqual(roles);
    expect(redmine.getProject).toHaveBeenCalledWith('project');
    expect(printer.printProject).toHaveBeenCalledWith(project);
  });

  it("should handle project and catch error", function() {
    spyOn(redmine, 'getProject').andThrow('error');
    spyOn(console, 'error');

    actions.handleProject();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle update project", function() {
    var options = {options: []};

    spyOn(redmine, 'updateProject');
    spyOn(console, 'log');

    actions.handleUpdateProject('identifier', options);

    expect(redmine.updateProject).toHaveBeenCalledWith('identifier', options);
    expect(console.log).toHaveBeenCalledWith('Successfully updated identifier');
  });

  it("should handle update project and catch error", function() {
    spyOn(redmine, 'updateProject').andThrow('error');
    spyOn(console, 'error');

    actions.handleUpdateProject();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle create project", function() {
    var options = {options: []};

    spyOn(redmine, 'createProject').andReturn({project:{identifier:'project'}});
    spyOn(console, 'log');

    actions.handleCreateProject('name', 'identifier', options);

    expect(redmine.createProject).toHaveBeenCalledWith('name', 'identifier', options);
    expect(console.log).toHaveBeenCalledWith('Successfully created project');
  });

  it("should handle create project and catch error", function() {
    spyOn(redmine, 'createProject').andThrow('error');
    spyOn(console, 'error');

    actions.handleCreateProject();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle issues", function() {
    var issues = {issues: []};
    var filters = [{}];

    spyOn(filter, 'issuesFiltersFrom').andReturn(filters)
    spyOn(redmine, 'getIssues').andReturn(issues);
    spyOn(printer, 'printIssues');

    actions.handleIssues();

    expect(redmine.getIssues).toHaveBeenCalledWith(filters);
    expect(printer.printIssues).toHaveBeenCalledWith(issues);
  });

  it("should handle issues and catch error", function() {
    spyOn(filter, 'issuesFiltersFrom').andThrow('error');
    spyOn(console, 'error');

    actions.handleIssues();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle issue", function() {
    var issue = {issue: {}};
    var options = {options: []};

    spyOn(redmine, 'getIssue').andReturn(issue);
    spyOn(printer, 'printIssue');

    actions.handleIssue('id', options);

    expect(redmine.getIssue).toHaveBeenCalledWith('id', options);
    expect(printer.printIssue).toHaveBeenCalledWith(issue.issue);
  });

  it("should handle issue and catch error", function() {
    spyOn(redmine, 'getIssue').andThrow('error');
    spyOn(console, 'error');

    actions.handleIssue();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle update issue", function() {
    var options = {options: []};

    spyOn(redmine, 'updateIssue');
    spyOn(console, 'log');

    actions.handleUpdateIssue('id', options);

    expect(redmine.updateIssue).toHaveBeenCalledWith('id', options);
    expect(console.log).toHaveBeenCalledWith('Successfully updated #id');
  });

  it("should handle update issue and catch error", function() {
    spyOn(redmine, 'updateIssue').andThrow('error');
    spyOn(console, 'error');

    actions.handleUpdateIssue();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle create issue", function() {
    var options = {options: []};

    spyOn(redmine, 'createIssue').andReturn({issue:{id:1}});
    spyOn(console, 'log');

    actions.handleCreateIssue('project', 'subject', options);

    expect(redmine.createIssue).toHaveBeenCalledWith('project', 'subject', options);
    expect(console.log).toHaveBeenCalledWith('Successfully created #1');
  });

  it("should handle create issue and catch error", function() {
    spyOn(redmine, 'createIssue').andThrow('error');
    spyOn(console, 'error');

    actions.handleCreateIssue();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle import model", function() {
    var options = {options: []}; 

    spyOn(redmine, 'importModel').andReturn();
    spyOn(console, 'log');

    actions.handleImportModel("sample.json", "sample", options);

    expect(redmine.importModel).toHaveBeenCalledWith("sample.json", "sample", options);
    expect(console.log).toHaveBeenCalledWith('Model successfully imported: sample');
  });

  it("should handle import model and catch error", function() {
    spyOn(redmine, 'importModel').andThrow('error');
    spyOn(console, 'error');

    actions.handleImportModel();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle remove model", function() {
    spyOn(redmine, 'removeModel').andReturn();
    spyOn(console, 'log');

    actions.handleRemoveModel("sample");

    expect(redmine.removeModel).toHaveBeenCalledWith("sample");
    expect(console.log).toHaveBeenCalledWith('Model successfully removed: sample');
  });

  it("should handle remove model and catch error", function() {
    spyOn(redmine, 'removeModel').andThrow('error');
    spyOn(console, 'error');

    actions.handleRemoveModel();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle list models", function() {
    spyOn(redmine, 'listModels').andReturn(["sample"]);
    spyOn(console, 'log');

    actions.handleListModels();

    expect(redmine.listModels).toHaveBeenCalledWith();
    expect(console.log).toHaveBeenCalledWith('sample');
  });

  it("should handle list models and catch error", function() {
    spyOn(redmine, 'listModels').andThrow('error');
    spyOn(console, 'error');

    actions.handleListModels();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle generate issues", function() {
    var options = {options:[]};
    var result = [1,2,3];

    spyOn(redmine, 'generateIssues').andReturn(result);
    spyOn(console, 'log');

    actions.handleGenerateIssues("project", "model", options);

    expect(redmine.generateIssues).toHaveBeenCalledWith("project", "model", options);
    expect(console.log).toHaveBeenCalledWith('Successfully generated issues ' + result.join(", "));
  });

  it("should handle generate issues and catch error", function() {
    spyOn(redmine, 'generateIssues').andThrow('error');
    spyOn(console, 'error');

    actions.handleGenerateIssues();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle statuses", function() {
    var statuses = {statuses: []};

    spyOn(redmine, 'getStatuses').andReturn(statuses);
    spyOn(printer, 'printStatuses');

    actions.handleStatuses();

    expect(redmine.getStatuses).toHaveBeenCalled();
    expect(printer.printStatuses).toHaveBeenCalledWith(statuses);
  });

  it("should handle statuses and catch error", function() {
    spyOn(redmine, 'getStatuses').andThrow('error');
    spyOn(console, 'error');

    actions.handleStatuses();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle trackers", function() {
    var trackers = {trackers: []};

    spyOn(redmine, 'getTrackers').andReturn(trackers);
    spyOn(printer, 'printTrackers');

    actions.handleTrackers();

    expect(redmine.getTrackers).toHaveBeenCalled();
    expect(printer.printTrackers).toHaveBeenCalledWith(trackers);
  });

  it("should handle trackers and catch error", function() {
    spyOn(redmine, 'getTrackers').andThrow('error');
    spyOn(console, 'error');

    actions.handleTrackers();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle priorities", function() {
    var priorities = {priorities: []};

    spyOn(redmine, 'getPriorities').andReturn(priorities);
    spyOn(printer, 'printPriorities');

    actions.handlePriorities();

    expect(redmine.getPriorities).toHaveBeenCalled();
    expect(printer.printPriorities).toHaveBeenCalledWith(priorities);
  });

  it("should handle priorities and catch error", function() {
    spyOn(redmine, 'getPriorities').andThrow('error');
    spyOn(console, 'error');

    actions.handlePriorities();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle users", function() {
    var users = {users: []};

    spyOn(redmine, 'getUsers').andReturn(users);
    spyOn(printer, 'printUsers');

    actions.handleUsers();

    expect(redmine.getUsers).toHaveBeenCalled();
    expect(printer.printUsers).toHaveBeenCalledWith(users);
  });

  it("should handle users and catch error", function() {
    spyOn(redmine, 'getUsers').andThrow('error');
    spyOn(console, 'error');

    actions.handleUsers();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle user", function() {
    var user = {user: {}};

    spyOn(redmine, 'getUser').andReturn(user);
    spyOn(printer, 'printUser');

    actions.handleUser();

    expect(redmine.getUser).toHaveBeenCalled();
    expect(printer.printUser).toHaveBeenCalledWith(user.user);
  });

  it("should handle user and catch error", function() {
    spyOn(redmine, 'getUser').andThrow('error');
    spyOn(console, 'error');

    actions.handleUser();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle open", function() {
    var projects = {projects: []};

    spyOn(redmine, 'open');

    actions.handleOpen();

    expect(redmine.open).toHaveBeenCalled();
  });

  it("should handle open and catch error", function() {
    spyOn(redmine, 'open').andThrow('error');
    spyOn(console, 'error');

    actions.handleOpen();

    expect(console.error).toHaveBeenCalledWith('error');
  });

});
