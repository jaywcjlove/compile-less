import fs from 'fs-extra';
import less from 'less';
import { spawn } from 'child_process';
// @ts-ignore
import LessPluginAutoPrefix from 'less-plugin-autoprefix';

const autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
});

export interface IOutputFile extends Less.RenderOutput {
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

export type ExecuteLessOptions = Less.Options & {
  rmGlobal?: boolean;
}

export function executeLess(lessPath: string, options?: ExecuteLessOptions): Promise<IOutputFile> {
  const lessStr = fs.readFileSync(lessPath);
  const { rmGlobal, ...other } = options || {};
  return new Promise((resolve, reject) => {
    const options: Less.Options = {
      depends: false,
      compress: false,
      lint: false,
      plugins: [autoprefixPlugin as Less.Plugin],
      ...other,
      filename: lessPath,
    }

    let lessStrTo = lessStr.toString();
    if (rmGlobal) {
      lessStrTo = lessStrTo.replace(/:global\((.*)\)/g, '$1');
    }
    less.render(lessStrTo, options).then((output: Less.RenderOutput) => {
      if (rmGlobal) {
        output.css = output.css.replace(/:global\s+\{([\s\S]*?)(\s.+)?\}/g, '')
          .replace(/(:global\s+)|(\s.+:global\s+)/g, '')
      }
      resolve({
        less: lessStr.toString(),
        path: lessPath,
        // css: '',
        // map: 'string',
        // imports: [],
        ...output,
      });
    }).catch((e: any) => {
      reject(e);
    });
  });
}
