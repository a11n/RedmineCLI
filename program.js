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
  .command('issues')
  .description('Display issues.')
  .option('-P, --project <project>', 'Only display issues for the specified project.')
  .option('-p, --priority <priority>', 'Only display issues with specified priority.')
  .option('-a, --assignee <assignee>', 'Only display issues for the specified assignee.')
  .option('-s, --status <status>', 'Only display issues with the specified status.')
  .option('-t, --tracker <tracker>', 'Only display issues for the specified tracker.')
  .action(actions.handleIssues);

program
  .command('issue <id>')
  .description('Display issue details.')
  .action(actions.handleIssue);

  program
    .command('statuses')
    .description('Display available issue statuses.')
    .action(actions.handleStatuses);

program
  .parse(process.argv);

if (!program.args.length) program.help();
