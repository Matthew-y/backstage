import axios from "axios";


const myAxios = new axios.create({});
myAxios.interceptors.request.use((config) => {
  return config;
});

myAxios.interceptors.response.use((res) => {
  return res;
})

export default myAxios;