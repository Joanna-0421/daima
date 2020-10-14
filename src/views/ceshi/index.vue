<template>
  <div id="app">
    <div class="components-container">
      <!--
        <pan-thumb :image="image" />

        <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 30px;margin-left: 100px;" @click="imagecropperShow=true">
          Change Avatar
        </el-button>

        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          url="https://httpbin.org/post"
          lang-type="en"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      -->
      <div class="header">
        <h1>个人资料</h1>
        <el-divider></el-divider>
      </div>
      <!--
        <div class="nav">
          <pan-thumb :image="image" />

         <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 600px;margin-left: 100px;" @click="imagecropperShow=true">
           Change Avatar
         </el-button>

         <image-cropper
           v-show="imagecropperShow"
           :key="imagecropperKey"
           :width="300"
           :height="300"
           url="https://httpbin.org/post"
           lang-type="en"
           @close="close"
           @crop-upload-success="cropSuccess"
         />
        </div>
      -->
      <div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="number">
            <el-input v-model="ruleForm.number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="个性简介" prop="introduction">
            <el-input type="textarea" v-model="ruleForm.introduction" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="header">
        <h1>修改密码</h1>
        <el-divider></el-divider>
      </div>
      <div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="原密码">
            <el-input type="password" v-model="ruleForm.originpass" id="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" id="newpassword"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" id="checknewpassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<script>
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
import Vue from "vue";
import API from "@/api/api.js";

Vue.prototype.API = API;

export default {
  name: "AvatarUploadDemo",
  components: { ImageCropper, PanThumb },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: "https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191",
      ruleForm: {
        pass: "",
        checkPass: "",
        originpass: "",
        email: "",
        phone: "",
        number: "",
        introduction: "",
        username: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  created() {
    //console.log(this.$route.params.userid)
    //var username = this.$route.params.userid
    console.log(window.localStorage);
    if (window.localStorage) {
      var storage = window.localStorage;
      //storage.setItem("username",this.ruleForm.username)
      var username = storage.getItem("username");
      console.log(username);
      API.getUserinfo({ username })
        .then((res) => {
          this.ruleForm.number = res.msg.id;
          this.ruleForm.username = username;
          this.ruleForm.email = res.msg.email;
          this.ruleForm.phone = res.msg.phone;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    /*
      API.getUserinfo({username}).then(res=>{
       console.log(res)
     }).catch(_=>{
       console.log(_)
       this.ruleForm.number = _.msg.id
       this.ruleForm.username = username
       this.ruleForm.email = _.msg.email
       this.ruleForm.phone =_.msg.phone
     })*/
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.files.avatar;
    },
    close() {
      this.imagecropperShow = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.inputclass {
  margin-bottom: 30px;
  margin-top: 10px;
  width: 500px;
}
</style>
