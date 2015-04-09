describe('filter.js', function() {
  var rewire = require("rewire");
  var filter = rewire("../module/filter.js");

  var redmine = filter.__get__('redmine');

  it("should create issues filters from options", function() {
    var options = {priority: 'High', status: 'New', tracker: 'Bug',
                   me: true, open: true, closed: true};

    spyOn(redmine, 'getPriorityIdByName').andReturn(1);
    spyOn(redmine, 'getStatusIdByName').andReturn(1);
    spyOn(redmine, 'getTrackerIdByName').andReturn(1);

    var actual = filter.issuesFiltersFrom(options);
    var expected = {priority_id : 1, assigned_to_id : 'me',
                    status_id : 'closed', tracker_id : 1};

    expect(actual).toEqual(expected);
  });

});
