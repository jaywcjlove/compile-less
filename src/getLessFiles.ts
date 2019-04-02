const dirTree = require('directory-tree');

export interface IDirTreeItem {
  path: string;
  name: string;
  size: number;
  extension: number;
  type: number;
}

export function getLessFiles(folder: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    const lessPaths: Array<string> = [];
    dirTree(folder, {
      extensions: /\.(less)$/
    }, (item: IDirTreeItem) => {
      lessPaths.push(item.path);
    });
    resolve(lessPaths);
  });
}
