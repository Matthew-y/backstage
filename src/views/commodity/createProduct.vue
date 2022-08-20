<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">创建商品</div>
      <!-- 标签分页 -->
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basicInfo">
          <el-form :model="formBasic" ref="form1" :rules="rules" label-width="193px" :inline="false">
            <el-form-item prop="name" label="商品名称:" required>
              <el-input class="input-box" v-model="formBasic.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>

            <el-form-item prop="classification" label="商品分类:" required>
              <el-tree-select
                class="input-box"
                :data="selectOptions"
                v-model="formBasic.classification"
                multiple
                :render-after-expand="false"
                show-checkbox
                check-on-click-node
                placeholder="请选择商品分类"
                clearable
              />
              <div style="width: 1000px"><span class="action" @click="addClass">去新增</span><span class="action">刷新</span></div>
            </el-form-item>

            <el-form-item prop="img" label="商品图片:" required>
              <el-upload class="avatar-uploader" action="" v-model="formBasic.img" :show-file-list="false" :on-change="handleUploadSuccess">
                <img style="width: 80px" v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="img-note">建议尺寸：750*750像素, 最多上传10张, 可拖拽图片调整顺序, 第1张将作为商品首图</div>
            </el-form-item>

            <el-form-item prop="code" label="商品编码:">
              <el-input class="input-box" v-model="formBasic.code" placeholder="请输入商品编码"></el-input>
            </el-form-item>

            <el-form-item prop="template" label="运费模板:" required>
              <el-tree-select class="ship-template" :data="shipTemplate" v-model="formBasic.template" placeholder="请选择运费模板">
              </el-tree-select>
              <div style="width: 1000px"><span class="action">新增模板</span><span class="action">刷新</span></div>
            </el-form-item>

            <el-form-item prop="" label="商品状态:" required>
              <div class="my-2 flex items-center text-sm">
                <el-radio-group v-model="formBasic.status" class="ml-4">
                  <el-radio label="1">上架</el-radio>
                  <el-radio label="2">下架</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <el-form-item label="排序:" required :show-message="false">
              <el-input-number style="width: 88px" controls-position="right" :min="0" class="input-num" v-model="formBasic.sort" />
              <div class="input-note">数字越小越靠前</div>
            </el-form-item>

            <el-form-item>
              <el-button style="width: 64px" type="primary" @click="validateFormData">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 规格库存 -->
        <el-tab-pane label="规格/库存" name="specs$storage">
          <el-form :model="formSpecsStorage" ref="form2" label-width="193px" :inline="false">
            <el-form-item label="规格类型:" required :show-message="false">
              <div class="my-2 flex items-center text-sm">
                <el-radio-group v-model="formSpecsStorage.specs" class="ml-4">
                  <el-radio label="1">单规格</el-radio>
                  <el-radio label="2">多规格</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <el-form-item label="商品价格:" required :show-message="false">
              <el-input-number
                style="width: 88px"
                controls-position="right"
                :min="0.01"
                class="input-num"
                v-model="formSpecsStorage.price"
              />元
              <div class="input-note">商品的实际购买金额，最低0.01</div>
            </el-form-item>

            <el-form-item prop="" label="划线价:">
              <el-input-number style="width: 88px" controls-position="right" class="input-num" v-model="formSpecsStorage.displayPrice" />元
              <div class="input-note">划线价仅用于商品页展示</div>
            </el-form-item>

            <el-form-item label="当前库存数量:" required :show-message="false">
              <el-input-number style="width: 88px" controls-position="right" class="input-num" v-model="formSpecsStorage.storage" />件
              <div class="input-note">商品的实际库存数量，为0时用户无法下单</div>
            </el-form-item>

            <el-form-item label="商品重量:" required :show-message="false">
              <el-input-number style="width: 88px" controls-position="right" class="input-num" v-model="formSpecsStorage.weight" />千克(Kg)
              <div class="input-note">商品的实际重量，用于计算运费</div>
            </el-form-item>

            <el-form-item label="库存计算方式:" required :show-message="false">
              <div class="my-2 flex items-center text-sm">
                <el-radio-group v-model="formSpecsStorage.storageCalc" class="ml-4">
                  <el-radio label="1">下单减库存</el-radio>
                  <el-radio label="2">付款减库存</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button style="width: 64px" type="primary" @click="validateFormData">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品详情 -->
        <el-tab-pane label="商品详情" name="detail">
          <el-form :model="formDetails" ref="form3" :rules="rules" label-width="193px" :inline="false">
            <el-form-item prop="details" label="商品详情:">
              <div style="border: 1px solid #ccc; width: 360px; height: 646px">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="simple" />
                <Editor
                  style="height: 500px; overflow-y: hidden"
                  v-model="formDetails.details"
                  :defaultConfig="editorConfig"
                  mode="simple"
                  @onCreated="handleCreated"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 64px" type="primary" @click="validateFormData">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 更多设置 -->
        <el-tab-pane label="更多设置" name="setting">
          <el-form :model="formSettings" ref="form4" label-width="193px" :inline="false">
            <el-form-item label="商品卖点:">
              <el-input v-model="formSettings.sellingPoint" placeholder="请输入商品卖点"></el-input>
              <div class="input-note">一句话简述，例如：此款商品美观大方 性价比较高 不容错过</div>
            </el-form-item>

            <el-form-item label="服务与承诺:">
              <el-input v-model="formSettings.service$promise" placeholder="请输入商品卖点"></el-input>
              <div class="input-note"><span class="action">去新增</span><span class="action">刷新</span></div>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 64px" type="primary" @click="validateFormData">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-container>
</template>
<script setup>
import { getCurrentInstance, ref, shallowRef, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Plus } from "@element-plus/icons-vue";
import "@wangeditor/editor/dist/css/style.css";

