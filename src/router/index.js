import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
  },
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/index/accountSetting",
    component: () => import("../views/accountSetting.vue"),
  },
  {
    path: "/index",
    component: () => import("@/views/index.vue"),
    children: [
      {
        path: "/index/admin/list",
        component: () => import("@/views/admin/list.vue"),
      },
      {
        path: "/index/admin/roleManage",
        component: () => import("@/views/admin/roleManage.vue"),
      },
      {
        path: "/index/store/setting",
        component: () => import('@/views/store/setting.vue')
      },
      {
        path: "/index/store/addressManage",
        component: () => import('@/views/store/addressManage.vue')
      },
      {
        path: "/index/commodity/list",
        component: () => import("@/views/commodity/list.vue"),
      },
      {
        path: "/index/commodity/classification",
        component: () => import("@/views/commodity/classification.vue"),
      },
      {
        path: "/index/commodity/classification",
        component: () => import("@/views/commodity/classification.vue"),
      },
      {
        path: "/index/order/allOrder",
        component: () => import("@/views/order/allOrder.vue"),
      },
      {
        path: "/index/vip/list",
        component: () => import("@/views/vip/list.vue"),
      },
      {
        path: "/index/content/fileManage",
        component: () => import("@/views/content/fileManage.vue"),
      },
      {
        path: "/index/marketing/coupon",
        component: () => import("@/views/marketing/coupon.vue"),
      },
      {
        path: "/index/app/registery",
        component: () => import("@/views/app/registery.vue"),
      },
      {
        path: "/index/deal/setting",
        component: () => import("@/views/deal/setting.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
