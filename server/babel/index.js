
const Babel = require('wangct-babel');
const t = +new Date();
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);

const babel = require('babel-core');

babel.transformFile(resolve('src/components/Auth.vue'), {
  presets: ['vue','env','stage-0'],
  plugins: ["transform-decorators-legacy"]
}, (err, result) => {
  console.log(err,result);
});
