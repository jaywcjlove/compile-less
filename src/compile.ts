
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
  const inputDir = path.join(process.cwd(), dir);
  try {
    const files: Array<string> = await getLessFiles(inputDir, option.excludeCss ? /\.(less)$/ : undefined);
    const lessSource = await Promise.all(files.map(async (lessPath: string) => {
      return executeLess(lessPath, option.rmGlobal);
    }));

    if (option.combine) {
      const outputCssFile = path.join(process.cwd(), option.combine);
      const cssStr: Array<string> = lessSource.map((item: IOutputFile) => item.css);
      await fs.outputFile(outputCssFile, cssStr.join(''));
      console.log('log:', 'Output one file: ->', outputCssFile);
    } else {
      const outputDir = path.join(process.cwd(), option.out);
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
    console.log('log:', logPathIn, '->', logPathOut);
    await fs.outputFile(data.path, data.css);
    if (data.imports && data.imports.length > 0) {
      console.log('imports:', data.imports);
    }
  } catch (error) {
    throw error;
  }
}