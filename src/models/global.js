
import util,{objectUtil} from 'wangct-util';

export default {
  namespace: 'global',
  state: {
    name:'wangct'
  },

  actions: {
    updateName(payload,dispatch,state){
      console.log('actions',state);
      dispatch({
        type:'updateField',
        field:'name',
        data:util.random()
      })
    }
  },

  reducers: {
    updateField(state,{field,data}){
      console.log('reducers',state)
      const extState = field === 'multiple' ? data : {[field]:data};
      objectUtil.forEach(extState,(item,key) => {
        state[key] = item;
      });
    }
  }
};

