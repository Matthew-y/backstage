<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">商品列表</div>
      <el-row>
        <div>商品名称：</div>
        <el-input v-model="searchKeywords.name" placeholder="请输入商品名称"></el-input>
        <div>商品编码：</div>
        <el-input v-model="searchKeywords.code" placeholder="请输入商品编码"></el-input>
        <div>商品分类：</div>
        <el-tree-select :data="selectOptions" v-model="selectValue" :render-after-expand="false" check-on-click-node placeholder=" " />
        <el-button @click="getProductList">
          <el-icon><Search /></el-icon>&nbsp;搜索</el-button
        >
      </el-row>
      <el-row>
        <el-button-group>
          <el-button @click="">全部</el-button>
          <el-button @click="">出售中</el-button>
          <el-button @click="">已下架</el-button>
          <el-button @click="">已售罄</el-button>
        </el-button-group>
        <el-button @click="createProduct"><span class="btn-text">+&nbsp;</span>创建商品</el-button>
      </el-row>

      <el-table ref="multipleTableRef" :header-cell-style="tableHeaderStyle" :cell-style="tableCellStyle" :data="productList">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column property="good_id" label="商品ID" width="96"></el-table-column>
        <el-table-column label="商品图片" width="113">
          <template #default="scope">
            <img :src="scope.row.img" alt="Image fail" width="50" />
          </template>
        </el-table-column>
        <el-table-column property="good_name" label="商品名称" width="390"></el-table-column>
        <el-table-column property="price" label="商品价格" width="114" />
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
            <span class="action" @click="editProduct(scope.$index, scope.row)">编辑</span>
            <span class="action" @click="deleteProduct(scope.$index, scope.row)">删除</span>
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
const accessToken = localStorage.getItem("AccessToken");
let selectValue = ref("1");
// 搜索关键词
let searchKeywords = ref({
  name: "",
  code: "",
  type: "",
});
// 商品分类下拉菜单选项
let selectOptions = ref([
  {
    value: "1",
    label: "全部分类",
  },
  {
    value: "2",
    label: "手机数码",
    children: [
      { value: "2-1", label: "源码咨询" },
      { value: "2-2", label: "女性手机" },
      { value: "2-3", label: "三星" },
      { value: "2-4", label: "魅族" },
      { value: "2-5", label: "OPPO" },
      { value: "2-6", label: "vivo" },
      { value: "2-7", label: "Iphone" },
      { value: "2-8", label: "华为" },
      { value: "2-9", label: "小米" },
    ],
  },
  {
    value: "3",
    label: "家用电器",
    children: [
      { value: "3-1", label: "多用途锅" },
      { value: "3-2", label: "豆浆机" },
      { value: "3-3", label: "电饼档" },
      { value: "3-4", label: "微波炉" },
      { value: "3-5", label: "电磁炉" },
      { value: "3-6", label: "电饭煲" },
      { value: "3-7", label: "电压力锅" },
      { value: "3-8", label: "电水壶" },
    ],
  },
  {
    value: "4",
    label: "电脑办公",
    children: [
      {
        value: "4-1",
        label: "轻薄本",
      },
      {
        value: "4-2",
        label: "游戏本",
      },
      {
        value: "4-3",
        label: "机械键盘",
      },
      {
        value: "4-4",
        label: "吃鸡装备",
      },
      {
        value: "4-5",
        label: "家用打印机",
      },
      {
        value: "4-6",
        label: "游戏台式机",
      },
      {
        value: "4-7",
        label: "显卡",
      },
      {
        value: "4-8",
        label: "移动硬盘",
      },
      {
        value: "4-9",
        label: "组装电脑",
      },
    ],
  },
  {
    value: "5",
    label: "汽车用品",
    children: [
      {
        value: "5-1",
        label: "挂件",
      },
      {
        value: "5-2",
        label: "功能小件",
      },
      {
        value: "5-3",
        label: "香水",
      },
      {
        value: "5-4",
        label: "应急救援",
      },
      {
        value: "5-5",
        label: "轮胎",
      },
      {
        value: "5-6",
        label: "行车记录仪",
      },
      {
        value: "5-7",
        label: "洗车水枪",
      },
      {
        value: "5-8",
        label: "汽车坐垫",
      },
      {
        value: "5-9",
        label: "机油",
      },
    ],
  },
  {
    value: "6",
    label: "男装",
    children: [
      {
        value: "6-1",
        label: "自营男装",
      },
      {
        value: "6-2",
        label: "休闲裤",
      },
      {
        value: "6-3",
        label: "牛仔裤",
      },
      {
        value: "6-4",
        label: "风衣",
      },
      {
        value: "6-5",
        label: "卫衣",
      },
      {
        value: "6-6",
        label: "衬衫",
      },
      {
        value: "6-7",
        label: "针织衫",
      },
      {
        value: "6-8",
        label: "T恤",
      },
      {
        value: "6-9",
        label: "夹克",
      },
    ],
  },
  {
    value: "7",
    label: "女装",
    children: [
      {
        value: "7-1",
        label: "自营女装",
      },
      {
        value: "7-2",
        label: "针织衫",
      },
      {
        value: "7-3",
        label: "卫衣",
      },
      {
        value: "7-4",
        label: "牛仔裤",
      },
      {
        value: "7-5",
        label: "T恤",
      },
      {
        value: "7-6",
        label: "衬衫",
      },
      {
        value: "7-7",
        label: "连衣裙",
      },
      {
        value: "7-8",
        label: "早春新品",
      },
      {
        value: "7-9",
        label: "牛仔外套",
      },
    ],
  },
  {
    value: "8",
    label: "钟表珠宝",
    children: [
      {
        value: "8-1",
        label: "欧美表",
      },
      {
        value: "8-2",
        label: "儿童手表",
      },
      {
        value: "8-3",
        label: "日韩表",
      },
      {
        value: "8-4",
        label: "德表",
      },
      {
        value: "8-5",
        label: "国表",
      },
      {
        value: "8-6",
        label: "瑞表",
      },
    ],
  },
  {
    value: "9",
    label: "内衣配饰",
    children: [
      {
        value: "9-1",
        label: "内衣馆",
      },
      {
        value: "9-2",
        label: "大牌文胸",
      },
      {
        value: "9-3",
        label: "自营内衣",
      },
      {
        value: "9-4",
        label: "配饰管",
      },
      {
        value: "9-5",
        label: "女士围巾/披肩",
      },
      {
        value: "9-6",
        label: "内衣爆款",
      },
    ],
  },
  {
    value: "10",
    label: "箱包手袋",
    children: [
      {
        value: "10-1",
        label: "新款双肩包",
      },
      {
        value: "10-2",
        label: "自营女包",
      },
      {
        value: "10-3",
        label: "男包上新",
      },
      {
        value: "10-4",
        label: "男士腰带",
      },
      {
        value: "10-5",
        label: "时尚男包",
      },
      {
        value: "10-6",
        label: "拉杆箱",
      },
    ],
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
  // proxy.$axios
  //   .post("http://api_devs.wanxikeji.cn/api/admin/goodList", {
  //     token: accessToken,
  //     page: "1",
  //     size: "12",
  //     good_type: searchKeywords.value.type,
  //     search: searchKeywords.value.name,
  //   })
  //   .then((res) => {
  //     productList.value = res.data.data.data;
  //     console.log(productList.value[0]);
  //   });
  proxy
    .$axios({
      url: "http://api_devs.wanxikeji.cn/api/admin/goodList",
      method: "post",
      params: { token: accessToken, page: "1", size: "12", good_type: searchKeywords.value.type, search: searchKeywords.value.name },
    })
    .then((res) => {
      if (res.data.code !== 2000) return;
      productList.value = res.data.data.data;
      console.log(res);
    });
}
// 添加商品
function createProduct() {
  proxy.$router.push("/index/commodity/createProduct");
}
// 编辑商品信息
function editProduct(index, row) {
  proxy.$router.push('/index/commodity/createProduct')
}
// 删除商品信息
function deleteProduct(index, row) {
  proxy.$axios.post("http://api_devs.wanxikeji.cn/api/admin/deleteGood", { token: accessToken, good_id: row.good_id }).then((res) => {
    console.log(res);
  });
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
<style scoped>
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
  border: none;
}
.el-button-group {
  margin-right: 20px;
}
.el-button-group + .el-button {
  width: 107px;
  text-decoration: none;
  color: white;
  background-color: #1890ff;
  border: none;
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
