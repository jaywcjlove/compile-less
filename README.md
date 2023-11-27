compile-less
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![CI](https://github.com/jaywcjlove/compile-less/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/compile-less/actions/workflows/ci.yml)
[![npm download](https://img.shields.io/npm/dm/compile-less-cli.svg?style=flat)](https://www.npmjs.com/package/compile-less-cli)
[![releases version](https://img.shields.io/github/release/jaywcjlove/compile-less)](https://github.com/jaywcjlove/compile-less/releases)
[![npm version](https://img.shields.io/npm/v/compile-less-cli.svg)](https://www.npmjs.com/package/compile-less-cli)
[![Coverage Status](https://jaywcjlove.github.io/compile-less/badges.svg)](https://jaywcjlove.github.io/compile-less/lcov-report/)

All `.less` files are compiled into `.css` files.

## Install

```bash
npm i compile-less-cli --save-dev
```

## Basic Usage

```js
const compileLess = require('compile-less-cli');

compileLess('src', {
  out: 'out',              // Output directory.
  combine: 'dist/uiw.css', // Combine CSS files.
});
```

## Command Line

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

## Development

Listen for files compiled with TypeScript

```bash
npm run start
npm run build
```

```bash
cd test
compile-less -d src -o out
```


## License

Licensed under the MIT License.
