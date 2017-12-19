<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <navbar />
    <router-view/>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  export default {
    name: 'app',
    components: {
      Navbar
    }
  }
</script>

<style>
  /*
    style-loader不支持node,style-loader中有window和document，会报错undefined
    所以没有在js中直接import "../node_modules/element-ui/lib/theme-chalk/index.css"
    这里使用vue-loader提供的@import(实质还是css-loader提供的解析@import)
    但是这其中有fonts的url，所以需要把element-ui中的fonts拷贝到app.vue平级目录
  */
  @import "../node_modules/element-ui/lib/theme-chalk/index.css";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }
  * {
    margin: 0;
  }
  html,
  body {
    height: 100%;
  }
</style>
