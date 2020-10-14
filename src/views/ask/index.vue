<template>
  <div id="vm">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="margin:16px;width:70vw"
    >
      <!-- 问题简述 -->
      <el-form-item label="问题描述" prop="question">
        <el-input
          v-model="ruleForm.question"
          placeholder="说说你遇到的问题"
          minlength="3"
          maxlength="40"
          show-word-limit
          @keyup.enter.native="submitForm('ruleForm')"
        />
      </el-form-item>
      <!--  -->

      <!-- 问题分类，必填 -->
      <el-form-item label="问题分类" prop="classify">
        <el-select
          v-model="ruleForm.classify"
          multiple
          filterable
          default-first-option
          placeholder="出现了什么情况呢"
          style="width:100%"
          @keyup.enter.native="submitForm('ruleForm')"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--  -->

      <!-- 标签 -->
      <el-form-item label="问题标签" prop="tag">
        <el-checkbox-group v-model="ruleForm.tag" :max="4">
          <el-checkbox-button
            v-for="tag in tags"
            :key="tag"
            :label="tag"
            style="margin:4px"
            class="el-checkbox-button"
          >{{ tag }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <!--  -->

      <!-- 上传文件 -->
      <el-form-item label="上传文件" prop="fileList">
        <div class="display:flex">
          <el-upload
            class="upload-demo"
            drag
            action="http://bupt-c607.cn:7000/api/uploadFile"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList"
            style="margin:16px"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，文件总大小不得超过500kb</div>
          </el-upload>
        </div>
      </el-form-item>
      <!--  -->

      <!-- 问题细节,已用富文本实现 -->
      <el-form-item label="相关细节" prop="detail">
        <Tinymce
          ref="editor"
          v-model="ruleForm.detail"
          :height="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      <!--  -->
    </el-form>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import Vue from 'vue'
import API from '@/api/api.js'
Vue.prototype.API = API

export default {
  components: { Tinymce },
  data() {
    return {
      tags: ['wxml', 'js', 'wxss', 'json', '云函数', '路径', '变量', 'undefined'],
      ruleForm: {
        question: '',
        classify: [],
        tag: [],
        detail: ''
      },
      rules: {
        question: [
          { required: true, message: '想问什么呢', trigger: 'blur' },
          { min: 3, max: 40, message: '简述的字数应该在3~40之间哟', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '试试对问题进行分类', trigger: 'blur' }
        ],
        detail: [
          { max: 1200, message: '字数不能超过1200字', trigger: 'blur' }
        ]
      },
      options: [{
        value: '报错太多，看起来没有头绪',
        label: '报错太多，看起来没有头绪'
      }, {
        value: '这个报错只有在点击（按钮）时才会出现',
        label: '这个报错只有在点击（按钮）时才会出现'
      }, {
        value: '这个报错只有在输入一些东西（绑定的数据发生改变）时才会出现',
        label: '这个报错只有在输入一些东西（绑定的数据发生改变）时才会出现'
      }, {
        value: '不知为啥，说这个变量没有定义',
        label: '不知为啥，说这个变量没有定义'
      }, {
        value: '没有报错，但是没得到想要的结果',
        label: '没有报错，但是没得到想要的结果'
      }, {
        value: '在将数据上传到数据库时出现了问题',
        label: '在将数据上传到数据库时出现了问题'
      }, {
        value: '在从数据库中读取数据时出现了问题',
        label: '在从数据库中读取数据时出现了问题'
      }, {
        value: '与云函数相关的问题',
        label: '与云函数相关的问题'
      }],
      hasSubmit: false,
      fileList: []
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 上传到后端数据库
          var date = new Date()
          var time = date.toLocaleString()
          var question = this.ruleForm.question
          var detail = this.ruleForm.detail
          var classify = JSON.stringify(this.ruleForm.classify)
          var tag = JSON.stringify(this.ruleForm.tag)
          console.log(time)
          API.questionSubmit({
            time,
            question,
            classify,
            detail,
            tag
          }).then(res => {
            console.log(res)
          }).catch(_ => {
            console.log(_)
            if (_.successFlag === 'Y') {
              this.hasSubmit = true
              // 提交成功后，清空文本
              this.$notify({
                title: '成功！',
                message: '你的问题已经提交了!很快会被解答哟',
                type: 'success'
              })
              console.log('上传成功')
              this.ruleForm.question = ''
              while (this.ruleForm.tag.length !== 0) {
                this.ruleForm.tag.pop()
              }
              this.ruleForm.detail = ''
              while (this.ruleForm.classify.length !== 0) {
                this.ruleForm.classify.pop()
              }
            } else {
              this.$notify({
                title: '出错了{>~<}',
                message: '系统繁忙，提交失败',
                type: 'error'
              })
              console.log('系统繁忙，提交失败了')
              return false
            }
          })
        } else {
          this.$notify({
            title: '出错了{>~<}',
            message: '提交失败',
            type: 'error'
          })
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
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 $ { file.name }？`)
    },
    goNav() {
      this.$router.push({
        path: 'components/Tinymce',
        params: this.hasSubmit
      })
    }
  }
}
</script>

<style>
.el-checkbox-button{
  border-left-color: rgb(220, 223, 230)!important;
  border-left-style: solid!important;
  border-left-width: 1px!important;
}
.el-checkbox-button.is-checked{
  border-left-color: rgb(#1890ff)!important;
  border-left-style: solid!important;
  border-left-width: 1px!important;
}
.el-checkbox-button.is-focus{
  border-left-color: rgb(#1890ff)!important;
  border-left-style: solid!important;
  border-left-width: 1px!important;
}
</style>
