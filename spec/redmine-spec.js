describe('redmine.js', function() {
  var rewire = require("rewire");
  var redmine = rewire("../module/redmine.js");

  it("should throw when not connected", function() {
    var nconf = redmine.__get__('nconf');
    spyOn(nconf, 'get').andReturn(null);

    var throwWhenNotConnected = redmine.__get__('throwWhenNotConnected');

    expect(throwWhenNotConnected).toThrow('Not connected.');
  });

  it("should get data from path", function() {
    var get = redmine.__get__('get');

    var request = function(){return 'data'};
    redmine.__set__('request', request);

    var actual = get('/path', 'url', 'apiKey');
    var expected = 'data';

    expect(actual).toEqual(expected);
  });

  it("should connect", function() {
    var user = {user: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.connect('url', 'apiKey');
    var expected = user.user;

    expect(actual).toEqual(expected);
  });

  it("should get projects", function() {
    var projects = {projects: []};
    var response = { getBody : function(){return JSON.stringify(projects)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getProjects();
    var expected = projects;

    expect(actual).toEqual(expected);
  });

  it("should get project", function() {
    var project = {project: {}};
    var response = { getBody : function(){return JSON.stringify(project)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getProject('identifier');
    var expected = project;

    expect(actual).toEqual(expected);
  });

  it("should get project memberships", function() {
    var memberships = {memberships: []};
    var response = { getBody : function(){return JSON.stringify(memberships)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getProjectMemberships('identifier');
    var expected = memberships;

    expect(actual).toEqual(expected);
  });

  it("should get project memberships grouped by role", function() {
    var memberships = {memberships: [
                        {user:{name:'Member1'},roles:[{name:'Role1'}]},
                        {user:{name:'Member2'},roles:[{name:'Role2'}]},
                        {user:{name:'Member3'},roles:[{name:'Role1'},{name:'Role2'}]},
                        {user:{name:'Member4'},roles:[{name:'Role1'}]}
                      ]};
    var response = { getBody : function(){return JSON.stringify(memberships)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getProjectMembershipsGroupedByRole('identifier');
    var expected = {'Role1':{name:'Role1',
                             members:['Member1','Member3','Member4']},
                    'Role2':{name:'Role2',
                             members:['Member2','Member3']}};

    expect(actual).toEqual(expected);
  });

  it("should get issues", function() {
    var issues = {issues: []};
    var response = { getBody : function(){return JSON.stringify(issues)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getIssues();
    var expected = issues;

    expect(actual).toEqual(expected);
  });

  it("should get issue", function() {
    var issue = {issue: {journals: []}};
    var response = { getBody : function(){return JSON.stringify(issue)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getIssue(1, {history: true});
    var expected = issue;

    expect(actual).toEqual(expected);
  });

  it("should get statuses", function() {
    var statuses = {issue_statuses: []};
    var response = { getBody : function(){return JSON.stringify(statuses)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getStatuses();
    var expected = statuses;

    expect(actual).toEqual(expected);
  });

  it("should get status id by name", function() {
    var statuses = {issue_statuses: [{id:1, name: 'name'}]};
    spyOn(redmine, 'getStatuses').andReturn(statuses);

    var actual = redmine.getStatusIdByName('name');
    var expected = 1;

    expect(actual).toEqual(expected);
  });

  it("should get status name by id", function() {
    var statuses = {issue_statuses: [{id:1, name: 'name'}]};
    spyOn(redmine, 'getStatuses').andReturn(statuses);

    var actual = redmine.getStatusNameById(1);
    var expected = 'name';

    expect(actual).toEqual(expected);
  });

  it("should get trackers", function() {
    var trackers = {trackers: []};
    var response = { getBody : function(){return JSON.stringify(trackers)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getTrackers();
    var expected = trackers;

    expect(actual).toEqual(expected);
  });

  it("should get tracker id by name", function() {
    var trackers = {trackers: [{id:1, name: 'name'}]};
    spyOn(redmine, 'getTrackers').andReturn(trackers);

    var actual = redmine.getTrackerIdByName('name');
    var expected = 1;

    expect(actual).toEqual(expected);
  });

  it("should get tracker name by id", function() {
    var trackers = {trackers: [{id:1, name: 'name'}]};
    spyOn(redmine, 'getTrackers').andReturn(trackers);

    var actual = redmine.getTrackerNameById(1);
    var expected = 'name';

    expect(actual).toEqual(expected);
  });

  it("should get priorities", function() {
    var priorities = {issue_priorities: []};
    var response = { getBody : function(){return JSON.stringify(priorities)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getPriorities();
    var expected = priorities;

    expect(actual).toEqual(expected);
  });

  it("should get priority id by name", function() {
    var priorities = {issue_priorities: [{id:1, name: 'name'}]};
    spyOn(redmine, 'getPriorities').andReturn(priorities);

    var actual = redmine.getPriorityIdByName('name');
    var expected = 1;

    expect(actual).toEqual(expected);
  });

  it("should get priority name by id", function() {
    var priorities = {issue_priorities: [{id:1, name: 'name'}]};
    spyOn(redmine, 'getPriorities').andReturn(priorities);

    var actual = redmine.getPriorityNameById(1);
    var expected = 'name';

    expect(actual).toEqual(expected);
  });

  it("should get users", function() {
    var users = {users: []};
    var response = { getBody : function(){return JSON.stringify(users)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getUsers();
    var expected = users;

    expect(actual).toEqual(expected);
  });

  it("should get assignee name by id", function() {
    var users = {users: [{id:1, firstname: 'first', lastname: 'last'}]};
    spyOn(redmine, 'getUsers').andReturn(users);

    var actual = redmine.getAssigneeNameById(1);
    var expected = 'first last';

    expect(actual).toEqual(expected);
  });

  it("should open url in browser", function() {
    var openInBrowser = jasmine.createSpy();
    redmine.__set__('openInBrowser', openInBrowser);

    var nconf = redmine.__get__('nconf');
    spyOn(nconf, 'get').andReturn('url');

    redmine.open(1);

    expect(openInBrowser).toHaveBeenCalledWith('url/issues/1');
  });

});
