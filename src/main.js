import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./axios";
import elementPlus from "element-plus";
import "element-plus/dist/index.css";

router.beforeEach((to, from, next) => {
  const accessToken = window.localStorage.getItem('AccessToken')
  if (to.path === '/') {
    if(accessToken){
        router.push({ path: '/index' });
    }
    next();
  }else{
    if(accessToken){
      if (to.path === '/') {
        router.push({ path: '/index' });
      }
      next()
    }else{
      console.log('need login')
      router.push({ path: '/' });
    }
  }
})

const app = createApp(App);

app.config.globalProperties.$axios = axios;
app.config.globalProperties.$router = router;
app.use(store).use(router).use(elementPlus).mount("#app");
