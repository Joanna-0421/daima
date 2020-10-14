
<template>

  <div class="demo-image__lazy">
  <el-tabs v-model="activeName" @tab-click="handleClick" type="card" display="center">
    <el-tab-pane label="示例" name="first" >
<p class="title" >下面的是一个好的教程示例！
<el-link class="download" href="https://pan.baidu.com/s/1CliU4XgtqFQ6YhLkUHDQyA" type="info" target="_blank">(下载链接)<i class="el-icon-view el-icon--right"></i></el-link>
</p>
 <iframe
    src='http://bupt-c607.cn/attachment/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B.pdf'
    style=" font-size: 100%; font-weight: 700px;width: 100%; height: 500px  "
    ></iframe>
    </el-tab-pane>



     <el-tab-pane label="分享" name="second">
       <p class="title" >分享你自己的想法，有想法就添加进来吧！</p>
     <div id="vm">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin:16px;width:70%">
      <!-- 问题简述 -->
      <el-form-item label="分享Title" prop="question">
        <el-input v-model="ruleForm.question" placeholder="说说你的经验分享" minlength="3" maxlength="40" show-word-limit />
      </el-form-item>
      <!--  -->

      
    

      <!-- 标签 -->
      <!--  -->

      <!-- 上传文件 -->
    
      <!--  -->

      <!-- 问题细节,已用富文本实现 -->
      <!--
      <el-form-item label="分享的具体内容！" prop="detail">
        <Tinymce
          ref="editor"
          v-model="ruleForm.detail"
          :height="500"
          show-word-limit
        />
      </el-form-item>
      -->
      <bianji />
      <!--
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
     -->
    
    </el-form>
  </div>
     </el-tab-pane>



  <el-tab-pane label="社区" name="third">
    <getlikes></getlikes>

  </el-tab-pane>









<el-tab-pane label="搜索" name="fourth" style="margin:16px">
 
  <bug></bug>
     
  </el-tab-pane>
  </el-tabs>   
</div>

</template>



<script type="module">
import bianji from './components/bianji'
import bug from './components/bug'
import getlikes from './components/getlikes'
import API from '@/api/api.js'
import Vue from 'vue'
import Tinymce from '@/components/Tinymce'
import {getLikenum,getLikestatus} from '@/api/api.js'
Vue.prototype.API=API

  export default {
    components: { bianji, bug, getlikes},
    data() {
      
      return {
        input:'',
         fileList: [{name:'例子.jpg'}],
          counter: 0,
          activeName: 'third',
          clickNum:12,
          isClick:'' ,
          el:'#app',
          questions: null,
          state: '',
          getLikenum: 0,
          getLikestatus:'N',
           tags: ['wxml', 'js', 'wxss', 'json', '云函数', '路径', '变量', 'undefined'],
      ruleForm: {
        question: '',
        classify: [],
        tag: [],
        fileList: [],
        detail: ''
      },
      rules: {
        question: [
          { required: true, message: '分享的Title必须要填写的呢！', trigger: 'blur' },
          { min: 3, max: 40, message: '简述的字数应该在3~40之间哟', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '请把分享进行分类吧', trigger: 'blur' }
        ],
        detail: [
          { max: 1200, message: '字数不能超过1200字', trigger: 'blur' }
        ]
      },
    
    
    created() {
      this.loadAll()
    },
  
    methods: {
      loadAll() {
        API.getLikenum({}).then(res => {
        console.log(res)
        console.log(API)
        this.haveliked=res.msg
      }).catch(_ => {
        console.log('失败！')
      })
      
      },
    likes(){
      API.likes({}).then(lik=>{
        console.log(lik)
        this.haveliked=lik.people
      }).catch(_=>{
        console.log('失败')
      })
    },
    querySearchAsync(queryString, cb) {
      console.log(this.state)
      var questions = this.questions
      var results = queryString ? questions.filter(this.createStateFilter(queryString)) : questions
      this.getResults = null
      this.getResults = results
      // 这里需要写一个逻辑
      cb(results);
    },
    createStateFilter(queryString){
      /* 如果输入的词与记录不匹配，不予显示。
      原先在匹配的位置使用了函数，但是现在不用函数了，效率得到了提高
      */
      return (state) => {
        state.value = state.detail
        return (state.detail.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    // 搜索键用的函数，对应第二条支线
    search(){
      this.select = true
      this.isSearch = true
      console.log(this.length)
      if(this.getResults != null && this.state != ''){
        this.seen = false
        this.tableData = null
        this.tableData = this.getResults
        console.log(this.getResults)
      }
    },
    handleSelect(item) {
      console.log(this.tableData.length)
      console.log(item)
      this.unfindResult = false
      // 把原来的推荐记录去掉。再想想这么样提高去掉推荐记录的效率！在前一个版本利用pop() and push()来实现
      this.tableData.splice(0,this.tableData.length,item)
      this.seen = false
      this.select = true
    },
      
    },
     like:function(){
					if(this.isClick==0){
					    	this.isClick=1
								this.clickNum=this.clickNum+1
								console.log(this.clickNum)
							}else{
								this.isClick=0
								this.clickNum=this.clickNum-1
							}
				},
				
				submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$notify({
            title: 'Success',
            message: '你的问题已经提交了!问题很快会被解答哟',
            type: 'success'
          })
          // 提交成功后，清空文本
          this.ruleForm.question = ''
          while (this.ruleForm.tag.length !== 0) {
            this.ruleForm.tag.pop()
          }
          while (this.ruleForm.fileList.length !== 0) {
            this.ruleForm.fileList.pop()
          }
          this.ruleForm.detail = ''
          while (this.ruleForm.classify.length !== 0) {
            this.ruleForm.classify.pop()
          }
        } else {
          console.log('系统繁忙，提交失败了')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 $ { file.name }？`)
    }
  }
}
			
  }
  
 
  
</script>

<style >
.title{
  color:#409EFF;
  border: none;
  width: 100%;
  font-size: 25px;
  font-weight: 700;
  padding: 10px 10px;
  margin-left: 10px;
};
.download{
 color:#409EFF;
  border: none;
  width: 100%;
  font-size: 10px;
  font-weight: 700;
  padding: 10px 10px;
  margin-left: 10px;
}
 .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>