import dirTree from 'directory-tree';

export function getLessFiles(folder: string, reg = /\.(less|css)$/) {
  return new Promise<Array<string>>((resolve, reject) => {
    const lessPaths: Array<string> = [];
    dirTree(folder, {
      extensions: reg
    }, (item) => {
      lessPaths.push(item.path);
    });
    resolve(lessPaths);
  });
}
