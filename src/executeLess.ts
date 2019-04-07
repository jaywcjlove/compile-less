const fs = require('fs-extra');
const less = require('less');

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
export function executeLess(lessPath: string) {
  const lessStr = fs.readFileSync(lessPath);
  return new Promise((resolve, reject) => {
    less.render(lessStr.toString(), {
      plugins: [autoprefixPlugin]
    }).then((output: IOutputFile) => {
      output.less = lessStr.toString();
      output.path = lessPath;
      resolve(output);
    }).catch((e: any) => {
      reject(e);
    });
  });
}
