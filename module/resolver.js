var redmine = require('./redmine.js');

//cache
var statuses;
var trackers;
var priorities;
var users;

var getStatusNameById = function(id){
  statuses = statuses || redmine.getStatuses().issue_statuses;
  for(var i = 0; i < statuses.length; i++){
    if(id == statuses[i].id)
      return statuses[i].name;
  }

  throw '\''+ id +'\' is not valid status id.';
}

var getTrackerNameById = function(id){
  trackers = trackers || redmine.getTrackers().trackers;
  for(var i = 0; i < trackers.length; i++){
    if(id == trackers[i].id)
      return trackers[i].name;
  }

  throw '\''+ id +'\' is not valid tracker id.';
}

var getPriorityNameById = function(id){
  priorities = priorities || redmine.getPriorities().issue_priorities;
  for(var i = 0; i < priorities.length; i++){
    if(id == priorities[i].id)
      return priorities[i].name;
  }

  throw '\''+ id +'\' is not valid priority id.';
}

var getAssigneeNameById = function(id){
  users = users || redmine.getUsers().users;
  for(var i = 0; i < users.length; i++){
    if(id == users[i].id)
      return users[i].firstname + ' ' + users[i].lastname;
  }

  throw '\''+ id +'\' is not valid assignee id.';
}

exports.resolveHistoryIdsToNames = function(issue){
  var journals = issue.journals;
  for(var i=0; i<journals.length; i++){
    var details = journals[i].details;
    for(var j=0; j<details.length; j++){
      if('status_id' == details[j].name){
        details[j].name = 'Status';
        details[j].old_value = getStatusNameById(details[j].old_value);
        details[j].new_value = getStatusNameById(details[j].new_value);
      } else if('tracker_id' == details[j].name){
        details[j].name = 'Tracker';
        details[j].old_value = getTrackerNameById(details[j].old_value);
        details[j].new_value = getTrackerNameById(details[j].new_value);
      } else if('priority_id' == details[j].name){
        details[j].name = 'Priority';
        details[j].old_value = getPriorityNameById(details[j].old_value);
        details[j].new_value = getPriorityNameById(details[j].new_value);
      } else if('assigned_to_id' == details[j].name){
        details[j].name = 'Assignee';
        try{
          // in case connected user has no admin priviliges,
          // assignee id could not be resolved
          details[j].old_value = details[j].old_value == undefined ? 'nobody' :
                                 getAssigneeNameById(details[j].old_value);
          details[j].new_value = details[j].new_value == undefined ? 'nobody' :
                                 getAssigneeNameById(details[j].new_value);
        } catch(err) {};
      } else if('description' == details[j].name){
        details[j].name = 'Description';
      } else if('subject' == details[j].name){
        details[j].name = 'Subject';
      }
    }
  }
}
