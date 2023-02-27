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
          @click="searchBrandList()"
        >
          查询结果
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" style="width: 203px" placeholder="资产名称/关键字" />
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
        @click="addBrand()"
      >
        添加
      </el-button>
      <el-button
        class="btn-add"
        style="margin-right: 10px"
        size="mini"
        @click="downloadExcel1()"
      >
        导出资产
      </el-button>
      <el-button
        class="btn-add"
        style="margin-right: 10px"
        size="mini"
        @click="importExcel()"
      >
        导入资产
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="brandTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column type="index" label="编号" width="100" align="center" />
        <el-table-column label="资产名称" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="资产地址" width="300" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="所属地区" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.region }}</template>
        </el-table-column>
        <!--        <el-table-column label="毛坯价格" width="150" align="center">
          <template slot-scope="scope"><span v-if="scope.row.price">{{ scope.row.price }}元/月</span></template>
        </el-table-column>
        <el-table-column label="精装价格" width="150" align="center">
          <template slot-scope="scope"><span v-if="scope.row.price">{{ scope.row.jzprice }}元/月</span></template>
        </el-table-column>-->
        <el-table-column label="联系人" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.lxr }}</template>
        </el-table-column>
        <el-table-column label="联系电话" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.lxdh }}</template>
        </el-table-column>
        <el-table-column label="展示状态" width="130" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.zszt"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="handleFactoryStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="热门出租" width="130" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.sftj"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="handleSftjStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
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
import { fetchList, updateShowStatus, updateFactoryStatus, deleteBrand, updateSftjStatus, downloadExcel } from '@/api/assetFloot'
import { getToken } from '@/utils/auth'
export default {
  name: 'BrandList',
  data() {
    return {
      operates: [
        {
          label: '显示品牌',
          value: 'showBrand'
        },
        {
          label: '隐藏品牌',
          value: 'hideBrand'
        }
      ],
      operateType: null,
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10
      },
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: [],
      // bpmn.xml 导入
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
        url: process.env.BASE_API + '/assetFloot/importExcel'
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
      this.upload.title = '资产文件导入'
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
        dom.setAttribute('download', '资产数据' + new Date().getTime() + '.' + 'xlsx')
        document.body.appendChild(dom)
        dom.click()
      }).catch(err => {
        console.log(err)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        this.pageSize = response.data.pageSize
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleUpdate(index, row) {
      this.$router.push({ path: '/asset/updateBrand', query: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该数据', '提示', {
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
    getProductList(index, row) {
      console.log(index, row)
    },
    getProductCommentList(index, row) {
      console.log(index, row)
    },
    handleFactoryStatusChange(index, row) {
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

    handleSftjStatusChange(index, row) {
      var data = new URLSearchParams()
      data.append('ids', row.id)
      data.append('sftj', row.sftj)
      updateSftjStatus(data).then(response => {
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

    handleShowStatusChange(index, row) {
      const data = new URLSearchParams()

      data.append('ids', row.id)
      data.append('showStatus', row.showStatus)
      updateShowStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      }).catch(error => {
        if (row.showStatus === 0) {
          row.showStatus = 1
        } else {
          row.showStatus = 0
        }
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
    searchBrandList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleBatchOperate() {
      console.log(this.multipleSelection)
      if (this.multipleSelection < 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          duration: 1000
        })
        return
      }
      let showStatus = 0
      if (this.operateType === 'showBrand') {
        showStatus = 1
      } else if (this.operateType === 'hideBrand') {
        showStatus = 0
      } else {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      const data = new URLSearchParams()
      data.append('ids', ids)
      data.append('showStatus', showStatus)
      updateShowStatus(data).then(response => {
        this.getList()
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    addBrand() {
      this.$router.push({ path: '/asset/addBrand' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

