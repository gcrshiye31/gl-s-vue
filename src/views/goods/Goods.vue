/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="offerName" label="产品名称" width="200">
      </el-table-column>
      <el-table-column sortable prop="saleFee" label="售卖价格(元)" width="200">
      </el-table-column>
      <el-table-column sortable prop="realFee" label="加油金(元)" width="200">
      </el-table-column>
      <el-table-column sortable prop="periodNum" label="加油时长(天)" width="200">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="产品名称" prop="offerName">
          <el-input size="small" v-model="editForm.offerName" auto-complete="off" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="售卖价格" prop="saleFee">
          <el-input size="small" v-model="editForm.saleFee" auto-complete="off" placeholder="请输入零售价（元）"></el-input>
        </el-form-item>
        <el-form-item label="加油金" prop="realFee">
          <el-input size="small" v-model="editForm.realFee" auto-complete="off" placeholder="请输入加油金（元）"></el-input>
        </el-form-item>
        <el-form-item label="加油时长" prop="periodNum">
          <el-input size="small" v-model="editForm.periodNum" auto-complete="off" placeholder="请输入加油时长（天）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        offerId:'',
        offerName: '',
        periodNum: '',
        realFee: '',
        saleFee: ''
      },
      // rules表单验证
      rules: {
        offerName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        periodNum: [{ required: true, message: '请输入加油时长', trigger: 'blur' }],
        saleFee: [{ required: true, message: '请输入零售价', trigger: 'blur' }],
        realFee: [{ required: true, message: '请输入加油金', trigger: 'blur' }]
      },
      formInline: {
        pageIndex: 0,
        pageSize: 10,
        varLable: '',
        varName: ''
      },
      // 删除部门
      seletedata: {
        ids: ''
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
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
      deptList(parameter)
        .then(res => {
          this.loading = false
          if (res.msFlag != "0") {
            this.$message({
              type: 'info',
              message: res.errMsg
            });
          } else {
            console.log(res);
            this.listData = res.resultJson.list;
            // 分页赋值
            this.pageparm.currentPage = res.resultJson.pageNum
            this.pageparm.pageSize = res.resultJson.pageSize
            this.pageparm.total = res.resultJson.total
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('产品加载失败，请稍后再试！')
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
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.offerId = row.offerId
        this.editForm.offerName = row.offerName
        this.editForm.periodNum = row.periodNum
        this.editForm.realFee = row.realFee
        this.editForm.saleFee = row.saleFee
      } else {
        this.title = '添加'
        this.editForm.offerId = ''
        this.editForm.offerName = ''
        this.editForm.periodNum = ''
        this.editForm.realFee = ''
        this.editForm.saleFee = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          deptSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.msgFlag=='0') {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '产品保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.errMsg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除公司
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deptDelete(row.offerId)
            .then(res => {
              if (res.msgFlag=='0') {
                this.$message({
                  type: 'success',
                  message: '产品已删除!'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.errMsg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    }
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

 
