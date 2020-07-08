#! /usr/bin/env node

const program = require("commander");

program
  .usage('<command> [options]')
  .command('init', 'init a project')
  .command('gulp', 'run gulp order')
  .parse(process.argv);