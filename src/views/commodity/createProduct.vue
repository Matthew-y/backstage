<template>
  <el-container class="full-page">
    <div class="list-box">
      <div class="title">{{ pageTitle }}</div>
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
                node-key="value"
                :default-checked-keys="formBasic.classification"
                :default-expanded-keys="formBasic.classification"
              />
              <div style="width: 1000px"><span class="action" @click="addClass">去新增</span><span class="action">刷新</span></div>
            </el-form-item>

            <el-form-item prop="imgs" label="商品图片:" required>
              <el-upload
                class="avatar-uploader"
                v-model:file-list="formBasic.imgs"
                action="http://api_devss.wanxikeji.cn/api/savePic"
                list-type="picture-card"
                name="img"
                :on-preview="handlePicPreview"
                :on-remove="handlePicRemove"
                :on-success="handleUploadSuccess"
              >
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="img-note">建议尺寸：750*750像素, 最多上传10张, 可拖拽图片调整顺序, 第1张将作为商品首图</div>
            </el-form-item>

            <el-form-item prop="code" label="商品编码:">
              <el-input class="input-box" v-model="formBasic.code" placeholder="请输入商品编码"></el-input>
            </el-form-item>

            <el-form-item prop="template" label="运费模板:" required>
              <el-tree-select
                class="ship-template"
                :data="shipTemplate"
                v-model="formBasic.template"
                node-key="value"
                placeholder="请选择运费模板"
              >
              </el-tree-select>
              <div style="width: 1000px"><span class="action">新增模板</span><span class="action">刷新</span></div>
            </el-form-item>

            <el-form-item prop="status" label="商品状态:" required>
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
              <el-button style="width: 64px" type="primary" @click="submitProductInfo">提交</el-button>
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

            <el-form-item v-if="formSpecsStorage.specs == '1'" label="商品价格:" required :show-message="false">
              <el-input-number
                style="width: 88px"
                controls-position="right"
                :min="0.01"
                class="input-num"
                v-model="formSpecsStorage.price"
              />元
              <div class="input-note">商品的实际购买金额，最低0.01</div>
            </el-form-item>

            <el-form-item v-if="formSpecsStorage.specs == '1'" label="划线价:">
              <el-input-number style="width: 88px" controls-position="right" class="input-num" v-model="formSpecsStorage.displayPrice" />元
              <div class="input-note">划线价仅用于商品页展示</div>
            </el-form-item>

            <el-form-item v-if="formSpecsStorage.specs == '1'" label="当前库存数量:" required :show-message="false">
              <el-input-number style="width: 88px" controls-position="right" class="input-num" v-model="formSpecsStorage.storage" />件
              <div class="input-note">商品的实际库存数量，为0时用户无法下单</div>
            </el-form-item>

            <el-form-item v-if="formSpecsStorage.specs == '1'" label="商品重量:" required :show-message="false">
              <el-input-number style="width: 88px" controls-position="right" class="input-num" v-model="formSpecsStorage.weight" />千克(Kg)
              <div class="input-note">商品的实际重量，用于计算运费</div>
            </el-form-item>

            <el-form-item v-else label="商品规格:">
              <div class="input-note">最多添加3个商品规格组，生成的SKU数量不能超出50个</div>
              <div class="specs-group" v-for="(item, index1) in specsGroup" :key="index1">
                <div class="head">
                  <el-input v-model="item.title" placeholder="请输入规格名称"></el-input>
                  <span class="action" @click="deleteSpecsGroup(index1)">删除规格组</span>
                </div>
                <div class="box">
                  <el-input v-for="(items, index2) in item.value" v-model="item.value[index2]" placeholder="请输入规格值"></el-input>
                  <span class="action" @click="generateSpecsValue(index1)">新增规格值</span>
                  <span class="action" @click="deleteSpecsValue(index1)">删除规格值</span>
                </div>
              </div>
              <el-button class="add-specs-group" @click="generateSpecsGroup"
                ><el-icon><Plus /></el-icon>添加规格组</el-button
              >
            </el-form-item>
            <!-- TODO -->
            <el-form-item v-if="formSpecsStorage.specs == '2' && specsGroup[0]" label="SKU列表:">
              <el-table :data="specsTableData" :span-method="objectSpanMethod" border style="margin-top: 20px">
                <el-table-column v-for="(item, index) in specsGroup" :key="index" :label="item.title">
                  <template #default="scope">
                    {{ scope.row.sku[index] }}
                  </template>
                </el-table-column>
                <el-table-column prop="img" label="预览图">
                  <template #default="scope">
                    <el-upload
                      class="table-uploader"
                      name="img"
                      :show-file-list="false"
                      action="http://api_devss.wanxikeji.cn/api/savePic"
                      :on-success="
                        (res, file) => {
                          handleTableUploadSuccess(res, file, scope);
                        }
                      "
                    >
                      <img width="50" v-if="scope.row.img" :src="scope.row.img" alt="fail" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column width="127px" height="75px" prop="price" label="商品价格">
                  <template #default="scope">
                    <el-input-number
                      class="table-num"
                      v-model="scope.row.price"
                      :controls="true"
                      controls-position="right"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column width="127px" height="75px" label="划线价格">
                  <template #default="scope">
                    <el-input-number
                      class="table-num"
                      v-model="scope.row.displayPrice"
                      :controls="true"
                      controls-position="right"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column width="127px" height="75px" label="库存数量">
                  <template #default="scope">
                    <el-input-number
                      class="table-num"
                      v-model="scope.row.storage"
                      :controls="true"
                      controls-position="right"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column width="127px" height="75px" label="商品重量(KG)">
                  <template #default="scope">
                    <el-input-number
                      class="table-num"
                      v-model="scope.row.weight"
                      :controls="true"
                      controls-position="right"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column width="127px" height="75px" label="SKU编码">
                  <template #default="scope">
                    <el-input-number
                      class="table-num"
                      v-model="scope.row.skuCode"
                      :controls="true"
                      controls-position="right"
                    ></el-input-number>
                  </template>
                </el-table-column>
              </el-table>
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
              <el-button style="width: 64px" type="primary" @click="submitProductInfo">提交</el-button>
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
              <el-button style="width: 64px" type="primary" @click="submitProductInfo">提交</el-button>
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
              <el-button style="width: 64px" type="primary" @click="submitProductInfo">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-container>
