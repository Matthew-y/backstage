<!-- 商品分类 -->
<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">商品分类</div>
      <el-row>
        <el-col :span="6">
          <el-button
            type="primary"
            size="default"
            @click="
              dialogVisible = true;
              dialogTitle = '新增商品分类';
            "
            ><span>+&nbsp;</span>新增</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="typeList" row-key="good_type_id" :header-cell-style="tableHeaderStyle" :cell-style="tableCellStyle">
        <el-table-column prop="good_type_id" label="分类ID" width="188px"></el-table-column>
        <el-table-column prop="type_name" label="分类名称" width="422px"></el-table-column>
        <el-table-column label="状态" width="202px">
          <template #default="scope">
            <div class="name-tag">{{ scope.row.status }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="152px"></el-table-column>
        <el-table-column prop="update_time" label="添加时间" width="402px"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <span class="action" @click="editType(scope)">编辑</span>
            <span class="action" @click="deleteType(scope)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" width="720px" v-model="dialogVisible">
      <el-form :model="dialogForm" ref="formInstance" :rules="dialogRules" label-width="193px" :inline="false">
        <el-form-item label="分类名称:" required>
          <el-input class="input-box" v-model="dialogForm.typeName"></el-input>
        </el-form-item>
        <el-form-item prop="defaultSelected" label="上级分类:">
          <el-tree-select
            class="input-box"
            :data="superiorTypeList"
            node-key="value"
            check-on-click-node
            v-model="defaultSelected"
            :render-after-expand="false"
            :default-checked-keys="defaultSelected"
            :default-expanded-keys="defaultSelected"
          />
        </el-form-item>
        <el-form-item label="分类图片:">
          <el-upload
            class="avatar-uploader"
            action="http://api_devs.wanxikeji.cn/api/savePic"
            v-model="dialogForm.typeImg"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            name="img"
          >
            <img style="width: 80px" v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" required :show-message="false">
          <div class="my-2 flex items-center text-sm">
            <el-radio-group v-model="dialogForm.status" class="ml-4">
              <el-radio label="1">显示</el-radio>
              <el-radio label="2">隐藏</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="排序:" required :show-message="false">
          <el-input-number style="width: 88px" controls-position="right" :min="0" class="input-num" v-model="dialogForm.sort" />
          <div class="input-note">数字越小越靠前</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button
          class="cancel-btn"
          @click="
            dialogVisible = false;
            resetForm();
          "
          >取消</el-button
        >
        <el-button type="primary" @click="confirmType">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
  <el-pagination
    @current-change="currentChange"
    :page-size="10"
    :total="pageTotal" background>
  </el-pagination>
  
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const accessToken = localStorage.getItem("AccessToken");

let dialogTitle = ref("新建商品分类");
let typeList = ref([]); // 分类列表
let dialogVisible = ref(false); // 弹框显示状态
let imageUrl = ref();
let dialogForm = ref({
  typeName: "",
  superiorType: [],
  typeImg: "",
  status: "1",
  sort: 100,
});
let dialogRules = ref([

]);
let formInstance = ref();
let selectValue = ref();
let superiorTypeList = ref([]);
let defaultSelected = ref([]);
let pageTotal = ref(10);
let pageIndex = ref('1');

// 编辑商品分类
function editType(scope) {
  (dialogTitle.value = "编辑商品分类"), (dialogVisible.value = true);
  console.log(scope.row);
  // selectValue.value = scope.row.parent_id;
  dialogForm.value = {
    typeName: scope.row.type_name,
    superiorType: "",
    typeImg: String(scope.row.pic),
    status: scope.row.status,
    sort: 100,
    typeId: scope.row.good_type_id,
  };
  defaultSelected.value.push(scope.row.parent_id);
  console.log(defaultSelected.value);
}
// 删除商品分类
function deleteType(scope) {
  proxy.$axios
    .post("http://api_devs.wanxikeji.cn/api/admin/deleteGoodtype", {
      token: accessToken,
      id: String(scope.row.good_type_id),
    })
    .then((res) => {
      alert(res.data.msg);
    });
}
// 图片选择
function handleUploadSuccess(res, uploadFile) {
  imageUrl.value = "http://api_devs.wanxikeji.cn/" + res.data;
}
// 确认添加分类
function confirmType() {
  let parentId = 0;
  let typeId = "";
  let typeName = dialogForm.value.typeName;
  if (defaultSelected.value !== "" && defaultSelected.value === 0) {
    parentId = defaultSelected.value[0];
  }
  if (dialogTitle.value === "编辑商品分类") {
    typeId = String(dialogForm.value.typeId);
  }

  proxy.$axios
    .post("http://api_devs.wanxikeji.cn/api/admin/addGoodType", {
      token: accessToken,
      name: typeName,
      pid: String(parentId),
      pic: imageUrl.value,
      id: typeId,
    })
    .then((res) => {
      ElMessage({
        message: res.data.msg,
        type: 'success',
      })
      resetForm();
      dialogVisible.value = false;
      getTypeList()
    });
}
// 重置表单数据
function resetForm() {
  dialogForm.value = {
    typeName: "",
    superiorType: [],
    typeImg: "",
    status: "1",
    sort: 100,
  };
  defaultSelected.value = [];
}
// 页码变更
function currentChange(index) {
  pageIndex.value = String(index);
  getTypeList();
}
// 表格表头样式
function tableHeaderStyle() {
  return {
    height: "54px",
    color: "black",
    "padding-left": "8px",
    "font-weight": "normal",
    overflow: "hidden",
    "background-color": "#fafafa",
  };
}
// 表格单元格样式
function tableCellStyle() {
  return {
    height: "55px",
    padding: "8px",
    "font-size": "14px",
  };
}

// 获取商品分类数据
function getTypeList() {
  ElMessage({
    message: '获取分类列表...',
    type: 'info',
  });
  proxy
    .$axios({
      url: "http://api_devs.wanxikeji.cn/api/admin/goodsTypeList",
      method: "post",
      data: {
        token: localStorage.getItem("AccessToken"),
        page: pageIndex.value,
        size: '10',
      },
    })
    .then((res) => {
      console.log(res);
      pageTotal.value = res.data.data.length;
      ElMessage({
        message: '请求成功',
        type: 'success'
      })
      let list = res.data.data;
      // 一级分类
      list.forEach((item, index) => {
        if (item.parent_id === 0) {
          typeList.value.push(item);
          let tempItem = item;
          tempItem.value = item.good_type_id;
          tempItem.label = item.type_name;
          superiorTypeList.value.push(tempItem);
        }
      });
      // 二级分类
      typeList.value.forEach((item1) => {
        item1.children = [];
        list.forEach((item2, index) => {
          if (item2.parent_id === item1.good_type_id) {
            item1.children.push(item2);
          }
        });
      });

      superiorTypeList.value.forEach((item1) => {
        item1.children = [];
        list.forEach((item2, index) => {
          if (item2.parent_id === item1.good_type_id) {
            let tempItem = item2;
            tempItem.value = item2.good_type_id;
            tempItem.label = item2.type_name;
            item1.children.push(tempItem);
          }
        });
      });
      // 三级分类
      typeList.value.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children = [];
          list.forEach((item3) => {
            if (item3.parent_id === item2.good_type_id) {
              item2.children.push(item3);
            }
          });
        });
      });

      superiorTypeList.value.forEach((item1) => {
        item1.children.forEach((item2, index) => {
          item2.children = [];
          list.forEach((item3) => {
            if (item3.parent_id === item2.good_type_id) {
              let tempItem = item3;
              tempItem.value = item3.good_type_id;
              tempItem.label = item3.type_name;
              item2.children.push(tempItem);
            }
          });
        });
      });
    });
}
getTypeList();
</script>
<style scoped>
@import "@/assets/css/reset.css";
@import "@/assets/css/pageHeader.css";
.name-tag {
  width: 40px;
  height: 22px;
  margin-left: 6px;
  font-size: 12px;
  text-align: center;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  background-color: #f6ffed;
}
.el-form-item {
  min-height: 40px;
  margin-bottom: 18px;
}
.input-box {
  width: 364px;
}
/* 图片上传组件 */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 20px;
  color: #dad9d9;
  width: 80px;
  height: 80px;
  text-align: center;
  border: 1px dashed #dad9d9;
}
.input-note {
  width: 1000px;
  font-size: 13px;
  color: #a1a1a1;
}
.cancel-btn {
  border: 1px solid #d9d9d9;
}
</style>
