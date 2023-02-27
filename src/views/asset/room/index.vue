<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          size="small"
          @click="handleSearchList()"
        >
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          size="small"
          @click="handleResetSearch()"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" style="width: 203px" placeholder="房间号" />
          </el-form-item>
          <el-form-item label="资产：">
            <el-select v-model="listQuery.floorId" clearable placeholder="请选择">
              <el-option
                v-for="item in floorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        导出房间
      </el-button>
      <el-button
        class="btn-add"
        style="margin-right: 10px"
        size="mini"
        @click="importExcel()"
      >
        导入房间
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column type="index" label="编号" width="100" align="center" />
        <el-table-column label="资产名称" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.floorName }}
          </template>
        </el-table-column>
        <el-table-column label="楼层" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.floorNum }}
          </template>
        </el-table-column>
        <el-table-column label="房间号" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.roomNum }}
          </template>
        </el-table-column>
        <el-table-column label="面积" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.acreage }}
          </template>
        </el-table-column>
        <el-table-column label="装修" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.decorationType }}
          </template>
        </el-table-column>
        <el-table-column label="价格" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="是否已租" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOccupancy"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="updateIsOy(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="展示状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.zszt"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="updateZszt(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
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
import { downloadExcel, fetchList, getAssetFloorList, updateIsOccupancy } from '@/api/assetRoom'
import { updateFactoryStatus, deleteBrand } from '@/api/assetRoom'
import { getToken } from '@/utils/auth'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  floorId: null
}
export default {
  name: 'ProductList',
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return '审核通过'
      } else {
        return '未审核'
      }
    }
  },
  data() {
    return {
      floorList: [],
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: '',
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null
      },
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
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
        url: process.env.BASE_API + '/room/importExcel'
      }
    }
  },
  watch: {
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length === 2) {
        this.listQuery.productCategoryId = newValue[1]
      } else {
        this.listQuery.productCategoryId = null
      }
    }
  },
  created() {
    this.getList()
    this.getFloorList()
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
      this.upload.title = '房间文件导入'
      this.upload.name = null
      this.upload.category = null
      this.upload.open = true
    },
    getFloorList() {
      getAssetFloorList().then(res => {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          this.floorList.push({ label: list[i].name, value: list[i].id })
        }
      })
    },
    updateZszt(index, row) {
      var data = new URLSearchParams()
      data.append('ids', row.id)
      data.append('zszt', row.zszt)
      updateFactoryStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      }).catch(error => {
        console.log(error)
        if (row.zszt === 0) {
          row.zszt = 1
        } else {
          row.zszt = 0
        }
      })
    },
    updateIsOy(index, row) {
      var data = new URLSearchParams()
      data.append('ids', row.id)
      data.append('isOccupancy', row.isOccupancy)
      updateIsOccupancy(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      }).catch(error => {
        console.log(error)
        if (row.isOccupancy === 0) {
          row.isOccupancy = 1
        } else {
          row.isOccupancy = 0
        }
      })
    },
    getProductSkuSp(row, index) {
      const spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleShowSkuEditDialog(index, row) {
      this.editSkuInfo.dialogVisible = true
      this.editSkuInfo.productId = row.id
      this.editSkuInfo.productSn = row.productSn
      this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId
      this.editSkuInfo.keyword = null
    },
    handleSearchEditSku() {

    },
    handleEditSkuConfirm() {
      if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.$confirm('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      })
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleAddProduct() {
      this.$router.push({ path: '/asset/addRoom' })
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
        dom.setAttribute('download', '房间数据' + new Date().getTime() + '.' + 'xlsx')
        document.body.appendChild(dom)
        dom.click()
      }).catch(err => {
        console.log(err)
      })
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: '请选择操作类型',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的商品',
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.$confirm('是否要进行该批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids)
            break
          case this.operates[1].value:
            this.updatePublishStatus(0, ids)
            break
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids)
            break
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids)
            break
          case this.operates[4].value:
            this.updateNewStatus(1, ids)
            break
          case this.operates[5].value:
            this.updateNewStatus(0, ids)
            break
          case this.operates[6].value:
            break
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids)
            break
          default:
            break
        }
        this.getList()
      })
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePublishStatusChange(index, row) {
      const ids = []
      ids.push(row.id)
      this.updatePublishStatus(row.publishStatus, ids)
    },
    handleNewStatusChange(index, row) {
      const ids = []
      ids.push(row.id)
      this.updateNewStatus(row.newStatus, ids)
    },
    handleRecommendStatusChange(index, row) {
      const ids = []
      ids.push(row.id)
      this.updateRecommendStatus(row.recommandStatus, ids)
    },
    handleResetSearch() {
      this.selectProductCateValue = []
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBrand(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    },
    handleUpdateProduct(index, row) {
      this.$router.push({ path: '/asset/updateRoom', query: { id: row.id }})
    },
    handleShowProduct(index, row) {
      console.log('handleShowProduct', row)
    },
    handleShowVerifyDetail(index, row) {
      console.log('handleShowVerifyDetail', row)
    },
    handleShowLog(index, row) {
      console.log('handleShowLog', row)
    },
    updatePublishStatus(publishStatus, ids) {
      const params = new URLSearchParams()
      params.append('ids', ids)
      params.append('publishStatus', publishStatus)
    },
    updateNewStatus(newStatus, ids) {
      const params = new URLSearchParams()
      params.append('ids', ids)
      params.append('newStatus', newStatus)
    },
    updateRecommendStatus(recommendStatus, ids) {
      const params = new URLSearchParams()
      params.append('ids', ids)
      params.append('recommendStatus', recommendStatus)
    },
    updateDeleteStatus(deleteStatus, ids) {
      const params = new URLSearchParams()
      params.append('ids', ids)
      params.append('deleteStatus', deleteStatus)

      this.getList()
    }
  }
}
</script>
<style></style>

