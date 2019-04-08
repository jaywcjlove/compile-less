const fs = require('fs-extra');
// const path = require('path');
const less = require('less');
const { spawn } = require('child_process');

const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
});

export interface IOutputFile {
  css: string;
  imports: string;
  path: string;
  less?: string;
}


export function execute(command: string) {
  return new Promise((resolve, reject) => {
    const subProcess = spawn('bash');
    function onData(data: string | Buffer | Uint8Array) {
      process.stdout.write(data);
    }
    subProcess.on('error', (error: { message: any; }) => {
      reject(new Error(`command failed: ${command}; ${error.message ? error.message : ''}`));
    });
    subProcess.stdout.on('data', onData);
    subProcess.stderr.on('data', onData);
    subProcess.on('close', (code: {} | PromiseLike<{}> | undefined) => {
      resolve(code);
    });
    subProcess.stdin.write(`${command} \n`);
    subProcess.stdin.end();
  });
}

export function executeLess(lessPath: string, rmGlobal?: boolean) {
  const lessStr = fs.readFileSync(lessPath);
  return new Promise((resolve, reject) => {
    less.render(lessStr.toString(), {
      plugins: [autoprefixPlugin]
    }).then(async (output: IOutputFile) => {
      output.less = lessStr.toString();
      if (rmGlobal) {
        output.css = output.css.replace(/:global\((.*)\)/g, '$1').replace(/:global/g, '');
      }
      output.path = lessPath;
      resolve(output);
    }).catch((e: any) => {
      reject(e);
    });
  });
}
