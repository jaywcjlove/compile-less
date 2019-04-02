
import path from 'path';
import fs from 'fs-extra';
import { getLessFiles } from './getLessFiles';
import { executeLess, IOutputFile } from './executeLess';

module.exports = async function compile(dir: string, out: string) {
  const inputDir = path.join(process.cwd(), dir);
  const outputDir = path.join(process.cwd(), out);
  const files: Array<string> = await getLessFiles(inputDir);
  const lessSource = await Promise.all(files.map(async (lessPath: string) => {
    return executeLess(lessPath);
  }));

  await Promise.all(lessSource.map(async (item: IOutputFile) => {
    const logPathIn = item.path.replace(process.cwd(), '');
    item.path = item.path.replace(inputDir, outputDir).replace(/.less$/, '.css');
    const logPathOut = item.path.replace(process.cwd(), '');
    console.log('log:', logPathIn, '->', logPathOut);
    await fs.outputFile(item.path, item.css);
    if (item.imports && item.imports.length > 0) {
      console.log('imports:', item.imports);
    }
    return item;
  }));
}