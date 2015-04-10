describe('filter.js', function() {
  var rewire = require("rewire");
  var resolver = rewire("../module/resolver.js");

  var redmine = resolver.__get__('redmine');

  it("should resolve history ids to names", function() {
    var statusDetail = {name: 'status_id', old_value: 1, new_value: 2};
    var trackerDetail = {name: 'tracker_id', old_value: 1, new_value: 2};
    var priorityDetail = {name: 'priority_id', old_value: 1, new_value: 2};
    var assigneeDetail = {name: 'assigned_to_id', old_value: 1, new_value: 2};
    var descriptionDetail = {name: 'description', old_value:'old', new_value: 'new'};
    var subjectDetail = {name: 'subject', old_value: 'old', new_value: 'new'};
    var details = [statusDetail, trackerDetail, priorityDetail, assigneeDetail,
                   descriptionDetail, subjectDetail];
    var journals = [{'details': details}];
    var issue = {'journals': journals};

    var fakeStatuses = {issue_statuses:
                        [{id: 1, name: 'New'}, {id: 2, name: 'Resolved'}]};
    var fakeTrackers = {trackers:
                        [{id: 1, name: 'Bug'}, {id: 2, name: 'Feature'}]};
    var fakePriorities = {issue_priorities:
                        [{id: 1, name: 'Normal'}, {id: 2, name: 'High'}]};
    var fakeUsers = {users: [{id: 1, firstname: 'First1', lastname: 'Last1'},
                             {id: 2, firstname: 'First2', lastname: 'Last2'}]};

    spyOn(redmine, 'getStatuses').andReturn(fakeStatuses);
    spyOn(redmine, 'getTrackers').andReturn(fakeTrackers);
    spyOn(redmine, 'getPriorities').andReturn(fakePriorities);
    spyOn(redmine, 'getUsers').andReturn(fakeUsers);

    resolver.resolveHistoryIdsToNames(issue);
    var expected = issue;

    expect(issue.journals[0].details[0].name).toEqual('Status');
    expect(issue.journals[0].details[0].old_value).toEqual('New');
    expect(issue.journals[0].details[0].new_value).toEqual('Resolved');

    expect(issue.journals[0].details[1].name).toEqual('Tracker');
    expect(issue.journals[0].details[1].old_value).toEqual('Bug');
    expect(issue.journals[0].details[1].new_value).toEqual('Feature');

    expect(issue.journals[0].details[2].name).toEqual('Priority');
    expect(issue.journals[0].details[2].old_value).toEqual('Normal');
    expect(issue.journals[0].details[2].new_value).toEqual('High');

    expect(issue.journals[0].details[3].name).toEqual('Assignee');
    expect(issue.journals[0].details[3].old_value).toEqual('First1 Last1');
    expect(issue.journals[0].details[3].new_value).toEqual('First2 Last2');

    expect(issue.journals[0].details[4].name).toEqual('Description');

    expect(issue.journals[0].details[5].name).toEqual('Subject');
  });

  it("should throw for invalid status id", function() {
    var getStatusNameById = resolver.__get__('getStatusNameById');
    resolver.__set__('statuses', {issue_statuses: []});

    expect(getStatusNameById.bind(this, 1)).toThrow('\'1\' is no valid status id.');
  });

  it("should throw for invalid tracker id", function() {
    var getTrackerNameById = resolver.__get__('getTrackerNameById');
    resolver.__set__('trackers', {trackers: []});

    expect(getTrackerNameById.bind(this, 1)).toThrow('\'1\' is no valid tracker id.');
  });

  it("should throw for invalid priority id", function() {
    var getPriorityNameById = resolver.__get__('getPriorityNameById');
    resolver.__set__('priorities', {issue_priorities: []});

    expect(getPriorityNameById.bind(this, 1)).toThrow('\'1\' is no valid priority id.');
  });

  it("should throw for invalid assignee id", function() {
    var getAssigneeNameById = resolver.__get__('getAssigneeNameById');
    resolver.__set__('users', {users: []});

    expect(getAssigneeNameById.bind(this, 1)).toThrow('\'1\' is no valid assignee id.');
  });

});
