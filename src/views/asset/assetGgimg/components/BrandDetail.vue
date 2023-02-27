<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="brandFrom" :model="brand" label-width="150px">
      <el-form-item label="名称：" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
        <el-input v-model="brand.name" />
      </el-form-item>
      <el-form-item label="地址：" prop="address" :rules="[{ required: true, message: '请输入地址', trigger: 'blur' }]">
        <el-input v-model="brand.address" />
      </el-form-item>

      <el-form-item label="展示状态：" prop="address" :rules="[{ required: true, message: '请输入展示状态', trigger: 'blur' }]">
        <el-radio-group v-model="brand.zszt">
          <el-radio :label="'1'">上架</el-radio>
          <el-radio :label="'0'">下架</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="首页轮播图片：">
        <single-upload-list v-model="brand.hometp" />
      </el-form-item>
      <el-form-item label="广告轮播图片：">
        <single-upload-list v-model="brand.lbtp" />
      </el-form-item>
      <el-form-item label="简介：">
        <el-input
          v-model="brand.remark"
          :auto-size="true"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <iframe
        id="mapPage"
        width="100%"
        height="800px"
        frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=6FNBZ-A2PLX-2O24F-ZK666-5ZSRT-POBLJ
&referer=myapp"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mapsValue">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import { createGgBrand, getGgimgBrand, updateGgimgBrand } from '@/api/assetFloot'
import singleUploadList from '@/components/Upload/singleUploadList'
const defaultBrand = {
  name: '',
  address: '',
  zszt: '',
  lbtp: '',
  hometp: '',
  remark: ''
}

window.addEventListener('message', function(event) {
  var loc = event.data
  if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
    localStorage.setItem('longitude', loc.latlng.lng)
    localStorage.setItem('latitude', loc.latlng.lat)
    console.log(loc)
  }
}, false)
export default {
  name: 'BrandDetail',
  components: { singleUploadList },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      brand: Object.assign({}, defaultBrand),
      dialogVisible: false
    }
  },
  created() {
    if (this.isEdit) {
      getGgimgBrand(this.$route.query.id).then(response => {
        this.brand = response.data
      })
    } else {
      this.brand = Object.assign({}, defaultBrand)
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
              updateGgimgBrand(this.$route.query.id, this.brand).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              createGgBrand(this.brand).then(response => {
                this.$refs[formName].resetFields()
                this.brand = Object.assign({}, defaultBrand)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.push({ path: '/asset/assetGgimg' })
              })
            }
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.brand = Object.assign({}, defaultBrand)
    },

    // 打开腾讯地图
    openTencentMaps() {
      this.dialogVisible = true
    },
    mapsValue() {
      this.dialogVisible = false
      if (localStorage.getItem('longitude')) {
        this.brand.longitude = localStorage.getItem('longitude')
        localStorage.removeItem('longitude')
      }
      if (localStorage.getItem('latitude')) {
        this.brand.latitude = localStorage.getItem('latitude')
        localStorage.removeItem('latitude')
      }
    }

  }
}
</script>
<style>
</style>

