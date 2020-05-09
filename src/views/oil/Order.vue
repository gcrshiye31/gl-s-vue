/**
* 基础菜单 商品管理
*/
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>加油订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-form-item>
          <el-input size="small" v-model="formInline.serialNumber" placeholder="用户手机号"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="orderid" label="订单号" width="250">
      </el-table-column>
      <el-table-column sortable prop="phone" label="用户名" width="150">
      </el-table-column>
      <el-table-column sortable prop="gasname" label="加油站" width="180">
      </el-table-column>
      <el-table-column sortable prop="paytype" label="支付方式" width="150">
      </el-table-column>
      <el-table-column sortable prop="orderstatusname" label="支付状态"  width="70">
      </el-table-column>
      <el-table-column sortable prop="amountdiscounts" label="减免金额" width="100"  >
      </el-table-column>
      <el-table-column sortable prop="amountpay" label="实付金额" width="100" >
      </el-table-column>
      <el-table-column sortable prop="ordertime" label="下单时间" width="150" :formatter="dateFormat">
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
  import Pagination from '../../components/Pagination'
  import {qryOilOrder} from "../../api/userMG";
  export default {
    data() {
      return {
        nshow: true, //switch开启
        fshow: false, //switch关闭
        loading: false, //是显示加载
        formInline: {
          pageIndex: 0,
          pageSize: 10,
          serialNumber: ''
        },
        listData: [], //用户数据
        listDataMerchant:[],
        // 分页参数
        pageparm: {
          currentPage: 1,
          pageSize: 10,
          total: 10
        }
      }
    },
    // 注册组件
    components: {
      Pagination
    },
    /**
     * 数据发生改变
     */

    /**
     * 创建完毕
     */
    created() {
      this.getdata(this.formInline)
    },

    /**
     * 里面的方法只有被调用才会执行
     */
    methods: {
      // 获取公司列表
      getdata(parameter) {
        this.loading = true
        // 模拟数据结束

        /***
         * 调用接口，注释上面模拟数据 取消下面注释
         */
        qryOilOrder(parameter)
          .then(res => {
            this.loading = false
            if (res.msFlag != "0") {
              this.$message({
                type: 'info',
                message: res.errMsg
              });
            } else {
              this.listData = res.resultJson.list;
              // 分页赋值
              this.pageparm.currentPage = res.resultJson.pageNum
              this.pageparm.pageSize = res.resultJson.pageSize
              this.pageparm.total = res.resultJson.total
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error('卡加载失败，请稍后再试！')
          })
      },
      // 分页插件事件
      callFather(parm) {
        this.formInline.pageIndex = parm.currentPage
        this.formInline.pageSize = parm.pageSize
        this.getdata(this.formInline)
      },
      payTypeFormat(row){
        return row.payStatus=='0'?'待支付':'已支付';
      },
      dateFormat(row){
        let time=new Date(parseInt(row.ordertime));
        return time.toLocaleString();
      },
      moneyFormat(row){
        return parseInt(row.rsrvStr2)/100+'元';
      },
      payFormat(row){
        return parseInt(row.orderFee)/100+'元';
      },
      // 搜索事件
      search() {
        this.getdata(this.formInline)
      },
    }
  }
</script>

<style scoped>
  .user-search {
    margin-top: 20px;
  }
  .userRole {
    width: 100%;
  }
</style>


