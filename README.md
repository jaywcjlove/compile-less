compile-less
===

All `.less` files are compiled into `.css` files.

### Install

```bash
npm i compile-less-cli --save-dev
```

### Basic Usage

```js
const compileLess = require('compile-less-cli');

compileLess('src', {
  out: 'out',              // Output directory.
  combine: 'dist/uiw.css', // Combine CSS files.
});
```

### Command Line

Command help: 

```bash
Usage: compile-less <command> [options]

All .less files are output to a .css file.

Options:
  -v, --version              output the version number
  -d, --dir <dir-path>       Less file directory (default: "src")
  -o, --out <dir-path>       Output directory.
  -c, --combine <file-name>  Combine CSS files.
  -h, --help                 output usage information

  Examples:

  $ compile-less -d src -o css
```

### Development

Listen for files compiled with TypeScript

```bash
npm run dev
npm run compile
```

```bash
cd test
compile-less -d src -o out
```