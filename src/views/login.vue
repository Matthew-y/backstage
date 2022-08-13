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
    <el-form ref="formInstance" :model="ruleForm" :rules="rules" size="normal">
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name" class="username" type="text" size="large" :prefix-icon="User" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0">
          <el-form-item prop="pw">
            <el-input
              type="password"
              class="password"
              v-model="ruleForm.pw"
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
import { ref, reactive, getCurrentInstance } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const formInstance = ref(null);
const ruleForm = reactive({
  name: "",
  pw: "",
});
const rules = reactive({
  name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  pw: [{ validator: validatePass, trigger: "blur" }],
});
//验证用户名密码是否为空
function validateName(rule, value, callback) {
  console.log(value);
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    callback();
  }
}

function validatePass(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入用户密码"));
  } else {
    callback();
  }
}

// 处理登录
function handleLogin() {
  console.log(ruleForm);
  formInstance.value.validate((valid, fields) => {
    if (valid) {
      proxy.$axios.get("http://api_devs.wanxikeji.cn/api/admin/login", { params: ruleForm }).then((res) => {
        console.log(res);
        if (res.data.code === 2000) {
          window.localStorage.setItem("AccessToken", res.data.data.token);
          proxy.$router.push({ path: "/index" });
        }
      });
    }
  });
}
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
.el-form-item {
  margin-bottom: 0;
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
