import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./axios";
import elementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);

app.config.globalProperties.$axios = axios;
app.config.globalProperties.$router = router;
app.use(store).use(router).use(elementPlus).mount("#app");
