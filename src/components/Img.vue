<template>
  <img :alt="realAlt" @load="next" @error="next" :src="realSrc" />
</template>

<script>
  import Vue from 'vue';
  import util from 'wangct-util';
  import NormalImg from '../assets/logo.png';

  const addToQueue = (function addToQueue(){
    const list = [];
    const queue = util.queue({
      list,
      func(item,cb){
        item.load(cb);
      },
      limit:5
    });
    return function(item){
      if(!list.includes(item)){
        list.push(item);
        queue.start();
      }
    }
  })();


  const component = {
    name: 'WImg',
    props:['src','alt'],
    data() {
      return {
        realSrc:NormalImg
      }
    },
    methods: {
      load(cb){
        if(this.isUnmount){
          cb();
        }else{
          this.loadFunc = cb;
          const {src = NormalImg,realSrc} = this;
          if(src === realSrc){
            this.next();
          }else{
            this.realSrc = src;
          }
        }
      },
      next(){
        util.callFunc(this.loadFunc);
        this.loadFunc = null;
      },
      addToQueue(){
        if(this.src !== this.realSrc){
          addToQueue(this);
        }
      }
    },
    computed: {
      realAlt(){
        return this.alt || '图片加载失败'
      }
    },

    mounted(){
      this.addToQueue();
    },
    updated(){
      this.addToQueue();
    },
    beforeDestroy() {
      this.isUnmount = true;
    }
  };
  component.install = function (Vue) {
    Vue.component(component.name, component);
  };
  export default component;
</script>

<style scoped lang="less">

</style>
