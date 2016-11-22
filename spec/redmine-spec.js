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

  it("should put data to path", function() {
    var put = redmine.__get__('put');

    var request = function(){return 'data'};
    redmine.__set__('request', request);

    var actual = put('/path', {data: 'data'});
    var expected = 'data';

    expect(actual).toEqual(expected);
  });

  it("should post data to path", function() {
    var post = redmine.__get__('post');

    var request = function(){return 'data'};
    redmine.__set__('request', request);

    var actual = post('/path', {data: 'data'});
    var expected = 'data';

    expect(actual).toEqual(expected);
  });

  it("should connect", function() {
    var user = {user: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    var nconf = redmine.__get__('nconf');
    spyOn(nconf, 'save');

    var actual = redmine.connect('url', 'apiKey');
    var expected = user.user;

    expect(actual).toEqual(expected);
    expect(nconf.save).toHaveBeenCalled();
  });

  it("should throw on invalid result", function() {
    var user = {invalid: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    expect(redmine.connect).toThrow();
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

  it("should update project", function() {
    var put = jasmine.createSpy('post');
    put.andReturn({statusCode:200});
    redmine.__set__('put', put);

    var options = {
      description: 'Description', public: true, parent: '1'
    };

    redmine.updateProject('identifier', options);
  });

  it("should update project and throw error", function() {
    var put = jasmine.createSpy('post');
    put.andReturn({statusCode:500});
    redmine.__set__('put', put);

    var options = {};

    expect(redmine.updateProject.bind(this, 'identifier', options))
      .toThrow('Could not update project:\nServer responded with statuscode 500');
  });

  it("should create project", function() {
    var project = {project:{identifier:'project'}};
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:201,
                    getBody: function(){return JSON.stringify(project)}});
    redmine.__set__('post', post);

    var options = {
      description: 'Description', public: true, parent: '1'
    };

    var actual = redmine.createProject('name', 'identifier', options);
    var expected = project;

    expect(actual).toEqual(expected);
  });

  it("should create project and throw error", function() {
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:500});
    redmine.__set__('post', post);

    var options = {};

    expect(redmine.createProject.bind(this, 'name', 'identifier', options))
      .toThrow('Could not create project:\nServer responded with statuscode 500');
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

  it("should update issue", function() {
    var put = jasmine.createSpy('put');
    put.andReturn({statusCode:200});
    redmine.__set__('put', put);

    spyOn(redmine, 'getPriorityIdByName').andReturn(1);
    spyOn(redmine, 'getStatusIdByName').andReturn(1);
    spyOn(redmine, 'getTrackerIdByName').andReturn(1);

    var options = {
      priority: 'High', status: 'New', tracker: 'Bug', assignee: 1,
      subject: 'Subject', description: 'Description'
    };

    redmine.updateIssue(1, options);

    expect(put).toHaveBeenCalled();
  });

  it("should update issue and throw error", function() {
    var put = jasmine.createSpy('put');
    put.andReturn({statusCode:500});
    redmine.__set__('put', put);

    var options = {};

    expect(redmine.updateIssue.bind(this, 1, options))
      .toThrow('Could not update issue:\nServer responded with statuscode 500');
  });

  it("should create issue", function() {
    var issue = {issue:{id:1}};
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:201,
                    getBody: function(){return JSON.stringify(issue)}});
    redmine.__set__('post', post);

    spyOn(redmine, 'getPriorityIdByName').andReturn(1);
    spyOn(redmine, 'getStatusIdByName').andReturn(1);
    spyOn(redmine, 'getTrackerIdByName').andReturn(1);

    var options = {
      priority: 'High', status: 'New', tracker: 'Bug',
      assignee: 1, description: 'Description'
    };

    var actual = redmine.createIssue('project', 'subject', options);
    var expected = issue;

    expect(actual).toEqual(expected);
  });

  it("should create issue and warn on 404", function() {
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:404});
    redmine.__set__('post', post);

    var options = {};

    expect(redmine.createIssue.bind(this, 'project', 'subject', options))
      .toThrow('Could not create issue:\nServer responded with statuscode 404.\nThis is most likely the case when the specified project does not exist.\nDoes project \'project\' exist?');
  });

  it("should create issue and throw error", function() {
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:500});
    redmine.__set__('post', post);

    var options = {};

    expect(redmine.createIssue.bind(this, 'project', 'subject', options))
      .toThrow('Could not create issue:\nServer responded with statuscode 500');
  });

  it("should list models", function() {
    var expected = "sample";
    var fs = redmine.__get__('fs');
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("");
    spyOn(fs, 'readdirSync').andReturn([expected + ".json"]);
    
    var actual = redmine.listModels();

    expect(actual).toEqual([expected]);
  });

  it("should list models and return error", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readdirSync').andCallFake(function() {
      throw 'Folder issues-models not found.'
    });
    
    expect(redmine.listModels).toThrow('Could not list models:\nFolder issues-models not found.');
  });

  it("should import model", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'existsSync').andReturn(false);
    spyOn(fs, 'readFileSync').andReturn();
    spyOn(fs, 'openSync').andReturn();
    spyOn(fs, 'writeSync').andReturn();
    
    var actual = redmine.importModel("", "", {encoding: "iso-8859-1"});

    expect(actual).toEqual(true);
  });

  it("should import model with force", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'existsSync').andReturn(true);
    spyOn(fs, 'readFileSync').andReturn();
    spyOn(fs, 'openSync').andReturn();
    spyOn(fs, 'writeSync').andReturn();
    
    var actual = redmine.importModel("", "", {force: true});

    expect(actual).toEqual(true);
  });

  it("should import model and return error", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'existsSync').andReturn(true);
    spyOn(fs, 'readFileSync').andReturn();
    spyOn(fs, 'openSync').andReturn();
    spyOn(fs, 'writeSync').andReturn();

    expect(function() {redmine.importModel("", "", {});}).toThrow("Could not import model:\nModel exists. Remove it first or use --force.");
  });

  it("should remove model", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'existsSync').andReturn(true);
    spyOn(fs, 'unlinkSync').andReturn();
    
    var actual = redmine.removeModel("");

    expect(actual).toEqual(true);
  });

  it("should remove model and return error", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'existsSync').andReturn(false);
    spyOn(fs, 'unlinkSync').andReturn();

    expect(redmine.removeModel).toThrow("Could not remove model:\nModel not found.");
  });

  it("should parse model", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn({
      globals: {
        assignee: 1
      },
      issues: [{
        subject: "Test",
        description: "Test"
      },{
        subject: "Test",
        description: "Test"
      }] 
    });
    
    var actual = redmine.parseModel("");

    expect(actual).toEqual([{
      assignee: 1,
      subject: "Test",
      description: "Test"
    },{
      assignee: 1,
      subject: "Test",
      description: "Test"
    }]);
  });

  it("should parse model and return error Invalid JSON", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn(null);

    expect(redmine.parseModel).toThrow('Could not parse the model:\nInvalid JSON');
  });

  it("should parse model and return error Expected property issues on model", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn({
      globals: {
        assignee: 1
      } 
    });

    expect(redmine.parseModel).toThrow('Could not parse the model:\nExpected property `issues` (Array) on model');
  });

  it("should parse model and return error Expected property issues containing at least 1 item", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn({
      globals: {
        assignee: 1
      },
      issues: []
    });

    expect(redmine.parseModel).toThrow('Could not parse the model:\nExpected property `issues` (Array) containing at least 1 element on model');
  });

  it("should parse model and return error Expected property issues of type Array<object>", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn({
      globals: {
        assignee: 1
      },
      issues: ['error']
    });

    expect(redmine.parseModel).toThrow('Could not parse the model:\nInvalid property `issues` (Array<string>) on model. Expected Array<object>.');
  });

  it("should parse model and return error Expected property globals of type object", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn({
      globals: '',
      issues: [{}]
    });

    expect(redmine.parseModel).toThrow('Could not parse the model:\nInvalid property `globals` (string) on model. Expected object.');
  });

  it("should parse model and return error Expected property subject in all issues", function() {
    var pth = redmine.__get__('pth');
    spyOn(pth, 'join').andReturn("/some/path");

    var fs = redmine.__get__('fs');
    spyOn(fs, 'readFileSync').andReturn("");

    spyOn(JSON, 'parse').andReturn({
      globals: {},
      issues: [{}]
    });

    expect(redmine.parseModel).toThrow('Could not parse the model:\nExpected property `subject` in all issues');
  });

  it("should generate issues", function() {
    var issue = {issue:{id:1}};
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:201,
                    getBody: function(){return JSON.stringify(issue)}});
    redmine.__set__('post', post);

    var options = {
      priority: 'High', status: 'New', tracker: 'Bug',
      assignee: 1, description: 'Description',
      parent: '1', estimated: 1, subject: 'Subject'
    };
    var model = {
      globals: {
        priority: 'High', status: 'New', tracker: 'Bug',
        assignee: 1, description: 'Description',
        parent: 1, estimated: 1, subject: 'Subject'
      },
      issues: [{
        priority: 'High', status: 'New', tracker: 'Bug',
        assignee: 1, description: 'Description',
        parent: 1, estimated: 1, subject: 'Subject'
      }]
    }

    spyOn(redmine, 'getPriorityIdByName').andReturn(1);
    spyOn(redmine, 'getStatusIdByName').andReturn(1);
    spyOn(redmine, 'getTrackerIdByName').andReturn(1);
    spyOn(redmine, 'parseModel').andReturn(model.issues);

    var actual = redmine.generateIssues('project', 'model', options);
    var expected = [issue.issue.id];

    expect(actual).toEqual(expected);
  });

  it("should generate issues and return error 404", function() {
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:404});
    redmine.__set__('post', post);

    spyOn(redmine, 'parseModel').andReturn([{subject: ""}]);

    expect(redmine.generateIssues.bind(this, "project", "model", {})).toThrow('Could not generate any issue:\nServer responded with statuscode 404.\nThis is most likely the case when the specified project does not exist.\nDoes project \'project\' exist?');
  });

  it("should generate issues and return error 500", function() {
    var post = jasmine.createSpy('post');
    post.andReturn({statusCode:500});
    redmine.__set__('post', post);

    issue = {subject: ""};
    spyOn(redmine, 'parseModel').andReturn([issue]);

    expect(redmine.generateIssues.bind(this, "project", "model", {})).toThrow('Could not generate any issue:\nServer responded with statuscode 500\nModel with error:\n' + JSON.stringify(issue));
  });

  it("should generate issues and return error 404 with created issues", function() {
    var post = jasmine.createSpy('post');
    var first = true;
    post.andCallFake(function() {
      if (first) {
        first = false;
        return {
          statusCode: 201,
          getBody: function(){return JSON.stringify({issue:{id: 1}})}
        };
      }
      else
        return {statusCode:404};
    });
    redmine.__set__('post', post);

    issue = {subject: ""};
    spyOn(redmine, 'parseModel').andReturn([issue,issue]);

    expect(redmine.generateIssues.bind(this, "project", "model", {})).toThrow('Could not generate all issues. Issues created: 1. Error:\nServer responded with statuscode 404.\nThis is most likely the case when the specified project does not exist.\nDoes project \'project\' exist?');
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

  it("should get user", function() {
    var user = {user: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    var actual = redmine.getUser();
    var expected = user;

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

  it('could not resolve status id by name', function(){
    var statuses = {issue_statuses: []};
    spyOn(redmine, 'getStatuses').andReturn(statuses);
    expect(redmine.getStatusIdByName.bind(this, 'name'))
      .toThrow('\'name\' is no valid status.');
  });

  it('could not resolve tracker id by name', function(){
    var trackers = {trackers: []};
    spyOn(redmine, 'getTrackers').andReturn(trackers);
    expect(redmine.getTrackerIdByName.bind(this, 'name'))
      .toThrow('\'name\' is no valid tracker.');
  });

  it('could not resolve priority id by name', function(){
    var priorities = {issue_priorities: []};
    spyOn(redmine, 'getPriorities').andReturn(priorities);
    expect(redmine.getPriorityIdByName.bind(this, 'name'))
      .toThrow('\'name\' is no valid priority.');
  });

  it('could not resolve status name by id', function(){
    var statuses = {issue_statuses: []};
    spyOn(redmine, 'getStatuses').andReturn(statuses);
    expect(redmine.getStatusNameById.bind(this, 1))
      .toThrow('\'1\' is no valid status id.');
  });

  it('could not resolve tracker name by id', function(){
    var trackers = {trackers: []};
    spyOn(redmine, 'getTrackers').andReturn(trackers);
    expect(redmine.getTrackerNameById.bind(this, 1))
      .toThrow('\'1\' is no valid tracker id.');
  });

  it('could not resolve priority name by id', function(){
    var priorities = {issue_priorities: []};
    spyOn(redmine, 'getPriorities').andReturn(priorities);
    expect(redmine.getPriorityNameById.bind(this, 1))
      .toThrow('\'1\' is no valid priority id.');
  });

  it('could not resolve assignee name by id', function(){
    var users = {users: []};
    spyOn(redmine, 'getUsers').andReturn(users);
    expect(redmine.getAssigneeNameById.bind(this, 1))
      .toThrow('\'1\' is no valid assignee id.');
  });

  describe('throws (on error in response)', function(){
    var redmine = rewire("../module/redmine.js")

    //before all
    var response = { getBody : function(){return undefined;}};
    redmine.__set__('get', function(){return response;});
    redmine.__set__('throwWhenNotConnected', function(){});

    it('could not connect', function(){
      expect(redmine.connect.bind(this, 'server'))
        .toThrow('Connection to \'server\' failed.');
    });

    it('could not load projects', function(){
      expect(redmine.getProjects).toThrow('Could not load projects.');
    });

    it('could not load project', function(){
      expect(redmine.getProject).toThrow('Could not load project.');
    });

    it('could not load issues', function(){
      expect(redmine.getIssues).toThrow('Could not load issues.');
    });

    it('could not load issue', function(){
      expect(redmine.getIssue.bind(this, 1, {history: true})).toThrow('Could not load issue.');
    });

    it('could not load project memberships', function(){
      expect(redmine.getProjectMemberships).toThrow('Could not load project memberships.');
    });

    it('could not load statuses', function(){
      expect(redmine.getStatuses).toThrow('Could not load issue statuses.');
    });

    it('could not load trackers', function(){
      expect(redmine.getTrackers).toThrow('Could not load trackers.');
    });

    it('could not load priorities', function(){
      expect(redmine.getPriorities).toThrow('Could not load issue priorities.');
    });

    it('could not load users', function(){
      expect(redmine.getUsers).toThrow('Could not load users.');
    });

    it('could not load user', function(){
      expect(redmine.getUser).toThrow('Could not load user.');
    });
  });
});
