<template>
  <div class="detail-container">
    <el-card shadow="never" style="margin-top: 15px">
      <el-form ref="order" :model="order" label-width="500px">
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266" />
          <span class="font-small">基本信息</span>
        </div>
        <div class="table-layout">
          <el-row>
            <el-col :span="4" class="table-cell-title">订单编号</el-col>
            <el-col :span="4" class="table-cell-title">租赁人</el-col>
            <el-col :span="4" class="table-cell-title">手机号码</el-col>
            <el-col :span="4" class="table-cell-title">支付时间</el-col>
            <el-col :span="4" class="table-cell-title">支付方式</el-col>
            <el-col :span="4" class="table-cell-title">操作人</el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="table-cell">
              <el-input v-show="false" v-model="order.orderNum" :rules=" [{ required: true, message: '请选择资产', trigger: 'blur' }]" />
              {{ order.orderNum }}
            </el-col>
            <el-col :span="4" class="table-cell">
              <el-input v-model="order.zlr" />
            </el-col>
            <el-col :span="4" class="table-cell">
              <el-input v-model="order.zlrlxdh" />
            </el-col>
            <el-col :span="4" class="table-cell">
              <el-date-picker
                v-model="order.zfsj"
                style="width:150px"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-col>
            <el-col :span="4" class="table-cell">
              <el-input v-model="order.zffs" />
            </el-col>
            <el-col :span="4" class="table-cell">
              <el-input v-model="order.czr" />
            </el-col>
          </el-row>
        </div>

        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266" />
          <span class="font-small">租赁信息</span>
          <el-button style="float:right" class="btn-add" size="mini" @click="handleAddOrderRoom()">
            添加
          </el-button>
        </div>
        <!--添加租赁信息弹窗开始-->
        <el-dialog
          :visible.sync="orderRoomDialog"
          :close-on-click-modal="false"
          title="添加租赁信息"
          append-to-body
          width="573px"
          @close="resetForm('form3'), (orderRoomDialog = false)"
        >
          <el-form
            ref="form3"
            :model="order_orderRoom"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="资产名称："
              :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
              prop="floorId"
            >
              <el-select v-model="order_orderRoom.floorId" filterable placeholder="请选择" @change="getLcList">
                <el-option
                  v-for="item in floorList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="楼层："
              :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
              prop="floor"
            >
              <el-select v-model="order_orderRoom.floor" filterable placeholder="请选择" @change="getFjList">
                <el-option
                  v-for="item in lcList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="房间号："
              :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
              prop="roomId"
            >
              <el-select v-model="order_orderRoom.roomId" filterable placeholder="请选择" @change="fjSet">
                <el-option
                  v-for="item in fjList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="租赁开始时间："
              :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
              prop="beginTime"
            >
              <el-date-picker
                v-model="order_orderRoom.beginTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              label="租赁结束时间："
              :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
              prop="endTime"
            >
              <el-date-picker
                v-model="order_orderRoom.endTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              label="价格："
              :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
              prop="price"
            >
              <el-input v-model="order_orderRoom.price" />
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              size="small"
              plain
              @click="resetForm('form3'), (orderRoomDialog = false)"
            >取消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="saveOrderRoom"
            >确认</el-button>
          </div>
        </el-dialog>
        <!--添加租赁信息弹窗结束-->

        <el-table
          ref="orderItemTable"
          :data="order.orderRoom"
          style="width: 100%;margin-top: 20px"
          border
        >
          <el-table-column label="资产名称" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.floorName }}
            </template>
          </el-table-column>
          <el-table-column label="楼层" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.floor }}
            </template>
          </el-table-column>
          <el-table-column label="房间号" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.roomNum }}
            </template>
          </el-table-column>
          <el-table-column label="租赁开始时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.beginTime }}
            </template>
          </el-table-column>
          <el-table-column label="租赁结束时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column label="单价" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" align="center">
            <template slot-scope="{scope,$index}">
              <el-link
                type="danger"
                :underline="false"
                class="vxe-table-operation-btn"
                @click="delBtn($index)"
              >
                <i class="el-icon-delete" />
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <div style="float: right;margin: 20px">
          合计：<span class="color-danger">￥{{ order.zje }}</span>
        </div>
        <el-form-item>
          <el-button style="margin-top: 100px;align:center;" type="primary" @click="onSubmit('order')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import {
  getOrderDetail,
  updateReceiverInfo,
  updateMoneyInfo,
  closeOrder,
  updateOrderNote,
  deleteOrder,
  getOrderNum
} from '@/api/assetOrder'
import { formatDate } from '@/utils/date'
import { getAssetFjList, getAssetFloorList, getAssetLcList } from '@/api/assetRoom'
import { createOrder } from '@/api/assetOrder'
const defaultOrder = {
  orderNum: null,
  orderType: null,
  czr: null,
  czrlxdh: null,
  zlr: null,
  zlrlxdh: null,
  zfsj: null,
  zffs: null,
  zje: 0,
  orderRoom: []
}
export default {
  name: 'OrderDetail',
  components: { },
  filters: { },
  data() {
    return {
      order: Object.assign({}, defaultOrder),
      order_orderRoom: {
        floorId: '',
        floorName: '',
        floor: '',
        roomId: '',
        roomNum: '',
        beginTime: '',
        endTime: '',
        price: 0
      },
      id: null,
      receiverDialogVisible: false,
      moneyDialogVisible: false,
      moneyInfo: { orderId: null, freightAmount: 0, discountAmount: 0, status: null },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markInfo: { note: null },
      orderRoomDialog: false,
      floorList: [],
      lcList: [],
      fjList: []
    }
  },
  created() {
    this.order.orderRoom = []
    this.getFloorList()
    this.getLcList()
    this.getFjList()
    this.getOrderNum()
  },
  methods: {
    fjSet(roomId) {
      const fj = this.fjList.find((item) => item.value === roomId)

      this.order_orderRoom.roomNum = fj.label
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            createOrder(this.order).then(response => {
              this.$refs[formName].resetFields()
              this.order = Object.assign({}, defaultOrder)
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 1000
              })
              this.$router.back()
            //  this.$router.push({ path: '/asset/orderForm' })
            })
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
    delBtn(rowIndex) {
      this.order.zje = ((this.order.zje * 100 - this.order.orderRoom[rowIndex].price * 100) / 100).toFixed(3)
      this.$delete(this.order.orderRoom, rowIndex)
    },
    saveOrderRoom() {
      this.$refs.form3.validate(async(valid) => {
        if (valid) {
          this.order.orderRoom.push(
            {
              floorName: this.order_orderRoom.floorName,
              floorId: this.order_orderRoom.floorId,
              floor: this.order_orderRoom.floor,
              roomNum: this.order_orderRoom.roomNum,
              roomId: this.order_orderRoom.roomId,
              beginTime: this.order_orderRoom.beginTime,
              endTime: this.order_orderRoom.endTime,
              price: this.order_orderRoom.price
            }
          )
          this.orderRoomDialog = false

          this.order.zje = ((this.order.zje * 100 + this.order_orderRoom.price * 100) / 100).toFixed(3)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查询资产
    getFloorList() {
      this.floorList = []
      getAssetFloorList().then(res => {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          this.floorList.push({ label: list[i].name, value: list[i].id })
        }
      })
    },
    // 查询楼层
    getLcList() {
      this.lcList = []
      this.fjList = []
      this.order_orderRoom.floor = ''
      this.order_orderRoom.roomId = ''
      const floorId = this.order_orderRoom.floorId
      if (floorId) {
        const zc = this.floorList.find((item) => item.value === floorId)
        this.order_orderRoom.floorName = zc.label
      }

      const params = new URLSearchParams()
      params.append('floorId', floorId)
      getAssetLcList(params).then(res => {
        this.lcList = res.data
      })
    },
    // 查询房间
    getFjList() {
      this.fjList = []
      this.order_orderRoom.roomId = ''
      const floorId = this.order_orderRoom.floorId
      const floor = this.order_orderRoom.floor
      const params = new URLSearchParams()
      params.append('floorId', floorId)
      params.append('floor', floor)
      getAssetFjList(params).then(res => {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          this.fjList.push({ label: list[i].roomNum, value: list[i].id })
        }
      })
    },
    getOrderNum() {
      getOrderNum().then(res => {
        this.order.orderNum = res.data
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAddOrderRoom() {
      this.orderRoomDialog = true
    },
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value
      this.receiverInfo.receiverCity = data.city.value
      this.receiverInfo.receiverRegion = data.area.value
    },
    formatTime(time) {
      if (time == null || time === '') {
        return ''
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatStepStatus(value) {
      if (value === 1) {
        // 待发货
        return 2
      } else if (value === 2) {
        // 已发货
        return 3
      } else if (value === 3) {
        // 已完成
        return 4
      } else {
        // 待付款、已关闭、无限订单
        return 1
      }
    },
    showUpdateReceiverDialog() {
      this.receiverDialogVisible = true
      this.receiverInfo = {
        orderId: this.order.id,
        receiverName: this.order.receiverName,
        receiverPhone: this.order.receiverPhone,
        receiverPostCode: this.order.receiverPostCode,
        receiverDetailAddress: this.order.receiverDetailAddress,
        receiverProvince: this.order.receiverProvince,
        receiverCity: this.order.receiverCity,
        receiverRegion: this.order.receiverRegion,
        status: this.order.status
      }
    },
    handleUpdateReceiverInfo() {
      this.$confirm('是否要修改收货信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateReceiverInfo(this.receiverInfo).then(response => {
          this.receiverDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data
          })
        })
      })
    },
    showUpdateMoneyDialog() {
      this.moneyDialogVisible = true
      this.moneyInfo.orderId = this.order.id
      this.moneyInfo.freightAmount = this.order.freightAmount
      this.moneyInfo.discountAmount = this.order.discountAmount
      this.moneyInfo.status = this.order.status
    },
    handleUpdateMoneyInfo() {
      this.$confirm('是否要修改费用信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateMoneyInfo(this.moneyInfo).then(response => {
          this.moneyDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data
          })
        })
      })
    },
    showMessageDialog() {
      this.messageDialogVisible = true
      this.message.title = null
      this.message.content = null
    },
    handleSendMessage() {
      this.$confirm('是否要发送站内信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messageDialogVisible = false
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
      })
    },
    showCloseOrderDialog() {
      this.closeDialogVisible = true
      this.closeInfo.note = null
      this.closeInfo.id = this.id
    },
    handleCloseOrder() {
      this.$confirm('是否要关闭?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('ids', [this.closeInfo.id])
        params.append('note', this.closeInfo.note)
        closeOrder(params).then(response => {
          this.closeDialogVisible = false
          this.$message({
            type: 'success',
            message: '订单关闭成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data
          })
        })
      })
    },
    showMarkOrderDialog() {
      this.markOrderDialogVisible = true
      this.markInfo.id = this.id
      this.closeOrder.note = null
    },
    handleMarkOrder() {
      this.$confirm('是否要备注订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('id', this.markInfo.id)
        params.append('note', this.markInfo.note)
        params.append('status', this.order.status)
        updateOrderNote(params).then(response => {
          this.markOrderDialogVisible = false
          this.$message({
            type: 'success',
            message: '订单备注成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data
          })
        })
      })
    },
    handleDeleteOrder() {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('ids', [this.id])
        deleteOrder(params).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        })
      })
    },
    showLogisticsDialog() {
      this.logisticsDialogVisible = true
    }
  }
}
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>

