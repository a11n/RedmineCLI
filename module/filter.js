var removeNullValues = function(object){
  for (var i in object) {
    if (object[i] === null) {
      delete object[i];
    }
  }
}

exports.issuesFiltersFrom = function(options){
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
