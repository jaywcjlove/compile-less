import path from 'path';
import fs from 'fs-extra';
import { getLessFiles } from './getLessFiles';
import { executeLess, IOutputFile } from './executeLess';

export interface ICompileOption {
  out: string;
  combine?: string;
  rmGlobal?: boolean;
  excludeCss?: boolean;
}

export async function getProjectName() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  let projectName = '';
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJSON(pkgPath);
    projectName = pkg.name;
  }
  return projectName
}

export default async function compile(dir: string, option: ICompileOption) {
  const { excludeCss, rmGlobal, combine, out, ...otherOpts } = option || {};
  const inputDir = path.join(process.cwd(), dir);
  try {
    const projectName = await getProjectName();
    const files: Array<string> = await getLessFiles(inputDir, excludeCss ? /\.(less)$/ : undefined);
    const lessSource = await Promise.all(files.map(async (lessPath: string) => {
      return executeLess(lessPath, { rmGlobal, ...otherOpts });
    }));

    if (combine) {
      const outputCssFile = path.join(process.cwd(), combine);
      const cssStr: Array<string> = lessSource.map((item: IOutputFile) => item.css);
      if (!!cssStr.join('').trim()) {
        await fs.outputFile(outputCssFile, cssStr.join(''));
        await log(path.relative(process.cwd(), outputCssFile));
      } else {
        console.log(`🚧 \x1b[35m${projectName}\x1b[0m =>\x1b[33m No content is output.\x1b[0m`);
      }
    } else {
      const outputDir = path.join(process.cwd(), out);
      await Promise.all(lessSource.map(async (item: IOutputFile) => {
        return outputFile(item, inputDir, outputDir);
      }));
    }
  } catch (error) {
    console.log('error:', error);
  }
}

export async function outputFile(data: IOutputFile, inputDir: string, outputDir: string) {
  try {
    const logPathIn = path.relative(process.cwd(), data.path);
    data.path = data.path.replace(inputDir, outputDir).replace(/.less$/, '.css');
    const logPathOut = path.relative(process.cwd(), data.path);
    await log(logPathOut, logPathIn);
    await fs.outputFile(data.path, data.css);
    if (data.imports && data.imports.length > 0) {
      // console.log('\x1b[35m imports-> \x1b[0m:', data.imports);
    }
  } catch (error) {
    throw error;
  }
}

export async function log(output: string, input?: string) {
  const projectName = await getProjectName();
  if (input) {
    console.log(`♻️ \x1b[32m ${projectName}\x1b[0m: ${input} ┈> ${output}`);
  } else {
    console.log(`♻️ \x1b[32m ${projectName}\x1b[0m: Output one file: ┈> ${output}`);
  }
}