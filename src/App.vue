<template>
  <router-view></router-view>
</template>
<script setup>
import { ref } from "vue";
import home from "@/views/login.vue";
import { ElForm, ElInput, ElIcon, ElButton, ElCol } from "element-plus";
import { Search, Calendar } from "@element-plus/icons-vue";
let data = ref("helloworld");
</script>
<style>

</style>
