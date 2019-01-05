<template>
  <div class="workorder">
    <div>
      <!--搜索-->
      <el-col :span="8">
        <el-input placeholder="搜索" v-model="params.search" @keyup.enter.native="searchClick">
          <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
        </el-input>
      </el-col>
    </div>

    <!--表格-->
    <order-list :value="workorders" @rate="handleRate" @edit="handleEdit" @delete="handleDelete"></order-list>

    <!--模态窗任务进度-->
    <el-dialog
      :title="this.currentValue.title"
      :visible.sync="dialogVisibleForRate"
      width="30%">
      <div style="height: 300px;">
        <el-steps direction="vertical" :active="active">
           <el-step :title="item.title" :description="item.description" 
             v-for="(item,index) in rate" :key="index" ></el-step>
        </el-steps>
      </div>
    </el-dialog>

    <!--模态窗工单处理-->
    <el-dialog
      title="工单处理"
      :visible.sync="dialogVisibleForEdit"
      width="50%">
      <order-form
        ref="workorderForm"
        :form="currentValue"
        @submit="handleSubmitEdit"
        @cancel="handleCancelEdit">
      </order-form>
    </el-dialog>

    <!--分页-->
    <center>
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :page-size="pagesize"
      :total="totalNum"
      @current-change="handleCurrentChange">
    </el-pagination>
    </center>
  </div>
</template>

<script>
import { getWorkOrderList, updateWorkOrder } from '@/api/workorder/workorder'
import OrderList from './table'
import OrderForm from './form'

export default {
  name: 'workorder',
  components: {
    OrderList,
    OrderForm
  },

  data() {
    return {
      dialogVisibleForEdit: false,
      dialogVisibleForRate: false,
      currentValue: {},
      workorders: [],
      totalNum: 0,
      pagesize: 10,
      active: 1,
      apply: {},
      assign: {},
      final_processor: {},
      rate: [],
      params: {
        page: 1,
        search: '',
        status: 1
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      getWorkOrderList(this.params).then(
        res => {
          this.workorders = res.results
          console.log(this.workorders)
          this.totalNum = res.count
        })
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.fetchData()
    },
    searchClick() {
      this.fetchData()
    },
    /* 流程进度处理函数 */
    handleRate(value) {
      console.log(value)
      this.currentValue = { ...value }
      this.dialogVisibleForRate = true
      this.rate = []
      this.final_processor = {}
      this.apply['title'] = '任务申请: ' + value.applicant[0].name + ': ' + value.apply_time
      this.assign['title'] = '任务分配: ' + value.assign_to[0].name
      if (value.final_processor) {
        this.final_processor['title'] = '任务领取: ' + value.final_processor[0].name + ': ' + value.complete_time
        this.active = 2
      }
      this.rate.push(this.apply)
      this.rate.push(this.assign)
      this.rate.push(this.final_processor)
    },

    /*  处理工单，弹出模态窗、提交数据、取消 */
    handleEdit(value) {
      this.currentValue = { ...value }
      const data = { 'status': 1 }
      const id = this.currentValue.id
      updateWorkOrder(id, data).then(res => {
        this.$message({
          message: '接受工单',
          type: 'success'
        })
        this.dialogVisibleForEdit = true
        this.fetchData()
      })
    },

    handleSubmitEdit(value) {
      const { id, ...params } = value // 很神奇，能把表单的值拆解成自己想要的样子
      console.log(params)
      const data = { 'status': 2, 'result_desc': params.result_desc }
      updateWorkOrder(id, data).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.handleCancelEdit()
        this.fetchData()
      })
    },
    handleCancelEdit() {
      this.dialogVisibleForEdit = false
      this.$refs.workorderForm.$refs.form.resetFields()
    },

    /* 取消 */
    handleDelete(id) {
      const data = { 'status': 3 }
      updateWorkOrder(id, data).then(res => {
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.fetchData()
      },
      err => {
        console.log(err.message)
      })
    }

  }

}
</script>

<style lang='scss' scoped>
.workorder {
  padding: 10px;
}
</style>

