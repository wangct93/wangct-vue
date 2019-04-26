<template>
  <div>
    <slot v-if="isvalid" />
  </div>
</template>

<script>
  import util from 'wangct-util';
  const component = {
    name: 'WAuth',
    props:['or','and','check'],
    data(){
      return {

      }
    },
    methods:{

    },
    computed:{
      isvalid(){
        if(this.$store){
          const {user = {}} = this.$store.state;
          const {auths = []} = user;
          const {or,and,check} = this;
          return util.isFunc(check) ? check(auths) : (!and || and.every(item => auths.includes(item))) && (!or || or.some(item => auths.includes(item)));
        }
      }
    }
  };
  component.install = function (Vue) {
    Vue.component(component.name, component);
  };
  export default component;
</script>

<style scoped lang="less">

</style>
