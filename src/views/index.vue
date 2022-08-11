<template>
  <el-container>
    <!-- 左侧区域 -->
    <el-aside>
      <!-- 菜单 -->
      <el-menu :data="menuData" class="main-menu el-menu-vertical" @select="" :collapse="isCollapsed" default-active="2">
        <div class="menu-title"><span class="">萤火商城2.0</span></div>
        <el-menu-item v-for="(item, index) in menuData" :key="index" :index="item.path" @click="loadSubPage(index)">
          <el-icon :class="item.icon"></el-icon><template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧区域 -->
    <el-main height="100%">
      <el-container class="right-box" :direction="vertical">
        <!-- 右侧头部 -->
        <el-header class="main-header">
          <div class="left-btns">
            <el-button @click="isCollapsed = !isCollapsed">
              <el-icon><Fold /></el-icon>
            </el-button>
            <el-button @click="proxy.$router.go(0)">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
            <div class="current-site">
              {{ submenuData.title }} <span v-if="currentSite">/{{ currentSite }}</span>
            </div>
          </div>
          <!-- 右侧用户下拉菜单 -->
          <el-dropdown class="admin-account" @command="handleCommand">
            <div class="el-dropdown-link">
              <el-icon class="iconfont icon-jurassic_user"></el-icon>
              系统管理员
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="setting">账户设置</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <!-- 右侧区域主体 -->
        <el-main>
          <el-container class="sub-menu">
            <el-aside v-if="submenuData.title" width="120px">
              <el-menu :data="submenuData" @select="" default-active="0">
                <div class="submenu-title">
                  {{ submenuData.title }}
                </div>
                <el-menu-item
                  v-for="(item, index) in submenuData.list"
                  @click="pushSite(item.subtitle)"
                  :index="String(index)"
                  :key="index"
                >
                  {{ item.subtitle }}
                </el-menu-item>
              </el-menu>
            </el-aside>
            <el-main height="">
              <div class="realtime-overview"></div>
              <div class=""></div>
            </el-main>
          </el-container>
        </el-main>
        <!-- 页脚 -->
        <el-footer height="">
          <!-- Footer content -->
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>
<script setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import { RefreshRight, Fold } from "@element-plus/icons-vue";
import "@/assets/iconfont/iconfont.css";

const { proxy } = getCurrentInstance();
let isCollapsed = ref(false);
let currentSite = ref("");
let menuData = ref([
  {
    icon: "iconfont icon-zhuye",
    title: "首页",
    path: "1",
  },
  {
    icon: "iconfont icon-guanliyuan1",
    title: "管理员",
    path: "2",
    child: {
      title: "管理员",
      list: [{ subtitle: "管理员列表" }, { subtitle: "角色管理" }],
    },
  },
  {
    icon: "iconfont icon-xianxiamendian",
    title: "店铺管理",
    path: "3",
    child: {
      title: "店铺管理",
      list: [{ subtitle: "店铺设置" }, { subtitle: "地址管理" }, { subtitle: "店铺页面" }],
    },
  },
  {
    icon: "iconfont icon-shangpingouwudai2",
    title: "商品管理",
    path: "4",
    child: {
      title: "商品管理",
      list: [{ subtitle: "商品列表" }, { subtitle: "商品分类" }, { subtitle: "服务承诺" }, { subtitle: "商品评价" }],
    },
  },
  {
    icon: "iconfont icon-dingdan",
    title: "订单管理",
    path: "5",
    child: {
      title: "订单管理",
      list: [
        { subtitle: "全部订单" },
        { subtitle: "待发货" },
        { subtitle: "待收货" },
        { subtitle: "待付款" },
        { subtitle: "已完成" },
        { subtitle: "已取消" },
        { subtitle: "售后管理" },
        { subtitle: "订单处理" },
      ],
    },
  },
  {
    icon: "iconfont icon-huiyuan21",
    title: "会员管理",
    path: "6",
  },
  {
    icon: "iconfont icon-dingdanzhongxin",
    title: "内容管理",
    path: "7",
  },
  {
    icon: "iconfont icon-yingxiao-dianjihou",
    title: "营销管理",
    path: "8",
  },
  {
    icon: "iconfont icon-shujuzhongxin",
    title: "数据统计",
    path: "9",
  },
  {
    icon: "iconfont icon-xiaochengxu",
    title: "客户端",
    path: "10",
  },
  {
    icon: "iconfont icon-shezhi",
    title: "设置",
    path: "11",
  },
]);
let submenuData = ref({});
// 点击下拉菜单
function handleCommand(command) {
  if (command === "logout") {
    window.localStorage.removeItem("AccessToken");
    proxy.$router.go(0);
  } else if (command === "setting") {
    proxy.$router.push({ path: "/index/accountSetting" });
  }
}
// 加载子菜单
function loadSubPage(index) {
  menuData.value[index].child ? (submenuData.value = menuData.value[index].child) : (submenuData.value = {});
  pushSite(submenuData.value.list[0].subtitle)
}
function pushSite(siteName) {
  currentSite.value !== siteName ? currentSite.value = siteName : '';
}

