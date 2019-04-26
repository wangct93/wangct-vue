
import util from 'wangct-util';

export default {
  setDispatch,
  getDispatch
};

function setDispatch(dispatch){
  this.dispatch = dispatch;
}

function getDispatch(modelName = 'global') {
  return (action) => {
    const {type = ''} = action;
    util.callFunc(this.dispatch,{
      ...action,
      type:type.includes('/') ? type : modelName + '/' + type
    });
  }
}
