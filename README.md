compile-less
===

![Build compile-less](https://github.com/jaywcjlove/compile-less/workflows/Build%20compile-less/badge.svg)
[![](https://img.shields.io/github/issues/jaywcjlove/compile-less.svg)](https://github.com/jaywcjlove/compile-less/issues)
[![](https://img.shields.io/github/forks/jaywcjlove/compile-less.svg)](https://github.com/jaywcjlove/compile-less/network)
[![](https://img.shields.io/github/stars/jaywcjlove/compile-less.svg)](https://github.com/jaywcjlove/compile-less/stargazers)
[![](https://img.shields.io/github/release/jaywcjlove/compile-less)](https://github.com/jaywcjlove/compile-less/releases)
[![](https://img.shields.io/npm/v/compile-less-cli.svg)](https://www.npmjs.com/package/compile-less-cli)

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
  -w, --watch                Watch and compile CSS files.
  --exclude-css              Exclude CSS file compilation.
  -r, --rm-global            Remove ":global" and ":global(className)".
  -h, --help                 display help for command

Examples:

  $ compile-less -d src -o css
  $ compile-less -d src -o css --watch
  $ compile-less -d src -o css --watch --exclude-css
  $ compile-less -d src -o out --combine out/dist.css
```

### Development

Listen for files compiled with TypeScript

```bash
npm run start
npm run build
```

```bash
cd test
compile-less -d src -o out
```