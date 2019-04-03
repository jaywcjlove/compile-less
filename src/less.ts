const program = require('commander');
const pkg = require('../package.json');
const compile = require('./compile');

const logs = console.log;

program
  .description('All .less files are output to a .css file.')
  .version(pkg.version, '-v, --version')
  .usage('<command> [options]')


program
  .option('-d, --dir <dir-path>', 'Less file directory', 'src')
  .option('-o, --out <dir-path>', 'Output directory.')
  .option('-c, --combine <file-name>', 'Combine CSS files.')

program.on('--help', () => {
  logs('\n  Examples:');
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
  });
}
