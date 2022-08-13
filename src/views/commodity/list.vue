<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">管理员列表</div>
      <el-row>
        <div>商品名称：</div>
        <el-input v-model="searchKeywords.name" placeholder="请输入商品名称" size="normal"></el-input>
        <div>商品编码：</div>
        <el-input v-model="searchKeywords.code" placeholder="请输入商品编码" size="normal"></el-input>
        <div>商品分类：</div>
        <el-select v-model="searchKeywords.type" value-key="" placeholder="全部分类">
          <el-option v-for="(item, index) in selectOptions" :key="index" :value="item.name"> </el-option>
        </el-select>
        <el-button @click="getProductList">
          <el-icon><Search /></el-icon>&nbsp;搜索</el-button>
      </el-row>
      <el-row>
        <!-- TODO 筛选按钮 -->
        <el-button-group>
          <el-button @click="">全部</el-button>
          <el-button @click="">出售中</el-button>
          <el-button @click="">已下架</el-button>
          <el-button @click="">已售罄</el-button>
        </el-button-group>
        <el-button @click=""><span class="btn-text">+&nbsp;</span>创建商品</el-button>
      </el-row>

      <el-table
        ref="multipleTableRef"
        :header-cell-style="tableHeaderStyle"
        :cell-style="tableCellStyle"
        :data="productList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column property="good_id" label="商品ID" width="96"></el-table-column>
        <el-table-column label="商品图片" width="113">
          <template #default="scope">
            <img :src="scope.row.img" alt="" width="50" />
          </template>
        </el-table-column>
        <el-table-column property="good_name" label="商品名称" width="390"></el-table-column>
        <el-table-column property="price" label="商品价格" width="114"></el-table-column>
        <el-table-column property="totalSale" label="总销量" width="95"></el-table-column>
        <el-table-column property="storage" label="库存总量" width="113"></el-table-column>
        <el-table-column property="status" label="状态" width="103">
          <template #default="scope">
            <div class="status">{{ scope.row.status }}</div>
          </template>
        </el-table-column>
        <el-table-column property="sort" label="排序" width="77"></el-table-column>
        <el-table-column property="create_time" label="添加时间" width="205"></el-table-column>
        <el-table-column label="操作" width="176">
          <template #default="scope">
            <span class="action" @click="handleEdit(scope.$index, scope.row)">编辑</span>
            <span class="action" @click="handleDelete(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-container>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();
const userToken = localStorage.getItem("AccessToken");
// 搜索关键词
let searchKeywords = ref({
  name: "",
  code: "",
  type: "",
});
// TODO 商品分类下拉菜单选项
let selectOptions = ref([
  {
    name: "全部分类",
  },
  {
    name: "手机数码",
  },
]);
// 商品信息列表
let productList = ref([
  {
    id: 1,
    img: "http://static.yoshop.xany6.com/10001/20210313/b51b4840c24250a67210d59e345e206d.jpg",
    name: "手机",
    price: 1231,
    totalSale: 0,
    storage: 300,
    status: "上架",
    sort: 32,
    createTime: "2022-08-13 14:00:00",
  },
]);
// 请求商品数据
function getProductList() {
  proxy.$axios
    .post("http://api_devs.wanxikeji.cn/api/admin/goodList", {
      token: userToken,
      page: "1",
      size: "12",
      good_type: searchKeywords.value.type,
      search: searchKeywords.value.name,
    })
    .then((res) => {
      productList.value = res.data.data.data;
      console.log(productList.value[0]);
    });
}
// 编辑商品信息
function handleEdit(index, row) {
  console.log("编辑", index, row);
}
// 删除商品信息
function handleDelete(index, row) {
  productList.value.forEach((item) => {
    if(item.good_id === row.good_id){
      let index = productList.value.indexOf(item)
    }
  })
  productList.value.splice(index, 1);
}
// 表格表头样式
function tableHeaderStyle() {
  return {
    height: "54px",
    color: "black",
    "padding-left": "16px",
    "font-weight": "normal",
    overflow: "hidden",
  };
}
// 表格单元格样式
function tableCellStyle() {
  return {
    height: "83px",
    padding: "16px",
    "font-size": "13px",
  };
}

getProductList();
</script>
<style>
.el-container.full-page {
  width: 100%;
  height: unset;
}
.list-box {
  width: inherit;
  height: unset;
  padding: 24px;
  background-color: #fff;
}
.list-box .title {
  width: inherit;
  height: 24px;
  margin-bottom: 16px;
}
.el-row {
  height: 50px;
}
.el-row div {
  font-size: 14px;
  line-height: 32px;
}
.el-input {
  width: 220px;
  height: 32px;
  border-radius: 2px;
}
.el-input,
.el-select {
  margin-right: 16px;
}
.el-button {
  height: 32px;
  border-radius: 2px;
}
.btn-text {
  font-size: 16px;
  font-weight: bold;
}
.el-select + .el-button {
  width: 79px;
  height: 32px;
  margin-left: -10px;
  color: white;
  background-color: #1890ff;
}
.el-button-group {
  margin-right: 20px;
}
.el-button-group + .el-button {
  width: 107px;
  text-decoration: none;
  color: white;
  background-color: #1890ff;
}
span.action {
  margin-right: 8px;
  color: #1890ff;
  user-select: none;
  cursor: pointer;
}
td .status {
  width: 40px;
  height: 22px;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  color: #52c41a;
  border: 1px solid #b7eb8f;
  background-color: #f6ffed;
}
</style>
