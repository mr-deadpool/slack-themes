#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const isRoot = require('is-elevated');
const cli = require('./lib/cli');
const {execute} = require('./lib/command');
const pkg = require('./package.json');

async function run() {
  console.log(chalk.yellow(figlet.textSync('Slack Theme Applier')));
  console.log(chalk.italic(`version ${pkg.version} by @mallowigi`));

  console.log(chalk.cyan('Welcome to the Slack Theme Applier CLI!'));
  console.log('');
  console.log(chalk.red('Please note that this is still experimental and can ruin your Slack application! In the case of a problem, please reinstall Slack.'));
  console.log('');

  if (!isRoot()) {
    console.log(chalk.red('You must be root to execute this command. Run with "sudo mtslack"'));
    process.exit(1);
  }

  // noinspection JSDeclarationsAtScopeStart
  const {ask: answer} = await cli.ask();

  execute(answer);
}

// Start
async function main() {
  clear();
  await checkForUpdates();
}

async function checkForUpdates() {
  // noinspection LocalVariableNamingConventionJS
  const AutoUpdate = require('cli-autoupdate');
  let shouldUpdate = false;

  const update = new AutoUpdate(pkg);
  console.log(chalk.bold('Checking for updates...'));

  update.on('update', () => {
    console.log(chalk.bold('A new update is available! Starting autoupdate...'));
    shouldUpdate = true;
  });
  update.on('finish', async () => {
    console.log(chalk.bold('Finished checking for updates!'));
    if (shouldUpdate) {
      console.log('Update finished. Please rerun the command.');
      process.exit(0);
    }
    else {
      await run();
    }
  });
}

main();
