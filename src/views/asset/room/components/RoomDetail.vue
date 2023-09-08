<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="roomFrom" :model="room" label-width="150px">
      <el-form-item label="绑定资产：" :rules=" [{ required: true, message: '请选择资产', trigger: 'blur' }]">

        <el-select v-model="room.floorId" placeholder="请选择">
          <el-option
            v-for="item in floorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="楼层号：">
        <el-input v-model="room.floorNum" />
      </el-form-item>
      <el-form-item label="房间号">
        <el-input v-model="room.roomNum" />
      </el-form-item>
      <el-form-item label="面积：">
        <el-input v-model="room.acreage" />
      </el-form-item>
      <el-form-item label="装修：">
        <el-input v-model="room.decorationType" />
      </el-form-item>
      <el-form-item label="价格：">
        <el-input v-model="room.price" type="number" />
      </el-form-item>
      <el-form-item label="是否已租：">
        <el-radio-group v-model="room.isOccupancy">
          <el-radio :label="'1'">已租</el-radio>
          <el-radio :label="'0'">未租</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="房间简介：">
        <el-input
          v-model="room.description"
          :auto-size="true"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="展示状态：">
        <el-radio-group v-model="room.zszt">
          <el-radio :label="'1'">上架</el-radio>
          <el-radio :label="'0'">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：" prop="sort" :rules="[{type: 'number', message: '排序必须为数字'}]">
        <el-input v-model.number="room.sort" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('roomFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('roomFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createBrand, getAssetFloorList, getBrand, updateBrand } from '@/api/assetRoom'
// import SingleUpload from '@/components/Upload/singleUpload'
const defaultBrand = {
  floorId: '',
  roomNum: '',
  floorNum: '',
  acreage: '',
  decorationType: '',
  price: '',
  isOccupancy: '',
  description: '',
  zszt: '',
  sort: null

}
export default {
  name: 'BrandDetail',
  components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      room: Object.assign({}, defaultBrand),
      dialogVisible: false,
      floorList: [],
      floorId: null
    }
  },
  created() {
    this.getFloorList()
    if (this.isEdit) {
      getBrand(this.$route.query.id).then(response => {
        this.room = response.data
      })
    } else {
      this.room = Object.assign({}, defaultBrand)
    }
  },
  methods: {
    // 查询资产
    getFloorList() {
      getAssetFloorList().then(res => {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          this.floorList.push({ label: list[i].name, value: list[i].id })
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateBrand(this.$route.query.id, this.room).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              createBrand(this.room).then(response => {
                this.$refs[formName].resetFields()
                this.room = Object.assign({}, defaultBrand)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.push({ path: '/asset/room' })
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
      this.room = Object.assign({}, defaultBrand)
    }
  }
}
</script>
<style>
</style>

