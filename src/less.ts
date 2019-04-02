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

program.on('--help', () => {
  logs('\n  Examples:');
  logs();
  logs(`  $ compile-less -d src -o css`);
  logs();
  logs();
})

program.parse(process.argv);

if (!program.out || !program.dir) {
  program.outputHelp();
} else {
  compile(program.dir, program.out);
}
