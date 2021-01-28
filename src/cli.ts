#!/usr/bin/env node

import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { executeLess } from './executeLess';
import compile, {outputFile} from './compile';

function outputHelp() {
  console.log('\n Usage: compile-less [options] [--help|h] [--version|v]');
  console.log('\n Options:');
  console.log('');
  console.log('   -v, --version,', 'Show version number');
  console.log('   -h, --help,', 'Displays help information.');
  console.log('   -d, --dir <dir-path>,', 'Less file directory.');
  console.log('   -o, --out <dir-path>,', 'Output directory.');
  console.log('   -c, --combine <file-name>,', 'Combine CSS files.');
  console.log('   -w, --watch,', 'Watch and compile CSS files.');
  console.log('   --exclude-css,', 'Exclude CSS file compilation.');
  console.log('   -r, --rm-global,', 'Remove ":global" and ":global(className)".');
  exampleHelp();
}

const argvs = minimist(process.argv.slice(2));
if (argvs.h || argvs.help) {
  outputHelp()
  process.exit(0);
}
const { version } = require('../package.json');
if (argvs.v || argvs.version) {
  console.log(`\n compile-less v${version}\n`);
  process.exit(0);
}
argvs['rm-global'] = argvs.f = argvs['rm-global'] || argvs.f;
argvs.out = argvs.o = argvs.out || argvs.o;
argvs.dir = argvs.d = argvs.dir || argvs.d;
argvs.watch = argvs.w = argvs.watch || argvs.w;
argvs.combine = argvs.c = argvs.combine || argvs.c;

if (!argvs.dir || (!argvs.out && !argvs.combine)) {
  exampleHelp();
  process.exit(0);
}


;(async () => {
  try {
    const inputDir = path.resolve(argvs.dir)
    if (argvs.watch) {
      chokidar.watch(inputDir).on('all', chokidarWatch).on('ready', () => {
        compile(argvs.dir, {
          out: argvs.out,
          combine: argvs.combine,
          rmGlobal: argvs['rm-global'],
        });
        console.log('Watching for file changes....');
      });
  
    } else {
      await compile(argvs.dir, {
        out: argvs.out,
        combine: argvs.combine,
        rmGlobal: argvs['rm-global'],
      });
    }
  } catch (error) {
    console.log(`\x1b[31m${error.message}\x1b[0m`);
    console.log(error);
    process.exit(1);
  }
})();

function exampleHelp() {
  console.log('\n Example:');
  console.log('');
  console.log('  $\x1b[35m compile-less\x1b[0m \x1b[33m-d src\x1b[0m -o css');
  console.log('  $\x1b[35m compile-less\x1b[0m \x1b[33m-d src\x1b[0m -o css --watch');
  console.log('  $\x1b[35m compile-less\x1b[0m \x1b[33m-d src\x1b[0m -o css --watch --exclude-css');
  console.log('  $\x1b[35m compile-less\x1b[0m \x1b[33m-d src\x1b[0m -o css --combine out/dist.css');
  console.log('');
  console.log(' Copyright 2021');
  console.log('\n');
}

async function chokidarWatch(eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', changePath: string, stats?: fs.Stats) {
  try {
    const reg = argvs.excludeCss ? /\.(less)$/ : /\.(less|css)$/;
    if (eventName === 'change' && reg.test(changePath)){
      if (argvs.combine) {
        return compile(argvs.dir, {
          out: argvs.out,
          combine: argvs.combine,
          rmGlobal: argvs['rm-global'],
        });
      }
      const lessSource = await executeLess(changePath, { rmGlobal: argvs['rm-global'] } );
      outputFile(
        lessSource,
        path.join(process.cwd(), argvs.dir),
        path.join(process.cwd(), argvs.out)
      );
    }
  } catch (error) {
    console.log('\x1b[31m COMPILE-LESS:CLI:ERR:\x1b[0m', error);
  }
}