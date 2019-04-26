<template>
  <div>
    <w-swiper :list="list" >
      <div class="swiper-item" slot-scope="item">
        <img :src="item.data.src" />
        <p class="text-title">{{item.data.name}}</p>
        <p class="text-intro">{{item.data.intro}}</p>
      </div>
    </w-swiper>
  </div>

</template>

<script>
  import Vue from 'vue';
  import {Swiper} from '@lib';
  Vue.use(Swiper);
  export default {
    name: "Test",
    data(){
      return {
        name:'wangct',
        list:[
          {
            src:'http://mhfm2tel.cdndm5.com/36/35205/20180801173719_130x174_11.jpg',
            name:'1龙符之王道天下',
            intro:'问这苍茫大地谁主沉浮？'
          },
          {
            src:'http://mhfm9tel.cdndm5.com/45/44073/20180810105535_130x174_13.jpg',
            name:'2娇妻太甜，帝少宠上天',
            intro:'他对她的宠无人能及'
          },
          {
            src:'http://mhfm5tel.cdndm5.com/45/44074/20180810105329_130x174_12.jpg',
            name:'3娇妻太甜，帝少宠上天',
            intro:'他对她的宠无人能及'
          }
        ]
      }
    },
    methods:{
      load(){
        console.log('load');
      }
    }
  }
</script>

<style scoped lang="less">

  .swiper-item{
    .text-title{
      margin-top: 12px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .text-intro{
      font-size: 12px;
      color: #666;
      margin-top: 18px;
      line-height: 18px;
    }
  }
</style>
