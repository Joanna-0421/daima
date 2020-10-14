<template>
  <div>
    <div style="margin:16px;display:flex;height:5vh">
      <p style="margin:16px">问题：</p>
      <h2>{{ title }}</h2>
    </div>
    <div style="display:flex">
      <el-tabs v-model="activeName" tab-position="left" type="card" style="margin:16px" @tab-click="handleClick">
        <el-tab-pane label="js" name="first">
          <iframe style="width:60vw;height:80vh;" src="/jshint_dis.html" />
        </el-tab-pane>
        <el-tab-pane label="wxml" name="second">
          <iframe style="width:60vw;height:80vh;" src="/Fast XML Parser.html" />
        </el-tab-pane>
        <el-tab-pane label="css" name="third">
          <iframe style="width:60vw;height:80vh;" src="http://localhost:8081/css-validator/#validate_by_input" />
        </el-tab-pane>
      </el-tabs>
      <div class="detail">
        <h2 style="margin:16px">摘要：</h2>
        <div style="margin:16px">
          <p>问题分类：</p>
          <el-tag
            v-for="item in classify"
            :key="item"
            type="success"
            size="medium"
            disable-transitions
            style="margin:4px"
          > {{ item }} </el-tag>
        </div>
        <div v-if="tag != null" style="margin:16px">
          <p>问题的标签</p>
          <el-tag
            v-for="item in tag"
            :key="item"
            type="primary"
            size="medium"
            disable-transitions
            style="margin:4px"
          > {{ item }} </el-tag>
        </div>
        <!-- <div v-if="img != null" style="margin:16px">
          <p>相关图片：</p>
          <el-tag
            v-for="item in img"
            :key="item"
            type="success"
            size="medium"
            disable-transitions
            style="margin:4px"
          > {{ item.url }} </el-tag>
        </div> -->
        <div style="margin:16px">
          <p>细节描述：</p>
          <p style="font-size:13px">{{ detail }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import API from '@/api/api.js'
Vue.prototype.API = API

export default {
  data() {
    return {
      data: null,
      activeName: 'first',
      title: 'hello world',
      user: '',
      tag: ['wxml', 'js'],
      detail: '1.检查一下图片（音频）的名称里面是否有中文字符，如果有，对图片（音频）文件重命名。2.检查一下代码里面所写的程序路径是否正确。' +
          '3.回想一下之前有没有把图片（音频）移动了位置，如果图片移动过位置的话，在小程序里面也要改相应的路径哟。4.注意这些路径里面的空格，可能会很坑！',
      classify: ['hello world', 'do a good job'],
      img: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
    }
  },
  created() {
    this.loadinfo()
  },
  methods: {
    loadinfo() {

    }
  }
}
</script>

<style scoped>
.detail{
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  height:80vh;
  width:30vw;
  margin:16px;
  background-color:#DDDDDD;
}
</style>
