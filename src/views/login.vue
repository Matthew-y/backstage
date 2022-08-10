<template>
  <div class="input-box" style="margin-top: 20vh">
    <el-row>
      <el-col :span="6" :offset="9">
        <img class="login-avatar" src="	https://shop2.yiovo.com/store/assets/logo.a3adccf1.svg" alt="" />
      </el-col>
    </el-row>
    <el-row>
      <el-col class="title" :span="7" :offset="8">商城系统登录</el-col>
    </el-row>
    <el-form ref="formRef" :model="rulelForm" :rules="rules" label-width="80px" :inline="false" size="normal">
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item prop="name">
            <el-input class="username" size="large" v-model="ruleForm.name" :prefix-icon="User" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <span>{{ usernameNotice }}</span>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item prop="pass" size="normal">
            <el-input
              class="password"
              v-model="user.password"
              size="large"
              :prefix-icon="Lock"
              show-password
              clearable
              @change=""
              placeholder="请输入密码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0">
          <el-button class="confirm-login" type="primary" size="large" @click="handleLogin">登录</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
// @ is an alias to /src
import { ref, reactive } from "vue";
// import { ElInput, ElRow, ElCol } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import { trigger } from "@vue/reactivity";

let user = ref({
  name: "",
  password: "",
});
const ruleForm = reactive({
  name: "",
  pass: ""
});
const formRef = ref();
const rules = reactive({
  name: [
    { required: true, message: "您还没有输入用户名", trigger: "blur" },
  ],
  pass: [
    { required: true, message: "您还没有输入用户密码", trigger: "blur" }
  ]
});

function validateName$Pass() {
  
}

function handleLogin() {}
</script>
<style>
.input-box {
  width: 340px;
  margin: 0 auto;
  margin-top: 20px;
}
.title {
  font-size: 16px;
  color: #6c72af;
}
.password {
  margin-left: 0;
}
div .el-input {
  width: 340px;
  border: none;
  background-color: #f7f8fa;
}
.el-input + span {
  font-size: 14px;
  color: #8c8c8c;
}
.el-form-item{
  margin-bottom: 0;
}
.el-form-item div {
  margin-left: 0 !important;
}
.login-avatar {
  width: 50px;
}
.confirm-login {
  width: 100%;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.ep-bg-purple {
  background-color: skyblue;
}
.el-col {
  border-radius: 4px;
  margin-bottom: 0;
}
.ep-bg-purple-dark {
  background-color: purple;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
