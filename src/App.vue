<template>
  <div id="app">
    <router-view />
    <!-- 全局引入loading -->
    <RequestLoading />
  </div>
</template>

<script>
import RequestLoading from '@/components/RequestLoading';

export default {
  components: {
    RequestLoading
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;  
}
</style>
