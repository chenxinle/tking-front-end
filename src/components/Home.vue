<template>
  <div id="home">
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
  #home .avatar {
    border-radius: 50%;
  }
  #home .name {
    font-size: 50px;
  }
</style>