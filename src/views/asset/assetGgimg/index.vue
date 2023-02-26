<template>
  <div class="app-container">
    <!--    <el-card class="filter-container" shadow="never">
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
    </el-card>-->
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
        <el-table-column label="名称" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="地址" width="250" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="首页图片" width="300" align="center">
          <template slot-scope="scope">
            <span v-for="(item) in (scope.row.hometp|| '').split(',')" :key="item">
              <img style="height: 80px;margin-left: 10px" :src="item">
            </span>
          </template>
        </el-table-column>
        <el-table-column label="广告图片" width="300" align="center">
          <template slot-scope="scope">
            <span v-for="(item) in (scope.row.lbtp|| '').split(',')" :key="item">
              <img style="height: 80px;margin-left: 10px" :src="item">
            </span>
          </template>
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
  </div>
</template>
<script>
import {
  updateShowStatus,
  deleteBrand,
  updateSftjStatus,
  fetchGgList, updateGgimgFactoryStatus, deleteGgBrand
} from '@/api/assetFloot'

export default {
  name: 'BrandList',
  filters: {
    imgStr(img) {
      alert(img)
      return img
    }
  },
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
      homeImg: [],
      ggImg: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchGgList(this.listQuery).then(response => {
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
      this.$router.push({ path: '/asset/updateGgimg', query: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGgBrand(row.id).then(response => {
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
      updateGgimgFactoryStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        this.getList()
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
      this.$router.push({ path: '/asset/addGgimg' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

