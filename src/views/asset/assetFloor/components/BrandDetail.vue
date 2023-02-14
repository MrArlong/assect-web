<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="资产名称：" prop="name">
        <el-input v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="资产地址：">
        <el-input v-model="brand.address"></el-input>
      </el-form-item>
      <el-form-item label="所属区域：">
        <el-input v-model="brand.region"></el-input>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input v-model="brand.lxr"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：">
        <el-input v-model="brand.lxdh"></el-input>
      </el-form-item>
      <el-form-item label="使用状态：">
        <el-radio-group v-model="brand.syzt">
          <el-radio :label="'2'">出租</el-radio>
          <el-radio :label="'1'">建设中</el-radio>
          <el-radio :label="'0'">筹划中</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="展示状态：">
        <el-radio-group v-model="brand.zszt">
          <el-radio :label="'1'">上架</el-radio>
          <el-radio :label="'0'">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否完工：">
        <el-radio-group v-model="brand.isFinish">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="轮播图片：">
        <single-upload v-model="brand.lbtp"></single-upload>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="地图经纬度：">
        <el-input v-model="brand.longitudeAndLatitude"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createBrand, getBrand, updateBrand} from '@/api/assetFloot'
  import SingleUpload from '@/components/Upload/singleUpload'
  const defaultBrand={
    name: '',
    address:"",
    region:"",
    lxr:"",
    lxdh:"",
    syzt:"",
    zszt:"",
    isFinish:"",
    lbtp:"",
    sort: 0,
    longitudeAndLatitude:""
  };
  export default {
    name: 'BrandDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        brand:Object.assign({}, defaultBrand),
        rules: {
          name: [
            {required: true, message: '请输入资产名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          sort: [
            {type: 'number', message: '排序必须为数字'}
          ],
        }
      }
    },
    created() {
      if (this.isEdit) {
        getBrand(this.$route.query.id).then(response => {
          this.brand = response.data;
        });
      }else{
        this.brand = Object.assign({},defaultBrand);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateBrand(this.$route.query.id, this.brand).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createBrand(this.brand).then(response => {
                  this.$refs[formName].resetFields();
                  this.brand = Object.assign({},defaultBrand);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.brand = Object.assign({},defaultBrand);
      }
    }
  }
</script>
<style>
</style>


