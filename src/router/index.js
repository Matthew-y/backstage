import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
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
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
