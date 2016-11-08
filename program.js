var program = require('commander');
var actions = require('./module/actions.js');
var package = require('./package.json');

program
  .version(package.version);

program
  .command('connect <url> <apiKey>')
  .description('Connect to server using API key for authentication.')
  .action(actions.handleConnect);

program
  .command('projects')
  .description('Display projects.')
  .action(actions.handleProjects);

program
  .command('project <identifier>')
  .description('Display project details.')
  .action(actions.handleProject);

program
  .command('update-project <identifier>')
  .description('Update the specified project.')
  .option('-d, --description <description>', 'Update description.')
  .option('-p, --public <boolean>', 'Update visibility.')
  .option('-P, --parent <id>', 'Update parent project.')
  .action(actions.handleUpdateProject);

program
  .command('create-project <name> <identifier>')
  .description('Create a new project.')
  .option('-d, --description <description>', 'Create with description.')
  .option('-p, --public', 'Create public (default is private).')
  .option('-P, --parent <id>', 'Create as child project.')
  .action(actions.handleCreateProject);

program
  .command('issues')
  .description('Display issues.')
  .option('-p, --project <project>', 'Only display issues for the specified project.')
  .option('-P, --priority <priority>', 'Only display issues with specified priority.')
  .option('-a, --assignee <assignee>', 'Only display issues for the specified assignee.')
  .option('-s, --status <status>', 'Only display issues with the specified status.')
  .option('-t, --tracker <tracker>', 'Only display issues for the specified tracker.')
  .option('-m, --me', 'Only display issues assigned to me.')
  .option('-o, --open', 'Only display open issues.')
  .option('-c, --closed', 'Only display closed issues.')
  .action(actions.handleIssues);

program
  .command('issue <id>')
  .description('Display issue details.')
  .option('-H, --history', 'Include issue history (may increase loading time).')
  .action(actions.handleIssue);

program
  .command('update-issue <id>')
  .description('Update the specified issue.')
  .option('-P, --priority <priority>', 'Update the priority.')
  .option('-a, --assignee <userId>', 'Update the assignee.')
  .option('-s, --status <status>', 'Update the status.')
  .option('-t, --tracker <tracker>', 'Update the tracker.')
  .option('-S, --subject <subject>', 'Update the subject.')
  .option('-d, --description <description>', 'Update the description.')
  .action(actions.handleUpdateIssue);

program
  .command('create-issue <project> <subject>')
  .description('Create a new issue.')
  .option('-P, --priority <priority>', 'Create with priority.')
  .option('-p, --parent <parent_issue_id>', 'Create with parent task id.')
  .option('-a, --assignee <userId>', 'Create with assignee.')
  .option('-s, --status <status>', 'Create with status.')
  .option('-t, --tracker <tracker>', 'Create with tracker.')
  .option('-d, --description <description>', 'Create with description.')
  .action(actions.handleCreateIssue);

program
  .command('statuses')
  .description('Display available issue statuses.')
  .action(actions.handleStatuses);

program
  .command('trackers')
  .description('Display available trackers.')
  .action(actions.handleTrackers);

program
  .command('priorities')
  .description('Display available priorities.')
  .action(actions.handlePriorities);

program
  .command('users')
  .description('Display users (requires admin priviliges).')
  .action(actions.handleUsers);

  program
    .command('user <id>')
    .description('Display user details (requires admin priviliges).')
    .action(actions.handleUser);

program
  .command('open <id>')
  .description('Open issue in default browser.')
  .action(actions.handleOpen);

program
  .parse(process.argv);

if (!program.args.length) program.help();
