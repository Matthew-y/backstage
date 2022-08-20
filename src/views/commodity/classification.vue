<!-- 商品分类 -->
<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">商品分类</div>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" size="default" @click="showDialog"><span>+&nbsp;</span>新增</el-button>
        </el-col>
      </el-row>
      <el-table :data="typeList" row-key="good_type_id" :header-cell-style="tableHeaderStyle" :cell-style="tableCellStyle">
        <el-table-column prop="good_type_id" label="分类ID" width="188px"></el-table-column>
        <el-table-column prop="type_name" label="分类名称" width="422px"></el-table-column>
        <el-table-column label="状态" width="202px">
          <template #default="scope">
            <div class="name-tag">{{ scope.row.status }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="152px"></el-table-column>
        <el-table-column prop="update_time" label="添加时间" width="402px"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <span class="action" @click="editType(scope)">编辑</span>
            <span class="action" @click="deleteType(scope)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增商品分类"
      width="720px"
      v-model="dialogVisible"
      >
      <span></span>
      <template #footer>
        <el-button @click="showDialog" plain>取消</el-button>
        <el-button type="primary" @click="">确定</el-button>
      </template>
    </el-dialog>
    
  </el-container>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue"; 
const { proxy } = getCurrentInstance();
let typeList = ref([]); // 分类列表
let dialogVisible = ref(true); // 弹框显示状态
// 编辑商品分类
function editType(scope) {
  // edit product
}

// 删除商品分类
function deleteType(scope) {
  proxy.$axios.post('http://api_devs.wanxikeji.cn/api/admin/deleteGoodtype', { token: localStorage.getItem('AccessToken'), id: String(scope.row.good_type_id) }).then(res => {
    console.log(res)
  })
}
// 切换弹框显示
function showDialog() {
  dialogVisible.value = !dialogVisible.value;
}

// 获取商品分类数据
proxy
  .$axios({
    url: "http://api_devs.wanxikeji.cn/api/admin/goodsTypeList",
    method: "post",
    data: {
      token: localStorage.getItem("AccessToken"),
    },
  })
  .then((res) => {
    let list = res.data.data;
    // 一级分类
    list.forEach((item) => {
      if (item.parent_id === 0) {
        typeList.value.push(item);
      }
    });
    // 二级分类
    typeList.value.forEach((item1) => {
      item1.children = [];
      list.forEach((item2) => {
        if (item2.parent_id === item1.good_type_id) {
          item1.children.push(item2);
        }
      });
    });
    // 三级分类
    typeList.value.forEach(item1 => {
      item1.children.forEach(item2 => {
        item2.children = [];
        list.forEach(item3 => {
          if(item3.parent_id === item2.good_type_id) {
            item2.children.push(item3);
          }
        })
      })
    })
  });

// 表格表头样式
function tableHeaderStyle() {
  return {
    height: "54px",
    color: "black",
    "padding-left": "8px",
    "font-weight": "normal",
    overflow: "hidden",
    "background-color": "#fafafa",
  };
}
// 表格单元格样式
function tableCellStyle() {
  return {
    height: "55px",
    padding: "8px",
    "font-size": "14px",
  };
}
</script>
<style scoped>
@import "@/assets/css/reset.css";
@import "@/assets/css/pageHeader.css";
.name-tag {
  width: 40px;
  height: 22px;
  margin-left: 6px;
  font-size: 12px;
  text-align: center;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  background-color: #f6ffed;
}
</style>
