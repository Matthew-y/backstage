<template>
  <el-container>
    <!-- 左侧区域 -->
    <el-aside>
      <!-- 菜单 -->
      <el-menu
        :route="true"
        :data="menuData"
        class="main-menu el-menu-vertical"
        @select=""
        :collapse="isCollapsed"
        :default-active="pinedMenuItem"
      >
        <div class="menu-title"><span class="">萤火商城2.0</span></div>
        <el-menu-item v-for="(item, index) in menuData" :key="index" :index="String(index)" @click="loadSubMenu(index)">
          <el-icon :class="item.icon"></el-icon><template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧区域 -->
    <el-main height="100%">
      <el-container class="right-box">
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
              {{ submenuData.title }} <span style="color: #404040" v-if="currentPageName">/ {{ currentPageName }}</span>
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
            <el-aside v-if="submenuData.title && !isCollapsed" width="120px">
              <!-- 子菜单 -->
              <el-menu :data="submenuData" @select="" default-active="0" :route="true">
                <div class="submenu-title">
                  {{ submenuData.title }}
                </div>
                <el-menu-item
                  v-for="(item, index) in submenuData.list"
                  @click="loadComponentPage(submenuData.list[index].subtitle, null, index)"
                  :index="String(index)"
                  :key="index"
                >
                  <router-link :to="item.path" active-class="active-router">
                    {{ item.subtitle }}
                  </router-link>
                </el-menu-item>
              </el-menu>
            </el-aside>
            <el-main class="conponent-area">
              <main class="inner-main">
                <router-view></router-view>
              </main>
              <!-- 页脚 -->
              <footer class="page-footer">Copyright © 2021 萤火科技 |<a href="https://www.yiovo.com/">YIOVO.COM</a></footer>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import { RefreshRight, Fold } from "@element-plus/icons-vue";
import "@/assets/iconfont/iconfont.css";

