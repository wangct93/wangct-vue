<template>
  <div class="container">
    <a-icon type="left" @click="toLeft" />
    <div class="content" ref="content">
      <div :class="{list:true,'no-transition':!animate}" :style="{left:left + 'px'}">
        <div class="item" v-for="item in viewList">
          <slot :data="item" />
        </div>
      </div>
    </div>
    <a-icon type="right" @click="toRight" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import {Icon} from 'ant-design-vue';
  Vue.use(Icon);

  const component = {
    name: 'WSwiper',
    props:['list','interval'],
    data() {
      return {
        animate:true,
        current:1
      }
    },
    methods: {
      check(){
        const {current} = this;
        const len = this.viewList.length;
        if(current === 0){
          this.move(len - 2,true);
        }else if(current === len - 1){
          this.move(1,true);
        }
      },
      move(current,isCheck){
        const len = this.viewList.length;
        this.current = (current + len) % len;
        this.animate = !isCheck;

        if(!isCheck){
          setTimeout(() => {
            this.check();
          },300);
        }
      },
      toLeft(){
        this.move(this.current - 1);
      },
      toRight(){
        this.move(this.current + 1);
      }
    },
    computed: {
      left(){
        const {current} = this;
        const box = this.$refs.content || {};
        return -current * (box.offsetWidth || 0)
      },
      viewList(){
        const {list} = this;
        return [list[list.length - 1],...list,list[0]]
      }
    }
  };
  component.install = function (Vue) {
    Vue.component(component.name, component);
  };
  export default component;
</script>

<style scoped lang="less">
  .container{
    display: flex;
    align-items: center;
    .anticon-left,
    .anticon-right{
      font-size:22px;
      color:#999;
      cursor: pointer;
    }
  }

  .content{
    margin: 0 20px;
    overflow: hidden;
    flex:1;
    white-space: nowrap;
    .list{
      position: relative;
      left: 0;
      top: 0;
      transition:left .3s;
    }
    .item{
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      text-align: center;
    }

    .no-transition{
      transition:none;
    }
  }
</style>
