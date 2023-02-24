<template>
  <div class="detail-container">
    <el-card shadow="never" style="margin-top: 15px">
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
          <el-col :span="4" class="table-cell">{{ order.orderNum }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.zlr }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.zlrlxdh }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.zfsj }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.zffs }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.czr }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">租赁信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="orderRoom"
        style="width: 100%;margin-top: 20px"
        border
      >
        <el-table-column label="资产名称" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.floorName }}
          </template>
        </el-table-column>
        <el-table-column label="楼层" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.floorNum }}
          </template>
        </el-table-column>
        <el-table-column label="房间号" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.roomNum }}
          </template>
        </el-table-column>
        <el-table-column label="租赁开始时间" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.beginTime }}
          </template>
        </el-table-column>
        <el-table-column label="租赁结束时间" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="单价" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.unitprice }}
          </template>
        </el-table-column>
        <el-table-column label="总价" width="190" align="center">
          <template slot-scope="scope">
            {{ scope.row.price }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{ order.zje }}</span>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getOrderDetail, getOrderRoomDetail, updateReceiverInfo, updateMoneyInfo, closeOrder, updateOrderNote, deleteOrder } from '@/api/assetOrder'
import { formatDate } from '@/utils/date'
const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null
}
export default {
  name: 'OrderDetail',
  components: { },
  filters: {
    formatNull(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else {
        return value
      }
    },
    formatAddress(order) {
      let str = order.receiverProvince
      if (order.receiverCity != null) {
        str += '  ' + order.receiverCity
      }
      str += '  ' + order.receiverRegion
      str += '  ' + order.receiverDetailAddress
      return str
    },

    formatProductAttr(value) {
      if (value == null) {
        return ''
      } else {
        const attr = JSON.parse(value)
        let result = ''
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key
          result += ':'
          result += attr[i].value
          result += ';'
        }
        return result
      }
    }
  },
  data() {
    return {
      id: null,
      order: {},
      orderRoom: [],
      receiverDialogVisible: false,
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyDialogVisible: false,
      moneyInfo: { orderId: null, freightAmount: 0, discountAmount: 0, status: null },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      logisticsDialogVisible: false
    }
  },
  created() {
    this.id = this.list = this.$route.query.id
    getOrderDetail(this.id).then(response => {
      this.order = response.data
      getOrderRoomDetail(this.id).then(res => {
        this.orderRoom = res.data
      })
    })
  },
  methods: {
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