const { proxy } = getCurrentInstance(); // 组件实例
let isCollapsed = ref(false); // 侧边主菜单折叠状态
let currentPageName = ref(""); // 定义当前所在页面默认名称
let pinedMenuItem = ref("1");
let pinedSubmenuItem = ref("0");
// 侧边主菜单条目
let menuData = ref([
  {
    icon: "iconfont icon-zhuye",
    title: "首页",
    path: "/index",
  },
  {
    icon: "iconfont icon-guanliyuan1",
    title: "管理员",
    path: "/index/admin/list",
    child: {
      title: "管理员",
      list: [
        { subtitle: "管理员列表", path: "/index/admin/list" },
        { subtitle: "角色管理", path: "/index/admin/roleManage" },
      ],
    },
  },
  {
    icon: "iconfont icon-xianxiamendian",
    title: "店铺管理",
    path: "/index/store/setting",
    child: {
      title: "店铺管理",
      list: [
        { subtitle: "店铺设置", path: "/index/store/setting" },
        { subtitle: "地址管理", path: "/index/addressManage" },
        { subtitle: "店铺页面", path: "/index" },
      ],
    },
  },
  {
    icon: "iconfont icon-shangpingouwudai2",
    title: "商品管理",
    path: "/index/commodity/list",
    child: {
      title: "商品管理",
      list: [
        { subtitle: "商品列表", path: "/index/commodity/list" },
        { subtitle: "商品分类", path: "/index/commodity/classification" },
        { subtitle: "服务承诺", path: "/index" },
        { subtitle: "商品评价", path: "/index" },
      ],
    },
  },
  {
    icon: "iconfont icon-dingdan",
    title: "订单管理",
    path: "/index/order/allOrder",
    child: {
      title: "订单管理",
      list: [
        { subtitle: "全部订单", path: "/index/order/allOrder" },
        { subtitle: "待发货", path: "/index" },
        { subtitle: "待收货", path: "/index" },
        { subtitle: "待付款", path: "/index" },
        { subtitle: "已完成", path: "/index" },
        { subtitle: "已取消", path: "/index" },
        { subtitle: "售后管理", path: "/index" },
        { subtitle: "订单处理", path: "/index" },
      ],
    },
  },
  {
    icon: "iconfont icon-huiyuan21",
    title: "会员管理",
    path: "/index/vip/list",
    child: {
      title: "会员管理",
      list: [
        { subtitle: "会员列表", path: "/index/vip/list" },
        { subtitle: "会员等级", path: "/index" },
        { subtitle: "余额记录", path: "/index" },
      ],
    },
  },
  {
    icon: "iconfont icon-dingdanzhongxin",
    title: "内容管理",
    path: "/index/content/fileManage",
    child: {
      title: "内容管理",
      list: [
        { subtitle: "文章管理", path: "/index/content/fileManage" },
        { subtitle: "文件库管理", path: "/index" },
        { subtitle: "帮助中心", path: "/index" },
      ],
    },
  },
  {
    icon: "iconfont icon-yingxiao-dianjihou",
    title: "营销管理",
    path: "/index/marketing/coupon",
    child: {
      title: "营销管理",
      list: [
        { subtitle: "优惠券", path: "/index/marketing/coupon" },
        { subtitle: "会员充值", path: "/index" },
        { subtitle: "积分管理", path: "/index" },
        { subtitle: "满额包邮", path: "/index" },
      ],
    },
  },
  {
    icon: "iconfont icon-shujuzhongxin",
    title: "数据统计",
    path: "/index/statics",
  },
  {
    icon: "iconfont icon-xiaochengxu",
    title: "客户端",
    path: "/index/app/registery",
    child: {
      title: "客户端",
      list: [
        { subtitle: "注册设置", path: "/index/app/registery" },
        { subtitle: "小程序", path: "/index/app/lightApp" },
        { subtitle: "H5端", path: "/index/app/h5" },
      ],
    },
  },
  {
    icon: "iconfont icon-shezhi",
    title: "设置",
    path: "/index/deal/setting",
    child: {
      title: "设置",
      list: [
        { subtitle: "交易设置", path: "/index/deal/setting" },
        { subtitle: "上传设置", path: "/index" },
        { subtitle: "短信通知", path: "/index" },
        { subtitle: "配送设置", path: "/index" },
        { subtitle: "其他设置", path: "/index" },
      ],
    },
  },
]);
let submenuData = ref({}); // 子菜单条目
// 点击下拉菜单项目
function handleCommand(command) {
  if (command === "logout") {
    // 删除本地token并跳转登录页（退出登录）
    window.localStorage.removeItem("AccessToken");
    proxy.$router.go(0);
  } else if (command === "setting") {
    proxy.$router.push({ path: "/index/accountSetting" }); // 跳转账户设置页面
  }
}
// 加载子菜单
function loadSubMenu(index) {
  console.log("加载子菜单" + index);
  menuData.value[index].child ? (submenuData.value = menuData.value[index].child) : (submenuData.value = {}); // 重新赋值子菜单数据
  submenuData.value.title ? loadComponentPage(submenuData.value.list[0].subtitle, index, 0) : loadComponentPage("", index, 0);
}
// 加载子组件
function loadComponentPage(pageName, index, subIndex) {
  console.log("加载子组件", index);
  if (submenuData.value.list) {
    let newPath = submenuData.value.list[subIndex].path;
    console.log(submenuData.value.list);
    proxy.$router.push({ path: newPath, query: { itemIndex: index, subItemIndex: subIndex } });
  } else {
    console.log("空页面:", menuData.value[index].path);

    proxy.$router.push({ path: menuData.value[index].path, query: { itemIndex: index, subItemIndex: subIndex } });
  }
  loadCurrentPageName(pageName);
}
// 加载子页面名称到页头
function loadCurrentPageName(pageName) {
  console.log("加载当前页名称" + pageName);
  console.log("----------");
  currentPageName.value === pageName ? "" : (currentPageName.value = pageName);
}
// 默认选中子菜单第一项
// TODO
function defaultSelectItem() {}

onMounted(() => {
  submenuData.value = menuData.value[1].child; // 默认加载的子菜单
  let mainIndex, subIndex;
  // 判断是否为首次登录
  if (!proxy.$route.query.itemIndex) {
    mainIndex = 1;
    subIndex = 0;
  } else {
    let path = proxy.$route.path;
    mainIndex = parseInt(proxy.$route.query.itemIndex); // 获取之前所在的主菜单项
    subIndex = parseInt(proxy.$route.query.subItemIndex); // 获取之前所在的子菜单项

    menuData.value.forEach((item, index) => {
      if (item.child) {
        item.child.list.forEach((subItem, subIndex) => {
          if (subItem.path === path) {
            submenuData.value = item.child;
            pinedMenuItem.value = String(index);
          }
        });
      }
    });
  }

  loadComponentPage(submenuData.value.list[0].subtitle, mainIndex, subIndex);
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}
.el-menu a {
  width: inherit;
  height: inherit;
  line-height: 40px;
  color: black;
  background-color: transparent;
}
.active-router {
  background-color: red;
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
  box-shadow: 0 2px 10px 0px rgb(232, 232, 232);
  z-index: 2;
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
/* 下拉菜单 */
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
/* 内部子菜单 */
.sub-menu {
  height: 896px;
}
.sub-menu .el-aside {
  width: 120px;
  background-color: white;
  box-shadow: 2px 0px 10px 0px rgb(232, 232, 232);
  overflow: hidden;
  z-index: 1;
}
.sub-menu .el-main.conponent-area {
  height: unset;
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
main.inner-main {
  width: 100%;
  min-height: 718px;
}
/* 页脚 */
.page-footer {
  height: 100px;
  line-height: 110px;
  margin: 23px 50px;
  text-align: center;
  font-size: 14px;
}
</style>
