import util from 'wangct-util';
import Vue from 'vue';
import Vuex from 'vuex';
import models from '../temp/model';
import vueUtil from '../utils/vueUtil';

Vue.use(Vuex);

const mutations = {};
const actions = {};
const state = {};
const step = '_';

models.forEach(item => {
  const {namespace,reducers = {},actions:actionsData = {}} = item;
  state[namespace] = item.state;
  Object.keys(reducers).forEach(key => {
    mutations[namespace + step + key] = (state,payload) => {
      util.callFunc(reducers[key],state[namespace],payload,state);
    };
  });
  Object.keys(actionsData).forEach(key => {
    actions[namespace + step + key] = (context,payload) => {
      util.callFunc(actionsData[key],payload,vueUtil.getDispatch(namespace),context.state);
    };
  });
});



const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters:{
    name(state){
      return state.name + ' chuitong';
    }
  }
});

function dispatch(payload){
  let {type} = payload;
  type = type.split('/').join(step);
  if(actions[type]){
    store.dispatch(type,payload);
  }
  if(mutations[type]){
    store.commit(type,payload);
  }
}

vueUtil.setDispatch(dispatch);

export default store;
