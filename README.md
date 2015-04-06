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

## Remark
It's still under active development!

### Roadmap
* Filter issue list
* Issue history
* Modify issues