</template>
<script setup>
import { getCurrentInstance, ref, shallowRef, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Plus } from "@element-plus/icons-vue";
import "@wangeditor/editor/dist/css/style.css";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const store = useStore();
let pageTitle = ref("创建商品");
let editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const toolbarConfig = {}; // 菜单栏配置
const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} }; // 编辑器配置
// 自定义上传图片
editorConfig.MENU_CONF["uploadImage"] = {
  async customUpload(file, insertFn) {
    let form = new FormData();
    form.append("img", file);
    // proxy.$axios.post('http://api_devs.wanxikeji.cn/api/savePic', { form }).then(res => {
    //   let url = 'http://api_devs.wanxikeji.cn/' + res.data.data;
    //   insertFn(url, 'fail', 'href')
    // })
    proxy.$axios({ url: "http://api_devss.wanxikeji.cn/api/savePic", method: "post", data: form }).then((res) => {
      console.log(`savePic:${res}`);
      let url = "http://api_devss.wanxikeji.cn/" + res.data.data;
      insertFn(url, "fail", "href");
    });
  },
};

let activeTab = ref("basicInfo"); // 选中标签页
let selectValue = ref(); // 商品分类选择
let specsGroup = ref([]); // 商品规格组
let specsTableData = ref([]);
let form1 = ref();
let form2 = ref();
let form3 = ref();
let form4 = ref();
let imgList = ref([]); // 图片文件列表
// 校验规则
let rules = {
  name: [{ validator: validateName }], //商品名称
  classification: [{ validator: validateClass }], // 商品分类
  imgs: [{ validator: validateImg }], // 商品图片
  template: [{ validator: validateTemplate }], // 运费模板
  status: [{ message: "", trigger: "blur" }],
  details: [{ validator: validateArticle }], // 富文本内容
};
// 基本信息表单
let formBasic = ref({
  name: "",
  classification: [],
  imgs: [],
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
  storageCalc: "1",
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

watch(
  () => specsGroup.value,
  (newVal) => {
    generateSkuList();
  },
  { deep: true }
);

function generateSkuList() {
  specsTableData.value = [];
  let temp = [];
  specsGroup.value.forEach((item, index) => {
    if (index === 0) {
      temp = item.value;
    } else {
      let arr = [];
      temp.forEach((item1) => {
        item.value.forEach((item2) => {
          arr.push(`${item1}&${item2}`);
        });
      });
      temp = arr;
    }
  });
  // console.log(temp);
  temp.forEach((item) => {
    specsTableData.value.push({
      sku: item.split("&"),
      img: [],
      price: null,
      diaplayPrice: null,
      storage: null,
      weight: null,
      skuCode: null,
    });
  });
}
// sku表格行合并
function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
  let valOneLen = specsGroup.value[0].value.length;
  let skuLen = specsTableData.value.length;
  if (columnIndex === 0) {
    if (rowIndex % (skuLen / valOneLen) === 0) {
      return {
        rowspan: skuLen / valOneLen,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
}

function handlePicRemove(uploadFile, uploadFiles) {
  console.log(uploadFile);
  console.log(uploadFiles);
}
function handlePicPreview(uploadFile) {
  console.log("预览图片", uploadFile);
}
// 添加图片执行函数
function handleUploadSuccess(res, uploadFile) {
  console.log(res);
}
function handleTableUploadSuccess(res, file, scope) {
  scope.row.img = "http://api_devss.wanxikeji.cn/" + res.data;
}
// 编辑器创建后
function handleCreated(editor) {
  editorRef.value = editor; // 记录 editor 实例，重要！
}
// 校验商品名称
function validateName(rule, value, callback) {
  value.length < 2 ? callback(new Error("请输入至少2个字符")) : callback();
}
// 校验商品分类
function validateClass(rule, value, callback) {
  !value ? callback(new Error("请至少选择1个商品分类")) : callback();
}
// 校验图片
function validateImg(rule, value, callback) {
  !value ? callback(new Error("请至少上传1张商品图片")) : callback();
}
// 校验运费模板
function validateTemplate(rule, value, callback) {
  !value ? callback(new Error("请选择运费模板")) : callback();
}
// 校验富文本
function validateArticle(rule, value, callback) {
  if (value === "<p><br></p>" || !value) {
    callback(new Error("商品详情不能为空"));
  } else {
    callback();
  }
}
// 生成产品规格组
function generateSpecsGroup() {
  specsGroup.value.push({ title: "", value: [""] });
}
// 新增规格值
function generateSpecsValue(index) {
  specsGroup.value[index].value.push("");
}
function deleteSpecsValue(index) {
  specsGroup.value[index].value.pop();
}
// 删除规格组
function deleteSpecsGroup(index) {
  specsGroup.value.splice(index, 1);
}
// 确认提交商品信息
function submitProductInfo() {
  // 录入商品分类信息
  // selectOptions.value.forEach((item) => {
  //   selectValue.value.forEach((subItem) => {
  //     if (item.value === subItem) {
  //       formBasic.value.type.push(item.label);
  //     }
  //   });
  // });

  form1.value.validate((valid) => {
    if (!valid) {
      activeTab.value = "basicInfo";
    } else {
      form3.value.validate((valid) => {
        if (!valid) {
          activeTab.value = "detail";
        } else {
          ElMessage({
            message: formDetails.value.details,
            type: "info",
          });
          // return;
          // 提交商品信息
          let imgArr;
          if (formBasic.value.imgs[0].url) {
            imgArr = formBasic.value.imgs.map((item) => {
              return item.response ? "http://api_devss.wanxikeji.cn/" + item.response.data : item.url;
            });
          } else {
            imgArr = formBasic.value.imgs;
          }
          let theId = proxy.$route.query.id;
          proxy.$axios
            .post("http://api_devs.wanxikeji.cn/api/admin/addModifyGood", {
              token: localStorage.getItem("AccessToken"),
              good_name: formBasic.value.name,
              type_id: formBasic.value.classification[0],
              price: formSpecsStorage.value.price,
              img: imgArr[0],
              imgs: imgArr[0],
              info: formDetails.value.details,
              colour: {},
              edition: {},
              type_parent_id: formBasic.value.classification[0],
              good_id: theId,
            })
            .then((res) => {
              ElMessage({
                message: res.data.msg,
                type: "success",
              });
              if (res.data.msg === "修改成功" || res.data.msg === "添加成功") {
                proxy.$router.push("/index/commodity/list?itemIndex=3&subItemIndex=0");
              }
            });
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
        tempItem.value = item.good_type_id;
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
          tempItem.value = item2.good_type_id;
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
            tempItem.value = item3.good_type_id;
            tempItem.label = item3.type_name;
            item2.children.push(tempItem);
          }
        });
      });
    });
  });

onMounted(() => {
  generateSkuList();
  if (proxy.$route.query.id) {
    pageTitle.value = "编辑商品";
    proxy.$axios
      .post("http://api_devs.wanxikeji.cn/api/admin/goodInfo", {
        token: localStorage.getItem("AccessToken"),
        good_id: proxy.$route.query.id,
      })
      .then((res) => {
        let editInfo = res.data.data;
        // // 将数据添加到页面
        formBasic.value.name = editInfo.good_name;
        formBasic.value.classification = [editInfo.type_id];
        formBasic.value.imgs = [{ url: editInfo.img }];
        formBasic.value.template = 1;
        formBasic.value.status = String(editInfo.status);
        formSpecsStorage.value.price = editInfo.price;
        formSpecsStorage.value.displayPrice = editInfo.promotion_price;
        formDetails.value.details = JSON.parse(editInfo.info[0].info);
      });
  }
});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
<style lang="scss" scoped>
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
  .table-uploader {
    width: 50px;
    height: 50px;
    border: 1px dashed lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .specs-group {
    width: 895px;
    margin-bottom: 20px;
    .head {
      height: 42px;
      padding: 7px 12px;
      display: flex;
      justify-content: space-between;
      background-color: #f4f5f9;
    }
    .box {
      padding: 8px 35px;
      background-color: #fbfbfb;
      .close-input {
        width: 14px !important;
        height: 14px !important;
        border-radius: 50%;
        color: #fff;
        background-color: #7d7d7d;
      }
    }
    .el-input {
      width: 180px;
      height: 28px;
      margin-right: 20px;
    }
  }
  .table-num {
    width: 88px;
    height: 26px;
  }
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
  border-radius: 10px;
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
  text-align: center;
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
.add-specs-group {
  width: 115px;
  height: 32px;
  border: 1px solid #d9d9d9;
  .el-icon {
    margin-right: 4px;
  }
}
</style>
