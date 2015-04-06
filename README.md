# RedmineCLI
A NodeJS, stateful, console-based Redmine client.

## Installation
```shell
npm install -g redmine-cli
```

##Usage
Display available commands and options.
```shell
>redmine --help
Usage: redmine [options] [command]


  Commands:

    connect <url> <apiKey>  Connect to server using API key for authentication.
    projects                Display projects.
    issues [options]        Display issues.
    issue <id>              Display issue details.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

Connect to your Redmine instance.
```shell
>redmine connect http://your.server/redmine yourApiKey
```

## Remark
It's still under active development!

### Roadmap
* Filter issue list
* Issue history
* Project details
* Display available Trackers, Statuses and Priorities
* Modify issues
