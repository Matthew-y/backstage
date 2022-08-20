<!-- admin/list -->
<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">管理员列表</div>
      <el-row>
        <el-col :span="6" :offset="0"
          ><el-button type="primary" @click="showDialog"><span>+&nbsp;</span>新增</el-button>
        </el-col>
        <el-col :span="7" :offset="0">
          <el-input class="search-box" v-model="keyWord" placeholder="请输入用户名/姓名">
            <template #suffix>
              <el-icon class="search-btn" @click="searchAdmin"><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="adminList" stripe :header-cell-style="tableHeaderStyle" :cell-style="tableCellStyle">
        <el-table-column prop="admin_id" label="管理员ID" width="211px"> </el-table-column>
        <el-table-column label="用户名" width="385px">
          <template #default="scope"> {{ scope.row.admin_name }}<span class="name-tag">超级管理员</span> </template>
        </el-table-column>
        <el-table-column prop="admin_name" label="姓名" width="245px"> </el-table-column>
        <el-table-column prop="admin_id" label="排序" width="144px"> </el-table-column>
        <el-table-column prop="create_time" label="添加时间" width="381px"> </el-table-column>
        <!-- TODO -->
        <el-table-column label="操作">
          <template #default="scope">
            <span class="edit-btn" @click="editAdmin(scope)">编辑</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-container>
  <!-- 新建管理员框 -->
  <el-dialog title="新增管理员" v-model="dialogVisible" width="720px">
    <el-container>
      <el-form ref="formRef" :rules="validateInput" :model="createAdminInfo" label-width="196px" :inline="false">
        <el-form-item prop="name" label="管理员姓名:" required porp="name">
          <el-input class="dialog-input" width="364px" v-model="createAdminInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" required class="clearflex" prop="name">
          <el-input class="dialog-input" v-model="createAdminInfo.username"></el-input>
          <div class="input-note">后台登录用户名</div>
        </el-form-item>
        <el-form-item label="所属角色:" required prop="name">
          <el-tree-select
            :data="selectOptions"
            v-model="selectValue"
            multiple
            :render-after-expand="false"
            show-checkbox
            check-on-click-node
            prop="name"
          />

          <div class="input-note">后台管理员角色</div>
        </el-form-item>
        <el-form-item label="用户密码:" required>
          <el-input class="dialog-input" v-model="createAdminInfo.password" type="password"></el-input>
          <div class="input-note">后台登录密码</div>
        </el-form-item>
        <el-form-item label="确认密码:" required>
          <el-input class="dialog-input" v-model="createAdminInfo.confirmPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="排序:" required>
          <el-input-number controls-position="right" :min="0" class="dialog-input-sort" v-model="createAdminInfo.sort" />
          <div class="input-note" style="width: 500px">数字越小越靠前</div>
        </el-form-item>
      </el-form>
    </el-container>
    <!-- 底部操作按钮 -->
    <template #footer>
      <el-button @click="dialogVisible = false" plain>取消</el-button>
      <el-button type="primary" @click="confirmAddAdmin">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import { Search } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();
let formRef = ref(null); // 表单组件
let dialogVisible = ref(false); // 表单显示
let keyWord = ref(""); // 搜索管理员关键词
let selectValue = ref();
let selectOptions = ref([
  {
    value: 1,
    label: "运营人员",
  },
  {
    value: "客服人员",
    label: "客服人员",
  },
]);
// 表单验证规则
let validateInput = {
  name: [{ required: true, message: "", trigger: "blur" }],
};
// 管理员列表
let adminList = ref([
  {
    admin_id: 10001,
    admin_name: "admin",
    name: "系统管理员",
    sort: 100,
    create_time: "2022-08-13 10:00:00",
  },
]);
let createAdminInfo = ref({
  name: "",
  username: "",
  role: "",
  password: "",
  confirmPass: "",
  sort: 100,
});
// 搜索管理员
function searchAdmin() {
  console.log("搜索管理员");
}
// TODO
function editAdmin(scope) {
  console.log(scope.row);
}

function tableHeaderStyle() {
  return {
    height: "54px",
    padding: "6px",
    color: "black",
    "font-weight": "normal",
  };
}

function confirmAddAdmin() {
  console.log(selectValue.value[0]);
  let params = {
    token: window.localStorage.getItem("AccessToken"),
    name: createAdminInfo.value.name,
    pw: createAdminInfo.value.password,
    roles: selectValue.value[0],
  };
  proxy.$axios.post("http://api_devs.wanxikeji.cn/api/admin/register", params).then((res) => {
    console.log(res.data);
  });
  dialogVisible.value = false;
}

function tableCellStyle() {
  return {
    height: "55px",
    padding: "8px",
  };
}
function showDialog() {
  dialogVisible.value = !dialogVisible.value;
}
proxy
  .$axios({
    url: "http://api_devs.wanxikeji.cn/api/admin/accountList",
    method: "post",
    data: {
      token: localStorage.getItem("AccessToken"),
      size: '100',
    },
  })
  .then((res) => {
    console.log(res);
    adminList.value = res.data.data.data;
  });
</script>
<style scoped>
/* @import "@/assets/css/reset.css"; */
.el-container.full-page {
  width: 100%;
  height: 100%;
}
.list-box {
  width: inherit;
  height: unset;
  padding: 24px;
  background-color: white;
}
.list-box .title {
  width: inherit;
  height: 24px;
  margin-bottom: 16px;
}
.title + .el-row {
  margin-bottom: 18px;
  justify-content: space-between;
}
.el-button {
  width: 79px;
  /* background-color: #1890ff; */
}
.el-button span {
  /* font-size: 16px; */
  font-weight: bold;
}
.search-box {
  width: 300px;
  color: #d9d9d9;
}
.el-button,
input.search-box {
  height: 32px;
  border-radius: 2px;
}
.search-btn {
  cursor: pointer;
}
.edit-btn {
  color: #1890ff;
  user-select: none;
  cursor: pointer;
}
.name-tag {
  width: 76px;
  margin-left: 6px;
  padding: 4px 6px;
  font-size: 12px;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  background-color: #f6ffed;
}
/* 新增管理员框 */
.el-dialog__header {
  margin-top: -80px;
}
.el-dialog > div {
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.el-form {
  width: 672px;
  height: 446px;
}
.el-form-item {
  min-height: 40px;
  font-size: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.dialog-input {
  width: 364px;
  height: 32px;
  border-radius: 2px;
}
.dialog-input-sort {
  width: 88px;
  height: 32px;
  border-radius: 2px;
}
.input-note {
  width: 200px;
  font-size: 13px;
  color: #a1a1a1;
}
</style>
