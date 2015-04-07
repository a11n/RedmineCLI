var redmine = require('./redmine.js');

var removeNullValues = function(object){
  for (var i in object) {
    if (object[i] === null) {
      delete object[i];
    }
  }
}

var resolveIdsForNames = function(options){
  if(options.priority) options.priority = redmine.getPriorityIdByName(options.priority);
  if(options.status) options.status = redmine.getStatusIdByName(options.status);
  if(options.tracker) options.tracker = redmine.getTrackerIdByName(options.tracker);
}

exports.issuesFiltersFrom = function(options){
  resolveIdsForNames(options);

  var filters = {
    'project_id': options.project || null,
    'priority_id': options.priority || null,
    'assigned_to_id': options.assignee || null,
    'status_id': options.status || null,
    'tracker_id': options.tracker || null
  };

  if(options.me) filters.assigned_to_id = 'me';
  if(options.open) filters.status_id = 'open';
  if(options.closed) filters.status_id = 'closed';

  removeNullValues(filters);

  return filters;
}
