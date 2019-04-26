<template>
  <div>
    <div ref="sign" v-if="!loaded" :style="{height:styleHeight}"></div>
    <slot v-else />
  </div>
</template>

<script>
  const component = {
    name: 'w-async-visual',
    props: ['height'],
    data() {
      return {
        loaded: false
      }
    },
    methods: {
      addScrollEvent() {
        const elem = this.getEventElem();
        if(elem === this.oldScrollElem){
          return;
        }
        this.oldScrollElem = elem;
        if (elem && elem.addEventListener) {
          const scrollEvent = this.scrollEvent.bind(this);
          elem.addEventListener('scroll',scrollEvent);
          this.cloneScrollEvent = scrollEvent;
        }
      },
      removeScrollEvent() {
        const elem = this.getEventElem();
        if (elem && elem.removeEventListener) {
          elem.removeEventListener('scroll', this.cloneScrollEvent);
        }
      },

      scrollEvent() {
        const {top, left, right, bottom} = this.$refs.sign.getBoundingClientRect();
        if (!(right < 0 || bottom < 0 || left > window.innerWidth || top > window.innerHeight)) {
          this.load();
        }
      },

      getEventElem() {
        return this.scrollElem || window;
      },

      load() {
        this.removeScrollEvent();
        this.loaded = true;
        this.$emit('load');
      }
    },
    computed:{
      styleHeight(){
        const {height} = this;
        return /^[\d\.]+$/.test(height) ? height + 'px' : height;
      }
    },
    mounted() {
      this.addScrollEvent();
      this.scrollEvent();
    },
    beforeDestroy() {
      this.removeScrollEvent();
    },
    updated() {
      this.addScrollEvent()
    }
  };
  component.install = function (Vue) {
    Vue.component(component.name, component);
  };
  export default component;
</script>

<style scoped lang="less">

</style>
