<template>
  <el-table
    :data="questionList"
    style="width: 50vw;margin:16px"
    :row-key="getRowKeys"
    :stripe="true"
    empty-text="暂时找不到内容哟"
    @row-click="clickRowHandle"
  >
    <el-table-column
      label="问题描述"
      prop="title"
      style="width:50%"
    />
    <el-table-column
      prop="guestid"
      label="昵称"
      align="left"
      style="width:20%"
    />
    <!-- <el-table-column
      prop="time"
      label="发帖时间"
      align="left"
      style="width:20%"
    />-->
  </el-table>
</template>

<script>
import Vue from 'vue'
import API from '@/api/api.js'
Vue.prototype.API = API

export default {
  data() {
    return {
      questionList: [],
      getRowKeys(row) {
        console.log(row.serial)
        return row.serial
      },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      watch: {
        $route: {
          handler: function(route) {
            const query = route.query
            if (query) {
              this.redirect = query.redirect
              this.otherQuery = this.getOtherQuery(query)
            }
          },
          immediate: true
        }
      }
    }
  },
  created() {
    var choice = 'discuss'
    API.printList({ choice }).then(res => {
      console.log(res.msg)
    }).catch(error => {
      console.log(error.msg)
      this.questionList = this.questionList.concat(error.msg)
    })
  },
  methods: {
    clickRowHandle(row, column, event) {
      var data = this.questionList[row]
      this.$router.push({ path: '/discussionTest/index', query: data })
    }
  }
}
</script>

<style scoped>

</style>
