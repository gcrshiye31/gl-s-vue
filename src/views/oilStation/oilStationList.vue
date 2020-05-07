/**
* 基础菜单 商品管理
*/
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>加油站信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.provinceName" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="河南省" value="河南省"></el-option>
          <el-option label="贵州省" value="贵州省"></el-option>
          <el-option label="山西省" value="山西省"></el-option>
          <el-option label="江苏省" value="江苏省"></el-option>
          <el-option label="江西省" value="江西省"></el-option>
          <el-option label="广东省" value="广东省"></el-option>
          <el-option label="四川省" value="四川省"></el-option>
          <el-option label="山东省" value="山东省"></el-option>
          <el-option label="浙江省" value="浙江省"></el-option>
          <el-option label="安徽省" value="安徽省"></el-option>
          <el-option label="黑龙江省" value="黑龙江省"></el-option>
          <el-option label="吉林省" value="吉林省"></el-option>
          <el-option label="湖北省" value="湖北省"></el-option>
          <el-option label="湖南省" value="湖南省"></el-option>
          <el-option label="北京市" value="北京市"></el-option>
          <el-option label="陕西省" value="陕西省"></el-option>
          <el-option label="重庆市" value="重庆市"></el-option>
          <el-option label="河北省" value="河北省"></el-option>
          <el-option label="宁夏回族自治区" value="宁夏回族自治区"></el-option>
          <el-option label="辽宁省" value="辽宁省"></el-option>
          <el-option label="福建省" value="福建省"></el-option>
          <el-option label="广西壮族自治区" value="广西壮族自治区"></el-option>
          <el-option label="新疆维吾尔自治区" value="新疆维吾尔自治区"></el-option>
          <el-option label="云南省" value="云南省"></el-option>
          <el-option label="上海市" value="上海市"></el-option>
          <el-option label="内蒙古自治区" value="内蒙古自治区"></el-option>
          <el-option label="甘肃省" value="甘肃省"></el-option>
          <el-option label="青海省" value="青海省"></el-option>
          <el-option label="西藏自治区" value="西藏自治区"></el-option>
          <el-option label="海南省" value="海南省"></el-option>
          <el-option label="天津市" value="天津市"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="provincename" label="省份" width="150">
      </el-table-column>
      <el-table-column sortable prop="cityname" label="城市" width="150">
      </el-table-column>
      <el-table-column sortable prop="countyname" label="地区" width="150">
      </el-table-column>
      <el-table-column sortable prop="gasname" label="加油站" width="250">
      </el-table-column>
      <el-table-column sortable prop="gasaddresslatitude" label="经度" width="150">
      </el-table-column>
      <el-table-column sortable prop="gasaddresslongitude" label="纬度" width="150">
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
  import Pagination from '../../components/Pagination'
  import {qryGasList} from "../../api/userMG";
  export default {
    data() {
      return {
        nshow: true, //switch开启
        fshow: false, //switch关闭
        loading: false, //是显示加载
        formInline: {
          pageIndex: 0,
          pageSize: 10,
          provinceName: '',
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
        qryGasList(parameter)
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

 
