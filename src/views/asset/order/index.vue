<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList()"
        >
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch()"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderNum" class="input-width" placeholder="订单编号" />
          </el-form-item>
          <el-form-item label="租赁人：">
            <el-input v-model="listQuery.zlr" class="input-width" placeholder="租赁人" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button
        class="btn-add"
        size="mini"
        @click="handleAddProduct()"
      >
        添加
      </el-button>
      <el-button
        class="btn-add"
        style="margin-right: 10px"
        size="mini"
        @click="downloadExcel1()"
      >
        导出订单
      </el-button>
      <el-button
        class="btn-add"
        style="margin-right: 10px"
        size="mini"
        @click="importExcel()"
      >
        导入订单
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />

        <el-table-column label="订单编号" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="租赁人" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.zlr }}</template>
        </el-table-column>
        <el-table-column label="租赁人联系电话" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.zlrlxdh }}</template>
        </el-table-column>
        <el-table-column label="支付时间" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.zfsj }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.zffs }}</template>
        </el-table-column>
        <el-table-column label="总金额" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.zje }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑订单</el-button>
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              size="mini"
              @click="handleDeleteOrder(scope.$index, scope.row)"
            >删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- bpmn20.xml导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="500px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx"
        :action="upload.url"
        :headers="upload.headers"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileUploadError"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip" style="color: red">
          提示：仅允许导入“.xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, closeOrder, deleteOrder, downloadExcel } from '@/api/assetOrder'
import { formatDate } from '@/utils/date'
import { getToken } from '@/utils/auth'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderNum: null,
  zlr: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null
}
export default {
  name: 'OrderList',
  components: { },
  filters: {
    formatCreateTime(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.BASE_API + '/assetorder/importExcel'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileUploadError(event, file, fileList) {
      this.upload.isUploading = false
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$message(response.message)
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    importExcel() {
      this.upload.title = '订单文件导入'
      this.upload.name = null
      this.upload.category = null
      this.upload.open = true
    },
    downloadExcel1() {
      this.$message({
        message: '正在导出请稍后！',
        type: 'success',
        duration: 5000
      })
      downloadExcel(this.listQuery).then(res => {
        const blob = new Blob([res])
        const url = window.URL.createObjectURL(blob)
        const dom = document.createElement('a')
        dom.style.display = 'none'
        dom.href = url
        dom.setAttribute('download', '订单数据' + new Date().getTime() + '.' + 'xlsx')
        document.body.appendChild(dom)
        dom.click()
      }).catch(err => {
        console.log(err)
      })
    },
    handleUpdate(index, row) {
      this.$router.push({ path: '/asset/updateOrder', query: { id: row.id }})
    },
    handleAddProduct() {
      this.$router.push({ path: '/asset/orderFormAdd' })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleViewOrder(index, row) {
      this.$router.push({ path: '/asset/orderFormDetail', query: { id: row.id }})
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true
      this.closeOrder.orderIds = [row.id]
    },
    handleDeliveryOrder(index, row) {
      const listItem = this.covertOrder(row)
      this.$router.push({ path: '/asset/deliverOrderList', query: { list: [listItem] }})
    },
    handleViewLogistics(index, row) {
    },
    handleDeleteOrder(index, row) {
      this.deleteOrder(row.id)
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的订单',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if (this.operateType === 1) {
        // 批量发货
        const list = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]))
          }
        }
        if (list.length === 0) {
          this.$message({
            message: '选中订单中没有可以发货的订单',
            type: 'warning',
            duration: 1000
          })
          return
        }
        this.$router.push({ path: '/oms/deliverOrderList', query: { list: list }})
      } else if (this.operateType === 2) {
        // 关闭订单
        this.closeOrder.orderIds = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id)
        }
        this.closeOrder.dialogVisible = true
      } else if (this.operateType === 3) {
        // 删除订单
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        this.deleteOrder(ids)
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === '') {
        this.$message({
          message: '操作备注不能为空',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const params = new URLSearchParams()
      params.append('ids', this.closeOrder.orderIds)
      params.append('note', this.closeOrder.content)
      closeOrder(params).then(response => {
        this.closeOrder.orderIds = []
        this.closeOrder.dialogVisible = false
        this.getList()
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    deleteOrder(ids) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('orderId', ids)
        deleteOrder(params).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    },
    covertOrder(order) {
      const address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress
      const listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null
      }
      return listItem
    }
  }
}
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>