onMounted(() => {
  submenuData.value = menuData.value[1].child;
  console.log(submenuData.value)
  pushSite(submenuData.value.list[0].subtitle)
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 侧边容器 */
.el-aside {
  width: unset;
  height: 100%;
}
.el-container {
  height: 100vh;
}
ul.el-menu:not(.el-menu--collapse) {
  width: 160px; /* 菜单展开宽度 */
}
/* 菜单 */
.main-menu {
  height: 100%;
  background-color: #001529;
}
/* 菜单标题 */
.menu-title {
  width: 100%;
  height: 60px;
  font-size: 15px;
  line-height: 60px;
  color: #e4e6e8;
  overflow: hidden;
}
.menu-title span {
  margin-left: 18px;
}
.main-menu .el-menu-item {
  height: 40px;
  margin-bottom: 8px;
  color: #a6adb4;
}
.el-menu-item:hover {
  color: #fff;
  background-color: #001529;
}
.el-menu-item.is-active {
  color: #fff;
  background-color: #1890ff;
}
.icon-xiaochengxu {
  color: #36b313;
}
/* 右侧容器 */
.right-box {
  height: 100%;
}
/* 右侧头部 */
.main-header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 0 white, 1px 0 1px 1px rgb(141, 141, 141);
}
.left-btns {
  margin-left: 16px;
  display: flex;
}
.left-btns .current-site {
  margin-left: 40px;
  font-size: 14px;
  padding: 4px;
  color: #8c8c8c;
}
/* 按钮 */
.main-header .el-button {
  width: 40px;
  margin: 0;
  font-size: 18px;
  border: none;
  background-color: unset;
}
.main-header .el-button:hover {
  color: #595959;
}
.main-header .el-button:active {
  color: #595959;
}
.main-header .admin-account {
  width: 115px;
  height: 64px;
  line-height: 64px;
  margin: 0 10px;
  font-size: 15px;
}
.admin-account:hover {
  cursor: pointer;
}
.admin-account .el-icon {
  margin-right: 6px;
  font-weight: bold;
}
.right-box .el-main {
  background-color: #f0f2f5;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
/* 内部子菜单 */
.sub-menu .el-aside {
  width: 120px;
  background-color: #fff;
  overflow: hidden;
}
.sub-menu .el-main {
  padding: 16px 20px;
}
.sub-menu div {
  width: unset;
}
.sub-menu .el-menu-item {
  width: 120px;
  height: 40px;
}
.sub-menu .el-menu-item:hover {
  color: unset;
  background-color: #f5f5f5;
}
.sub-menu .el-menu-item.is-active {
  color: unset;
  background-color: #f5f5f5;
}
.submenu-title {
  padding: 12px 20px;
  font-size: 14px;
}
</style>
