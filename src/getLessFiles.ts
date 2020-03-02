import dirTree from 'directory-tree';

export function getLessFiles(folder: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    const lessPaths: Array<string> = [];
    dirTree(folder, {
      extensions: /\.(less)$/
    }, (item) => {
      lessPaths.push(item.path);
    });
    resolve(lessPaths);
  });
}
