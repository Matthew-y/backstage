<template>
  <router-view></router-view>
</template>
<script setup>
import { ref } from "vue";
import { ElForm, ElInput, ElIcon, ElButton, ElCol } from "element-plus";
import { Search, Calendar } from "@element-plus/icons-vue";
let data = ref("helloworld");
</script>
<style>
*{
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
