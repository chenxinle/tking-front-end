<template>
  <div id="spider">
    <el-button @click="startSpider">开始爬取</el-button>
    <el-button @click="getActivities">获取演出</el-button>
    <el-button @click="clear">清空演出</el-button>
    <div class="doc">
      <span>文档链接：</span>
      <a href="http://gitbook.mrsdian.com/tking-back-end/" target="_blank">http://gitbook.mrsdian.com/tking-back-end/</a>
    </div>
    <div class="hint">
      <p v-html="hintText"></p>
    </div>
    <div class="search-list">
      <div class="search" v-show="activities.length">
        <el-input v-model="keyword"
                  clearable
                  size="small"
                  @keyup.enter.native="search"
                  placeholder="输入演出名搜索"></el-input>
        <el-button @click="search"
                   size="small"
                   icon="el-icon-search"
                   type="primary">搜索</el-button>
        <el-button @click="likeOrder"
                   size="small"
                   >喜欢数{{likeSortText}}序<i :class="likeSortIcon"></i></el-button>
        <el-button @click="scanOrder"
                   size="small"
                   >浏览数{{scanSortText}}序<i :class="scanSortIcon"></i></el-button>
      </div>
      <el-table
          :data="activities"
          v-show="activities.length"
          border
          style="width: 100%">
        <el-table-column
            prop="activityName"
            label="名称">
        </el-table-column>
        <el-table-column
            prop="likeTimes"
            label="喜欢数"
            width="260">
        </el-table-column>
        <el-table-column
            prop="scanTimes"
            label="浏览数"
            width="260">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        @current-change="pageChange"
        v-show="total"
        background
        layout="prev, pager, next"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import { Loading } from 'element-ui'
  import Network from '../mods/Network'
  export default {
    data() {
      return {
        total: 0,
        activities: [],
        keyword: '',
        isLikeOrderUp: true,
        isScanOrderUp: true,
        orderByType: 0,
        hintText: ''
      }
    },
    computed: {
      likeSortText() {
        return this.isLikeOrderUp ? '升' : '降'
      },
      scanSortText() {
        return this.isScanOrderUp ? '升' : '降'
      },
      likeSortIcon() {
        return this.isLikeOrderUp ?  'el-icon-arrow-up' : 'el-icon-arrow-down'
      },
      scanSortIcon() {
        return this.isScanOrderUp ?  'el-icon-arrow-up' : 'el-icon-arrow-down'
      }
    },
    methods: {
      likeOrder() {
        this.isLikeOrderUp = !this.isLikeOrderUp
        if (this.isLikeOrderUp) {
          this.orderByType = this.orderType.likeUp
        } else {
          this.orderByType = this.orderType.likeDown
        }
        this.getActivities()
      },
      scanOrder() {
        this.isScanOrderUp = !this.isScanOrderUp
        if (this.isScanOrderUp) {
          this.orderByType = this.orderType.scanUp
        } else {
          this.orderByType = this.orderType.scanDown
        }
        this.getActivities()
      },
      search() {
        this.getActivities()
      },
      clear() {
        Network.post('/api/v1/spider/deleteAll').then(() => {
          this.activities = []
          this.total = 0
          this.initHintText()
          this.$message.success("清除成功")
        }, () => {
          this.$message.error('清除失败')
        })
      },
      pageChange(currentPage) {
        this.pageIndex = currentPage
        this.getActivities()
      },
      startSpider() {
        let loading = Loading.service({
          fullscreen: true,
          text: "正在爬取中，可能需要一段时间，请耐心等待"
        })
        Network.get('/api/v1/spider/start').then(() => {
          loading.close()
          this.$message.success('爬取成功')
          this.getActivities()
        }, () => {
          this.$message.error('爬取失败')
        })
      },
      getActivitiesReq() {
        return Network.get('/api/v1/activity', {
          pageIndex: this.pageIndex || 1,
          keyword: this.keyword || '',
          orderByType: this.orderByType
        })
      },
      initHintText() {
        this.getActivitiesReq().then((resp) => {
          if (resp.data.totalNum) {
            this.hintText = '已有演出，点击获取演出查看<br />如果想查看最新演出，点击清空演出后，点击开始爬取'
          } else {
            this. hintText = '点击开始爬取，爬取最新演出'
          }
        })
      },
      getActivities() {
        this.getActivitiesReq().then((resp) => {
          this.total = resp.data.totalNum
          this.activities = resp.data.data
        }, () => {
          this.$message.error('系统错误')
        })
      }
    },
    mounted() {
      this.orderType = {
        scanDown: 1,
        scanUp: 2,
        likeDown: 3,
        likeUp: 4
      }
      this.initHintText()
    }
  }
</script>

<style>
  #spider {
    margin-top: 80px;
    margin-left: 15px;
    margin-right: 15px;
    position: relative;
    padding-bottom: 15px;
  }
  #spider .doc {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  #spider .hint {
    position: absolute;
    top: 0;
    font-size: 12px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  .search-list {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .search {
    text-align: left;
    margin-bottom: 10px;
  }
  .el-table th.is-leaf {
    text-align: center !important;
  }
  .el-input {
    width: 300px !important;
    margin-right: 10px;
  }
</style>