# RedmineCLI [![Build Status](https://travis-ci.org/a11n/RedmineCLI.svg)](https://travis-ci.org/a11n/RedmineCLI) [![npm version](http://img.shields.io/npm/v/redmine-cli.svg?style=flat)](https://www.npmjs.com/package/redmine-cli) [![npm license](https://img.shields.io/npm/l/redmine-cli.svg)](https://www.npmjs.com/package/redmine-cli)
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
  connect <url> <apiKey>  Connect to server using API key for authentication.
  projects                Display projects.
  project <identifier>    Display project details.
  issues [options]        Display issues.
  issue <id>              Display issue details.
  statuses                Display available issue statuses.
  trackers                Display available trackers.
  priorities              Display available priorities.
  open <id>               Open issue in default browser.

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
Display all issues assigned to you.
```shell
>redmine issues --me
┌────┬─────────┬────────┬──────────┬────────────────┬────────────────────┐
│ ID │ TRACKER │ STATUS │ PRIORITY │ ASSIGNEE       │ SUBJECT            │
├────┼─────────┼────────┼──────────┼────────────────┼────────────────────┤
│ 2  │ Bug     │ New    │ High     │ Admin Istrator │ This is a bug.     │
├────┼─────────┼────────┼──────────┼────────────────┼────────────────────┤
│ 1  │ Feature │ New    │ Urgent   │ Admin Istrator │ This is a feature. │
└────┴─────────┴────────┴──────────┴────────────────┴────────────────────┘
```

## Remark
It's still under active development!

## Roadmap
* **v0.6.0** (due 2015-04-12)
  * More connection options (noauth for public Redmines and username/password as alternative to apiKey)
  * Textual filter paramter (`redmine issues --status=New --priority=High --tracker=Feature`)
  * Enhanced project details (memberships are grouped by role, like in the web solution)
  * Integration of issue history into issue-details
* **v0.7.0** (due 2015-04-19)
  * Create issues/projects
  * Update issues/projects
