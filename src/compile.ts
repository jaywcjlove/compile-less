
import path from 'path';
import fs from 'fs-extra';
import { getLessFiles } from './getLessFiles';
import { executeLess, IOutputFile } from './executeLess';

export interface ICompileOtion {
  out: string;
  combine?: string;
  rmGlobal?: boolean;
  excludeCss?: boolean;
}

export default async function compile(dir: string, option: ICompileOtion) {
  const { excludeCss, rmGlobal, combine, out, ...otherOpts } = option || {};
  const inputDir = path.join(process.cwd(), dir);
  try {
    const files: Array<string> = await getLessFiles(inputDir, excludeCss ? /\.(less)$/ : undefined);
    const lessSource = await Promise.all(files.map(async (lessPath: string) => {
      return executeLess(lessPath, { rmGlobal, ...otherOpts });
    }));

    if (combine) {
      const outputCssFile = path.join(process.cwd(), combine);
      const cssStr: Array<string> = lessSource.map((item: IOutputFile) => item.css);
      if (!!cssStr.join('').trim()) {
        await fs.outputFile(outputCssFile, cssStr.join(''));
        console.log('♻️ \x1b[32m =>\x1b[0m:', 'Output one file: ->', outputCssFile);
      } else {
        console.log('🚧\x1b[33m No content is output.\x1b[0m');
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
    const logPathIn = data.path.replace(process.cwd(), '');
    data.path = data.path.replace(inputDir, outputDir).replace(/.less$/, '.css');
    const logPathOut = data.path.replace(process.cwd(), '');
    console.log('♻️ \x1b[32m =>\x1b[0m:', logPathIn, '->', logPathOut);
    await fs.outputFile(data.path, data.css);
    if (data.imports && data.imports.length > 0) {
      // console.log('\x1b[35m imports-> \x1b[0m:', data.imports);
    }
  } catch (error) {
    throw error;
  }
}