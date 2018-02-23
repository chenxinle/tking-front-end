<template>
  <div id="home">
    <div class="doc">
      <div style="text-align: left">
        <p>Vue+node+elementUI+SpringBoot+MyBatis完成后端渲染</p>
        <p>因为平时工作比较忙，页面比较简单，只搭了一个架子</p>
        <p>项目架构较重要，内容的丰富只是在架构上写一些业务而已</p>
      </div>
      <div style="text-align: left">
        <a href="http://gitbook.mrsdian.com/tking/" target="_blank" class="document">前端文档链接</a>
      </div>
      <div style="text-align: left">
        <a href="http://gitbook.mrsdian.com/tking-back-end/" target="_blank" class="document">后端文档链接</a>
      </div>
    </div>
    <img :src="avatar" class="avatar" />
    <div class="name">{{user && user.name}}</div>
  </div>
</template>

<script>
  import homeStore from '../store/modules/home'
  export default {
    asyncData ({ store, route }) {
      // 触发 action 后，会返回 Promise
      store.registerModule('home', homeStore)
      return store.dispatch('home/getUser')
    },
    destroyed () {
      if (this.$store._modulesNamespaceMap['home']) {
        this.$store.unregisterModule('home')
      }
    },
    computed: {
      // 从 store 的 state 对象中的获取 item。
      user () {
        let home = this.$store.state.home
        return home && home.user
      },
      avatar() {
        return require('../assets/avatar.jpg')
      }
    }
  }
</script>

<style>
  #home {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  #home .document {
    color: #42b983;
  }
  #home .avatar {
    border-radius: 50%;
  }
  #home .name {
    font-size: 50px;
  }
  #home .doc {
    position: absolute;
    left: 15px;
    top: 100px;
  }
</style>