<template>
  <div id="navbar">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="/">个人中心</el-menu-item>
      <el-menu-item index="/spider">爬虫</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSelect(route) {
        this.$router.push(route)
      }
    },
    computed: {
      activeIndex() {
        return this.$route.path
      }
    }
  }
</script>

<style>
  #navbar {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 10;
  }
</style>