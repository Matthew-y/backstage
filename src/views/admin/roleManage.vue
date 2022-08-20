<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">角色管理</div>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="showDialog"><span>+&nbsp;</span>新增</el-button>
        </el-col>
      </el-row>
      <el-table :header-cell-style="tableHeaderStyle" :cell-style="tableCellStyle" :data="roleList" stripe>
        <el-table-column property="role_id" label="角色ID" width="267px" />
        <el-table-column property="role_name" label="角色名称" width="317px" />
        <el-table-column property="sort" label="排序" width="216px" />
        <el-table-column property="created_at" label="添加时间" width="571px" />
        <el-table-column label="操作">
          <template #default="scope">
            <span class="action" @click="editRole(scope)">编辑</span>
            <span class="action" @click="deleteRole(scope)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="dialogTitle" @close="" v-model="dialogVisible" width="720px">
      <el-form :model="dialogForm" ref="form" :rules="rules" label-width="196px" :inline="false">
        <el-form-item label="角色名称:" required>
          <el-input class="dialog-input" v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级角色:">
          <el-select class="dialog-input" v-model="dialogForm.superior" value-key="" @change="handleSuperiorSelect">
            <el-option v-for="item in superiorList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限:">
          <el-tree :data="permissionData" :props="props" show-checkbox @check="handleCheckChange" :default-checked-keys="dialogForm.menupermission" node-key="permission_id" />
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
            resetDialogForm;
          "
          >取消</el-button
        >
        <el-button type="primary" @click="confirmAddRole">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";

const { proxy } = getCurrentInstance();
let accessToken = localStorage.getItem("AccessToken");
let dialogTitle = ref('新增角色');
let dialogVisible = ref(false);
let roleList = ref([]);
let dialogForm = ref({
  name: "",
  superior: "",
  menupermission: [],
  sort: 100,
});
// 上级列表
let superiorList = ref([
  { value: 1, label: "顶级角色" },
  { value: 2, label: "运营人员" },
  { value: 3, label: "客服人员" },
  { value: 4, label: "发货人员" },
]);
let permissionData = ref([]);
const props = {
  label: "permission_name",
  children: "zones",
};

// 新建角色
function showDialog() {
  dialogTitle.value = '新增角色';
  dialogVisible.value = !dialogVisible.value;
  resetDialogForm();
}
// 选择并更改上级角色
function handleSuperiorSelect(val) {
  superiorList.value.forEach((item) => {
    if (item.value === val) {
      dialogForm.value.superior = item.label;
    }
  });
}
// 录入菜单权限数据
function handleCheckChange(nodeObj, status) {
  status.checkedNodes.forEach((item) => {
    dialogForm.value.menupermission.push(item.permission_id);
  });
}
// 确认添加角色
function confirmAddRole(action) {
  if (dialogForm.value.role_id) {
    proxy.$axios
      .post("http://api_devs.wanxikeji.cn/api/admin/roleAddModify", {
        token: accessToken,
        role_name: dialogForm.value.name,
        permissions: dialogForm.value.menupermission,
        sort: dialogForm.value.sort,
        role_id: dialogForm.value.role_id,
      })
      .then((res) => {
        console.log(res.data);
      });
  } else {
    proxy.$axios
      .post("http://api_devs.wanxikeji.cn/api/admin/roleAddModify", {
        token: accessToken,
        role_name: dialogForm.value.name,
        permissions: dialogForm.value.menupermission,
        sort: dialogForm.value.sort,
      })
      .then((res) => {
        console.log(res.data);
      });
  }
  resetDialogForm();
  dialogVisible.value = false; // 关闭输入框
}
// 编辑角色
function editRole(scope) {
  dialogTitle.value = '编辑角色';
  showDialog()
  dialogForm.value = {
    name: scope.row.role_name,
    superior: "",
    menupermission: [],
    sort: scope.row.sort,
    role_id: scope.row.role_id,
  };
  scope.row.permission.forEach((item) => {
    dialogForm.value.menupermission.push(item.permission_id);
  });
}
// 删除角色
function deleteRole(scope) {
  proxy.$axios.post("http://api_devs.wanxikeji.cn/api/admin/accountDelete", { token: accessToken, id: scope.row.role_id }).then((res) => {
    console.log(res);
  });
}
// 获取角色列表
function getRoleList() {
  proxy.$axios.post("http://api_devs.wanxikeji.cn/api/admin/roleLise", { token: accessToken }).then((res) => {
    roleList.value = res.data.data.data;
  });
}
// 重置输入框数据
function resetDialogForm() {
  dialogForm.value = {
    name: "",
    superior: "",
    menupermission: [],
    sort: 100,
  };
}
// 表格表头样式
function tableHeaderStyle() {
  return {
    height: "54px",
    color: "black",
    "padding-left": "8px",
    "font-weight": "normal",
    overflow: "hidden",
  };
}
// 表格单元格样式
function tableCellStyle() {
  return {
    height: "54px",
    padding: "8px",
    "font-size": "14px",
  };
}
onMounted(() => {
  getRoleList();
  proxy
    .$axios({
      url: "http://api_devs.wanxikeji.cn/api/admin/permissionList",
      method: "post",
      data: { token: accessToken },
    })
    .then((res) => {
      if (res.data.code === 2000) {
        let tempArr = res.data.data;
        tempArr.forEach((item) => {
          if (item.parent_id === 0) {
            permissionData.value.push(item);
          }
        });

        permissionData.value.forEach((item) => {
          item.zones = [];
          tempArr.forEach((items) => {
            if (items.parent_id === item.permission_id) {
              item.zones.push(items);
            }
          });
        });
      }
    });
});
</script>
<style scoped>
@import "@/assets/css/reset.css";
.el-container.full-page {
  width: 100%;
  height: 100%;
}
.list-box {
  width: inherit;
  height: unset;
  padding: 24px;
  background-color: white;
}
.list-box .title {
  width: inherit;
  height: 24px;
  margin-bottom: 16px;
}
.el-button {
  width: 79px;
  height: 32px;
  border-radius: 2px;
  background-color: #1890ff;
}
.el-button span {
  font-size: 16px;
  font-weight: bold;
}
span.action {
  margin-right: 8px;
  color: #1890ff;
  user-select: none;
  cursor: pointer;
}
.cancel-btn {
  border: 1px solid #d9d9d9;
  background-color: #fff;
}
.dialog-input {
  width: 364px;
}
.input-note {
  width: 1000px;
  font-size: 13px;
  color: #a1a1a1;
}
</style>
