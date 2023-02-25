<template>
  <div class="app-container">
    <div class="un-handle-layout">
      <div class="layout-title">临期预警<span style="float: right"><a href="/#/asset/lqyj">更多</a></span></div>
      <div v-for="item in list" :key="item.id" class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="20">
            <div class="un-handle-item">
              <span class="font-medium">{{ item.floorName }}-{{ item.floorNum }}-{{ item.roomNum }}即将到期，请注意时间！</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">房间总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.below }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.up }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.cz }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.sum }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">已出租</el-col>
                <el-col :span="6" class="overview-item-title">全部房间</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">订单总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.jrxz }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.zrxz }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.byxz }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ this.roomZl.zs }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ this.roomZl.byxz }}</div>
              <!--              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>-->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ this.roomZl.bzxz }}</div>
              <!--              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>-->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ this.roomZl.bydde }}</div>
              <!--              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>-->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ this.roomZl.bzdde }}</div>
              <!--              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>-->
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              v-model="orderCountDate"
              style="float: right;z-index: 1"
              size="small"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="handleDateChange"
            />
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { str2Date } from '@/utils/date'
import img_home_order from '@/assets/images/home_order.png'
import img_home_today_amount from '@/assets/images/home_today_amount.png'
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png'
import { getAssetFloorList, getLqyjList, homeRoomSum, orderTj } from '@/api/assetRoom'
const DATA_FROM_BACKEND = {
  columns: ['date', 'orderCount', 'orderAmount'],
  rows: [
  ]
}
export default {
  name: 'Home',
  data() {
    return {
      roomZl: {
        sum: 0,
        below: 0,
        up: 0,
        cz: 0,
        jrxz: 0,
        zrxz: 0,
        byxz: 0,
        zs: 0,
        bzxz: 0,
        bydde: 0,
        bzdde: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setFullYear(2023)
            start.setMonth(10)
            start.setDate(1)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setFullYear(2023)
            start.setMonth(10)
            start.setDate(1)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      orderCountDate: '',
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: { right: ['orderAmount'] },
        labelMap: { 'orderCount': '订单数量', 'orderAmount': '订单金额' }},
      chartData: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: false,
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount,
      list: null,
      total: null,
      listLoading: true
    }
  },
  created() {
    this.initOrderCountDate()
    this.getData()
    //  this.getFloorList()
    this.getList()
    this.getRoomZl()
    this.orderTj()
  },
  methods: {
    getFloorList() {
      getAssetFloorList().then(res => {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          this.floorList.push({ label: list[i].name, value: list[i].id })
        }
      })
    },
    getList() {
      this.listLoading = true
      getLqyjList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    getRoomZl() {
      this.listLoading = true
      homeRoomSum().then(res => {
        this.roomZl.below = res.data.below
        this.roomZl.cz = res.data.cz
        this.roomZl.sum = res.data.sum
        this.roomZl.up = res.data.up
        this.roomZl.jrxz = res.data.jrxz
        this.roomZl.zrxz = res.data.zrxz
        this.roomZl.byxz = res.data.byxz
        this.roomZl.zs = res.data.zs
        this.roomZl.bydde = res.data.bydde
        this.roomZl.bzxz = res.data.bzxz
        this.roomZl.bzdde = res.data.bzdde
      })
    },
    orderTj() {
      const params = new URLSearchParams()
      params.append('beginTime', this.orderCountDate[0])
      params.append('endTime', this.orderCountDate[1])
      orderTj(params).then(res => {
        DATA_FROM_BACKEND.rows = res.data
        this.chartData.rows = res.data
      })
    },
    handleDateChange() {
      this.orderTj()
    },
    initOrderCountDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const endStr = year + '-' + month + '-' + day
      const end = new Date(endStr)
      /* start.setFullYear(2023)
      start.setMonth(1)
      start.setDate(1)*/
      const start = new Date()
      start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7)
      this.orderCountDate = [start, end]
    },
    getData() {
      setTimeout(() => {
        this.chartData = {
          columns: ['date', 'orderCount', 'orderAmount'],
          rows: []
        }
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          const item = DATA_FROM_BACKEND.rows[i]
          const currDate = str2Date(item.date)
          const start = this.orderCountDate[0]
          const end = this.orderCountDate[1]
          if (currDate.getTime() >= start.getTime() && currDate.getTime() <= end.getTime()) {
            this.chartData.rows.push(item)
          }
        }
        this.dataEmpty = false
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
  .app-container {
    margin-top: 0px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 0px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 0px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 10px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
