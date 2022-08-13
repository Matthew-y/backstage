<!-- admin/list -->
<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">管理员列表</div>
      <el-row>
        <el-col :span="6" :offset="0"
          ><el-button type="primary" size="default" @click=""><span>+&nbsp;</span>新增</el-button>
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
        <el-table-column prop="id" label="管理员ID" width="139px"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="250px"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="158px"> </el-table-column>
        <el-table-column prop="sort" label="排序" width="93px"> </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="246px"> </el-table-column>
        <!-- TODO -->
        <el-table-column prop="id" label="操作" width="180px"><span class="edit-btn" @click="eidtAdminData()">编辑</span></el-table-column>
      </el-table>
    </div>
  </el-container>
</template>
<script setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
let keyWord = ref("");
let adminList = ref([
  {
    id: 1,
    username: "cyangz",
    name: "matt",
    sort: 1001,
    createTime: "2022-08-13 10:00:00",
  },
  {
    id: 2,
    username: "aldkjfa",
    name: "alex",
    sort: 1201,
    createTime: "2022-08-13 11:00:00",
  },
]);
// 搜索管理员
function searchAdmin() {
  console.log("搜索管理员");
}
// TODO
function eidtAdminData(id) {
  console.log(id.label);
}

function tableHeaderStyle() {
  return {
    padding: "16px",
    color: "black",
    "font-weight": "normal",
  };
}
function tableCellStyle() {
  return {
    padding: "16px",
  };
}
</script>
<style scoped>
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
  background-color: #1890ff;
}
.el-button span {
  font-size: 16px;
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
</style>
