const fs = require('fs');
const path = require('path');
const appPath = process.cwd();
const resolve = (...dir) => path.resolve(appPath,...dir);
const Babel = require('wangct-babel');
const util = require('wangct-server-util');
const {arrayUtil} = util;

const componentConfigPath = 'src/components/config.js';
const componentOutput = 'src/components/index.js';

util.watch({
  src:'src/config',
  callback:updateRouter
});

util.watch({
  src:'src/models',
  callback:updateModel
});
util.watch({
  src:componentConfigPath,
  callback:updateComponent
});



function updateRouter(){
  const time = +new Date();
  console.log('开始生成 router');
  babelConfig(() => {
    const config = require(resolve('temp/src/config/config')).default;
    const outputFilePath = resolve('src/temp/router.js');
    const content = getRouterContent({
      ...config,
      output:outputFilePath,
    });
    fs.writeFile(outputFilePath,content,(err) => {
      if(err){
        console.log(err);
      }else{
        console.log(`成功生成 router ：${outputFilePath} 用时：${+new Date() - time}ms`);
      }
    });
  })
}


function babelConfig(cb){
  const output = resolve('temp/src/config');
  new Babel({
    src:'src/config',
    output,
    option:{
      presets: ['react','env','stage-0'],
      plugins: ["transform-decorators-legacy"]
    },
    success(){
      Object.keys(require.cache).forEach(key => {
        if(key.includes(output)){
          delete require.cache[key];
        }
      });
      cb();
    }
  });
}


function getRouterContent(option){
  const {routes = [],output,isRoot = true,importList = []} = option;
  const filterFields = ['component','children'];
  const valueContent = routes.map(item => {
    const valueContent = Object.keys(item).map(key => {
      let value = item[key];
      if(key === 'component'){
        const relativePath = path.relative(path.dirname(output),resolve('src/pages',value)).replace(/\\/g,'/');
        let {dynamic = option.dynamicImport} = item;
        if(dynamic){
          value = `(resolve) => require(['${relativePath}'],resolve)`;
        }else{
          value = 'c_' + util.random();
          importList.push(`import ${value} from '${relativePath}';\n`);
        }
      }else if(key === 'children'){
        value = getRouterContent({
          ...option,
          routes:value,
          isRoot:false,
          importList
        })
      }
      return `${key}:${util.isString(value) && !filterFields.includes(key) ? `'${value}'` : value.toString()}`;
    }).join(',\n');
    return `{${valueContent}}`
  }).join(',\n');
  const content = `[${valueContent}]`;
  return isRoot ? `import Vue from 'vue';\nimport Router from 'vue-router';\n${arrayUtil.noRepeat(importList).join('')}\nVue.use(Router);\nexport default new Router({mode:'history',
  routes: ${content}\n})` : content;
}


function updateModel(){
  const outModelPath = resolve('src/temp/model.js');
  const time = +new Date();
  console.log('开始生成 model');
  const modelDirPath = resolve('src/models');
  fs.readdir(modelDirPath,(err,data) => {
    if(err){
      console.log(err);
    }else{
      let importAry = [];
      let modelNameAry = data.map(item => {
        let filePath = resolve(modelDirPath,item);
        let relativePath = path.relative(path.resolve(outModelPath,'..'),filePath).replace(/\\/g,'/');
        let fileName = path.basename(item,path.extname(item)) + '_' + +new Date();
        if(relativePath.charAt(0) !== '.'){
          relativePath = './' + relativePath;
        }
        importAry.push(`import ${fileName} from '${relativePath}';`);
        return fileName;
      });
      let content = `${importAry.join('')} export default [${modelNameAry.join(',')}];`;
      fs.writeFile(outModelPath,content,function(err){
        if(err){
          console.log(err);
        }else{
          console.log(`成功生成 model ：${outModelPath} 用时：${+new Date() - time}ms`);
        }
      });
    }
  })
}


function updateComponent(){
  console.log('开始生成 components/index.js');
  const time = +new Date();
  const output = resolve('temp',componentConfigPath);
  util.mkdir(output);
  new Babel({
    src:componentConfigPath,
    output,
    option:{
      presets: ['react','env','stage-0'],
      plugins: ["transform-decorators-legacy"]
    },
    success(){
      Object.keys(require.cache).forEach(key => {
        if(key.includes(output)){
          delete require.cache[key];
        }
      });
      const config = require(output).default;
      const {components = []} = config;
      let importAry = [];
      let modelNameAry = components.map(item => {
        let filePath = resolve(componentConfigPath,'..',item);
        let relativePath = path.relative(path.resolve(componentOutput,'..'),filePath).replace(/\\/g,'/');
        if(relativePath.charAt(0) !== '.'){
          relativePath = './' + relativePath;
        }
        importAry.push(`import ${item} from '${relativePath}';`);
        return item;
      });
      let content = `${importAry.join('')} export {${modelNameAry.join(',')}};`;
      fs.writeFile(componentOutput,content,function(err){
        if(err){
          console.log(err);
        }else{
          console.log(`成功生成 components/index.js ：${componentOutput} 用时：${+new Date() - time}ms`);
          if(typeof cb === 'function'){
            cb();
          }
        }
      });
    }
  });
}
