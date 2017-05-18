# RedmineCLI [![Build Status](https://travis-ci.org/a11n/RedmineCLI.svg)](https://travis-ci.org/a11n/RedmineCLI) [![Coverage Status](https://coveralls.io/repos/a11n/RedmineCLI/badge.svg)](https://coveralls.io/r/a11n/RedmineCLI) [![npm version](http://img.shields.io/npm/v/redmine-cli.svg?style=flat)](https://www.npmjs.com/package/redmine-cli) [![npm license](https://img.shields.io/npm/l/redmine-cli.svg)](https://www.npmjs.com/package/redmine-cli)
A NodeJS, stateful, console-based Redmine client.

## Installation & Setup
```shell
npm install -g redmine-cli
```
Connect to your Redmine instance.
```shell
>redmine connect http://your.server/redmine yourApiKey
```
**Note:** Unless you don't want to switch to another Redmine instance you only need to call this once.

You are all set, have fun :)

## Usage
Display available commands and options.
```shell
>redmine --help
Usage: redmine [options] [command]

Commands:
connect <url> <apiKey>                        Connect to server using API key for authentication.
projects                                      Display projects.
project <identifier>                          Display project details.
update-project [options] <identifier>         Update the specified project.
create-project [options] <name> <identifier>  Create a new project.
issues [options]                              Display issues.
issue [options] <id>                          Display issue details.
update-issue [options] <id>                   Update the specified issue.
create-issue [options] <project> <subject>    Create a new issue.
statuses                                      Display available issue statuses.
trackers                                      Display available trackers.
priorities                                    Display available priorities.
users                                         Display users (requires admin privileges).
user <id>                                     Display user details (requires admin privileges).
open <id>                                     Open issue in default browser.


Options:
  -h, --help     output usage information
  -V, --version  output the version number
```

Or display the options of a certain command.
```shell
>redmine issues --help
  Usage: issues [options]

  Display issues.

  Options:
    -h, --help                 output usage information
    -p, --project <project>    Only display issues for the specified project.
    -P, --priority <priority>  Only display issues with specified priority.
    -a, --assignee <assignee>  Only display issues for the specified assignee.
    -s, --status <status>      Only display issues with the specified status.
    -t, --tracker <tracker>    Only display issues for the specified tracker.
    -m, --me                   Only display issues assigned to me.
    -o, --open                 Only display open issues.
    -c, --closed               Only display closed issues.
```

## Example
Display all issues assigned to you with status `New`.
```shell
>redmine issues --me --status=New
ID  TRACKER  STATUS  PRIORITY  ASSIGNEE        SUBJECT
#2  Bug      New     High      Admin Istrator  This is a bug.
#1  Feature  New     Urgent    Admin Istrator  This is a feature.
```

Display a certain issue with history.
```shell
>redmine issue 2 --history
BUG #2
This is a feature.
Added by Admin Istrator a month ago. Updated a day ago.

STATUS  PRIORITY  ASSIGNEE
New     Normal    Admin Istrator

DESCRIPTION
This is a feature description.
HISTORY
 * Updated by Admin Istrator 21 days ago.
   Status changed from 'In Progress' to 'New'.
 * Updated by Admin Istrator 21 days ago.
   Tracker changed from 'Feature' to 'Bug'.
 * Updated by Admin Istrator 21 days ago.
   Assignee changed from 'nobody' to 'John Doe'.
 * Updated by Admin Istrator 14 days ago.
   Assignee changed from 'John Doe' to 'Admin Istrator'.
 * Updated by Admin Istrator a day ago.
   Priority changed from 'High' to 'Normal'.
```
**Note:** In order to resolve some properties within the history, displaying an issue with history may take a few moments longer. If you are not interested in the history just skip the according option.

## Remark
It's still under ~~active~~ development!

## Changelog
### v0.8.0
* New features
 * Update projects
 * Create projects
* Improvements
 * Extended issue details

### v0.7.0
* New features
  * Update Issues
  * Create Issues
  * Display user details
* Improved stability
  * 100% test coverage

### v0.6.0
* Several improvements
  * Memberlist in project details is now grouped by role
  * Removed table borders to be able to display more actual data on screen
  * Added bold formatting for section headers
  * Connect command is now validating provided `url`and `apiKey`
  * Enhanced some templates to either hide sections when no data is set or to display 'XX not set' message
* New features
  * Filters for issue list do now accept human readable names instead of internal ids
  * Issue details may now also be displayed with issue history
  * Added new 'users' command to display list of users
* Fixes
  * Fixed text of some error messages
