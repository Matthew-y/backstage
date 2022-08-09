import axios from "axios";


const myAxios = new axios.create({});
axios.interceptors.request.use((config) => {
  return config;
});

axios.interceptors.response.use((res) => {
  return res;
})

export default myAxios;