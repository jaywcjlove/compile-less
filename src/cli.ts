#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { executeLess } from './executeLess';
import compile, {outputFile} from './compile';

const logs = console.log;

program
  .description('All .less files are output to a .css file.')
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]')


program
  .option('-d, --dir <dir-path>', 'Less file directory', 'src')
  .option('-o, --out <dir-path>', 'Output directory.')
  .option('-c, --combine <file-name>', 'Combine CSS files.')
  .option('-w, --watch', 'Watch and compile CSS files.')
  .option('--exclude-css', 'Exclude CSS file compilation.')
  .option('-r, --rm-global', 'Remove ":global" and ":global(className)".')

program.on('--help', () => {
  logs('\nExamples:');
  logs();
  logs('  $ compile-less -d src -o css');
  logs('  $ compile-less -d src -o css --watch');
  logs('  $ compile-less -d src -o css --watch --exclude-css');
  logs('  $ compile-less -d src -o out --combine out/dist.css');
  logs();
  logs();
})

program.parse(process.argv);

if (!program.dir || (!program.out && !program.combine)) {
  program.outputHelp();
} else {
  const inputDir = path.join(process.cwd(), program.dir);
  if (program.watch) {
    chokidar.watch(inputDir).on('all', chokidarWatch).on('ready', () => {
      compile(program.dir, {
        out: program.out,
        combine: program.combine,
        rmGlobal: program.rmGlobal,
      });
      console.log('Watching for file changes....');
    });

  } else {
    compile(program.dir, {
      out: program.out,
      combine: program.combine,
      rmGlobal: program.rmGlobal,
    });
  }
}

async function chokidarWatch(eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', changePath: string, stats?: fs.Stats) {
  try {
    const reg = program.excludeCss ? /\.(less)$/ : /\.(less|css)$/;
    if (eventName === 'change' && reg.test(changePath)){
      if (program.combine) {
        return compile(program.dir, {
          out: program.out,
          combine: program.combine,
          rmGlobal: program.rmGlobal,
        });
      }
      const lessSource = await executeLess(changePath, program.rmGlobal);
      outputFile(
        lessSource,
        path.join(process.cwd(), program.dir),
        path.join(process.cwd(), program.out)
      );
    }
  } catch (error) {
    console.log('CLI:ERR:', error);
  }
}