const { proxy } = getCurrentInstance();
const store = useStore();

let editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const toolbarConfig = {}; // 菜单栏配置
const editorConfig = { placeholder: "请输入内容..." }; // 编辑器配置

let activeTab = ref("basicInfo"); // 选中标签页
let selectValue = ref(); // 商品分类选择
let imageUrl = ref(""); // 图片地址
let form1 = ref();
let form2 = ref();
let form3 = ref();
let form4 = ref();
// 校验规则
let rules = {
  name: [{ validator: validateName }], //商品名称
  classification: [{ validator: validateClass}], // 商品分类
  img: [{ validator: validateImg }], // 商品图片
  template: [{ validator: validateTemplate }], // 运费模板
  details: [{ validator: validateArticle }], // 富文本内容
};
// 基本信息表单
let formBasic = ref({
  name: "",
  classification: [],
  img: "",
  code: "",
  template: "",
  status: "1",
  sort: 1,
});
// 规格/库存表单
let formSpecsStorage = ref({
  specs: "1",
  price: 1.0,
  displayPrice: "",
  storage: 100,
  weight: 0,
  storageCalc: '1'
});
// 商品详情表单
let formDetails = ref({
  details: "<p><br></p>",
});
// 更多设置表单
let formSettings = ref([
  {
    sellingPoint: "",
    service$promise: "",
  },
]);
// 包邮模板
let shipTemplate = ref([
  {
    value: 1,
    label: "全国包邮，除偏远地区",
  },
]);
// 商品分类列表
let selectOptions = ref([]);
// 添加图片执行函数
function handleUploadSuccess(res, uploadFile) {
  console.log(uploadFile[0].raw);
  formBasic.value.img = uploadFile[0].raw;
  imageUrl.value = URL.createObjectURL(uploadFile[0].raw);
}
// 编辑器创建后
function handleCreated(editor) {
  editorRef.value = editor; // 记录 editor 实例，重要！
}
// 校验商品名称
function validateName(rule, value, callback) {
  if(value.length < 2) {
    callback(new Error('请输入至少2个字符'))
  }else{
    callback();
  }
}
// 校验商品分类
function validateClass(rule, value, callback) {
  if (value[0]) {
    callback();
  } else {
    callback(new Error("请至少选择1个商品分类"));
  }
}
// 校验图片
function validateImg(rule, value, callback) {
  if(!value){
    callback(new Error('请至少上传1张商品图片'))
  }else{
    callback();
  }
}
// 校验运费模板
function validateTemplate(rule, value, callback) {
  if(!value) {
    callback(new Error('请选择运费模板'))
  }else {
    callback();
  }
}
// 校验富文本
function validateArticle(rule, value, callback) {
  if (value === "<p><br></p>" || !value) {
    callback(new Error("商品详情不能为空"));
  } else {
    callback();
  }
}
// 表单校验
function validateFormData() {
  // 录入商品分类信息
  // selectOptions.value.forEach((item) => {
  //   selectValue.value.forEach((subItem) => {
  //     if (item.value === subItem) {
  //       formBasic.value.type.push(item.label);
  //     }
  //   });
  // });
  let keyArr1 = ["name", 'classification', 'img', 'template'];
  
  // 各表单校验
  form1.value.validate((valid) => {
    if(!valid){
      activeTab.value = 'basicInfo'
    }else{

      form3.value.validate((valid) => {
        console.log(valid);
        if(!valid) {
          activeTab.value = 'detail'
        }
      });
    }
  });
}
// 获取商品分类数据
proxy
  .$axios({
    url: "http://api_devs.wanxikeji.cn/api/admin/goodsTypeList",
    method: "post",
    data: {
      token: localStorage.getItem("AccessToken"),
    },
  })
  .then((res) => {
    let list = res.data.data;
    // 一级分类
    list.forEach((item, index) => {
      if (item.parent_id === 0) {
        let tempItem = item;
        tempItem.value = index + 1;
        tempItem.label = item.type_name;
        selectOptions.value.push(tempItem);
      }
    });
    // 二级分类
    selectOptions.value.forEach((item1) => {
      item1.children = [];
      list.forEach((item2, index) => {
        if (item2.parent_id === item1.good_type_id) {
          let tempItem = item2;
          tempItem.value = item1.value * 10 + index + 1;
          tempItem.label = item2.type_name;
          item1.children.push(tempItem);
        }
      });
    });
    // 三级分类
    selectOptions.value.forEach((item1) => {
      item1.children.forEach((item2) => {
        item2.children = [];
        list.forEach((item3, index) => {
          if (item3.parent_id === item2.good_type_id) {
            let tempItem = item3;
            tempItem.value = item2.value * 10 + index + 1;
            tempItem.label = item3.type_name;
            item2.children.push(tempItem);
          }
        });
      });
    });
  });

onMounted(() => {});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
<style scoped>
@import "@/assets/css/reset.css";
@import "@/assets/css/pageHeader.css";

.el-tabs__item {
  margin: 0 100px !important;
}
.el-tabs__item {
  width: 88px;
  /* height: 45px; */
  margin-right: 32px !important;
  padding: 12px 16px;

  background-color: red !important;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-tab-pane {
  max-width: 1000px;
  margin-right: 32px;
  padding: 12px 16px;
}
.el-form-item {
  min-height: 40px;
  margin-bottom: 18px;
}
.input-box {
  width: 634px;
}
span.action {
  font-size: 12px;
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
.img-note {
  width: 1000px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}
.ship-template {
  width: 263px;
  height: 30px;
}
.input-note {
  width: 1000px;
  font-size: 13px;
  color: #a1a1a1;
}
label.el-radio {
  margin-right: 16px;
}
.input-num {
  margin-right: 6px;
}
</style>
