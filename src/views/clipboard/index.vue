
<template>
    
    <div>
      <div style="margin:16px;display:flex;height:5vh">
        <div>问题：</div>
        <p style="magin-top:16px">{{ title }}</p>
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
        <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);height:80vh;width:30vw;margin:16px">
          <h2>摘要：</h2>
          <div>
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
          <div v-if="tag != null">
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
        
          <p>细节描述：</p>
          <p style="font-size:13px">{{ detail }}</p>
        </div>
      </div>
      
      <div id="app">
        <h1>评论详情</h1>
        <hr size=3px>
        <ul class="list-group">
            <dl v-for="item in list" :key="item.id">
              <dt class="list_user">{{ item.user }}</dt>
              <dt class="list_time">时间：{{item.time}}</dt>
              <dd class="list_content">{{ item.content }}</dd>              
              
              <dd class="list_reply">回复：{{item.reply}}</dd>

              
              <el-form>
                <el-form-item>
                  <el-input type="textarea" :rows="1" placeholder="回复" v-model="reply"></el-input>
                  <el-button type="text" class="reply" @click="reply">回复</el-button>
                </el-form-item>
              </el-form>
              <hr>
              
            </dl>

        </ul>        
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="我的评论">
          <el-input type="textarea" :rows="2" placeholder="分享你的想法" v-model="comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发表</el-button>
        </el-form-item>
      </el-form>
      <comment-textarea v-bind:type="type" v-bind:name="oldComment" v-on:submit="addComment" v-on:canel="canelCommit"></comment-textarea>
    </div>

</template>


<script>

  Vue.component('commentTextarea',{
    template:'\
    <div class="commentBox">\
    <h3>发表评论</h3>\
    <b v-if="type">你回复&nbsp;{{name}}</b>\
    <textarea name="" value="请填写评论内容" v-model="commentText"></textarea>\
    <button class="btn" @click="addComment">发表</button>\
    <button class="btn" @click="canelComment">取消</button>\
    </div>',
    props: ['type','name'],
    data: function(){
    return {commentText:""}
    },
    methods: {
    addComment: function() {
    this.$emit("submit",this.commentText);
    this.commentText = "";
    },
    canelComment: function() {
    this.$emit("canel");
    this.commentText = "";
    }
    }
  });
  Vue.component('commemt-content',{
    template:'\
    <div class="commentBox">\
    <h3>评论</h3>\
    <p v-if="comment.length==0">暂无评论，我来发表第一篇评论！</p>\
    <div v-else>\
    <div class="comment" v-for="(item,index) in comment" v-bind:index="index" >\
    <b>{{item.name}}<span>{{item.time}}</span></b>\
    <p @click="changeCommenter(item.name,index)">{{item.content}}</p>\
    <div v-if="item.reply.length > 0">\
      <div class="reply" v-for="reply in item.reply">\
      <b>{{reply.responder}}&nbsp;&nbsp;回复&nbsp;&nbsp;{{reply.reviewers}}<span>{{reply.time}}</span></b>\
      <p @click="changeCommenter(reply.responder,index)">{{reply.content}}</p>\
      </div>\
    </div>\
    </div>\
    </div>\
    </div>',
    props: ['comment'],
    methods: {
    changeCommenter: function(name,index) {
    this.$emit("change",name,index);
    }
    }
  });
  /*
  var comment = new Vue({
    el: "#comment",
    data: {
    commenter: "session", //评论人，这里会从session拿
    type: 0, //0为评论作者1为评论别人的评论
    oldComment: null, //久评论者的名字
    chosedIndex: -1, //被选中的评论的index
    article: {
    title: "当归泡水喝的九大功效",
    time: "2016-07-12",
    read:50,
    content: ""
    },

    comment: [
      {
      name: "有毒的黄同学", //评论人名字
      time: "2016-08-17", 
      content: "好,讲得非常好，good",
      reply: [ //回复评论的信息，是一个数组，如果没内容就是一个空数组
      {
      responder: "傲娇的", //评论者
      reviewers: "有毒的黄同学", //被评论者
      time: "2016-09-05",
      content: "你说得对"
      }
      ]      
  //评论内容
      }
      ],
      
    methods: {
    //添加评论
    addComment: function(data) {
    if(this.type == 0) {
    this.comment.push({
      name: 'session',
      time: getTime(),
      content: data,
      reply: []
    });
 //服务器端
    }else if(this.type == 1){
    this.comment[this.chosedIndex].reply.push({
      responder: 'session',
      reviewers:this.comment[this.chosedIndex].name,
      time: getTime(),
      content: data
    });
    this.type = 0;
    }
    },
 //监听到了点击了别人的评论
    changCommmer: function(name,index) {
    this.oldComment = name;
    this.chosedIndex = index;
    this.type = 1;
    },
 //监听到了取消评论
    canelCommit: function() {
    this.type = 0;
    }
    }
  })
  */
  var comment = new Vue({
 el: "#comment",
 data: {
 commenter: "session", //评论人，这里会从session拿
 type: 0, //0为评论作者1为评论别人的评论
 oldComment: null, //久评论者的名字
 chosedIndex: -1, //被选中的评论的index
 article: {
 title: "当归泡水喝的九大功效",
 time: "2016-07-12",
 read:50,
 content: ""
 },
 comment: [] //评论内容
 },
 methods: {
 //添加评论
 addComment: function(data) {
 if(this.type == 0) {
 this.comment.push({
  name: 'session',
  time: getTime(),
  content: data,
  reply: []
 });
 //服务器端
 }else if(this.type == 1){
 this.comment[this.chosedIndex].reply.push({
  responder: 'session',
  reviewers:this.comment[this.chosedIndex].name,
  time: getTime(),
  content: data
 });
 this.type = 0;
 }
 },
 //监听到了点击了别人的评论
 changCommmer: function(name,index) {
 this.oldComment = name;
 this.chosedIndex = index;
 this.type = 1;
 },
 //监听到了取消评论
 canelCommit: function() {
 this.type = 0;
 }
 }
})
  /*
  export default {
    data() {
      return {
        list: [
                 {id: Date.now(), user:'李白', content: '天生我才必有用',reply:'',time:'2019-10-3'},
                 {id: Date.now(), user:'林则徐', content:'岂因祸福避趋之',reply:'',time:''},
                 {id: Date.now(), user:'蛤', content:'苟利国家生死以',reply:'',time:''}
                ],
        comment: '',
        reply: ''
      }
    },
    
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      reply(){
        var name=prompt("输入的内容","");
        if (name!=null && name!="") {
        alert("你输入的是" + name);
        
        }
      }
    }
  }
  */
</script>

<style>
.list_user{
  font-size: 20px;
  margin-bottom: 10px;
}
.list_content{
  font-size: 15px;
  margin-bottom: 10px;
}
.list_reply{
  font-size: 15px;
  margin-bottom: 10px;
}
.list_time{
  font-size: 10px;
  margin-bottom: 10px;
}
.reply{
  margin-left: 1000px;
}
</style>