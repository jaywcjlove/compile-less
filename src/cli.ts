#!/usr/bin/env node

import program from 'commander';
import compile from './compile';

const logs = console.log;

program
  .description('All .less files are output to a .css file.')
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]')


program
  .option('-d, --dir <dir-path>', 'Less file directory', 'src')
  .option('-o, --out <dir-path>', 'Output directory.')
  .option('-c, --combine <file-name>', 'Combine CSS files.')
  .option('-r, --rm-global', 'Remove ":global" and ":global(className)".')

program.on('--help', () => {
  logs('\nExamples:');
  logs();
  logs('  $ compile-less -d src -o css');
  logs('  $ compile-less -d src -o out --combine out/dist.css');
  logs();
  logs();
})

program.parse(process.argv);

if (!program.dir || (!program.out && !program.combine)) {
  program.outputHelp();
} else {
  compile(program.dir, {
    out: program.out,
    combine: program.combine,
    rmGlobal: program.rmGlobal,
  });
}