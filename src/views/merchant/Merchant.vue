/**
* 基础菜单 商品管理
*/
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商户管理</el-breadcrumb-item>
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
      <el-table-column sortable prop="merchantName" label="商户名称" width="400">
      </el-table-column>
      <el-table-column sortable prop="merchantActive" label="是否可用" width="200">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="sendCard(scope.$index, scope.row)">发卡</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delMerchant(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
    <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
      <el-form-item label="商户名称" prop="merchantName">
        <el-input size="small" v-model="editForm.merchantName" auto-complete="off" placeholder="请输入商户名称"></el-input>
      </el-form-item>
      <el-form-item label="是否可用" prop="merchantActive">
        <el-input size="small" v-model="editForm.merchantActive" auto-complete="off" placeholder="请选择商户是否可用"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
    </div>
  </el-dialog>
    <!-- 发卡界面 -->
    <el-dialog :title="title" :visible.sync="sendCardVisible" width="30%" @click="closeDialog">
      <el-table size="small" :data="listDataCard" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" ref="singleTable">
        <el-table-column align="center" type="selection" width="60">
        </el-table-column>
        <el-table-column sortable prop="cardPassword" label="卡密" width="90">
        </el-table-column>
        <el-table-column sortable prop="saleFee" label="售卖价格(元)" width="90">
        </el-table-column>
        <el-table-column sortable prop="realFee" label="加油金(元)" width="90">
        </el-table-column>
        <el-table-column sortable prop="periodNum" label="加油时长(天)" width="90">
        </el-table-column>
      </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" class="title" @click="doSendCard('editForm')">发卡</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
  import {merchantSave, merchantList, merchantDel, cardList, sendCard, activeCardList} from '../../api/userMG'
  import Pagination from '../../components/Pagination'
  export default {
    data() {
      return {
        nshow: true, //switch开启
        fshow: false, //switch关闭
        loading: false, //是显示加载
        editFormVisible: false, //控制编辑页面显示与隐藏
        sendCardVisible:false,
        title: '添加',
        editForm: {
          merchantId:'',
          merchantName: '',
          merchantActive: ''
        },
        // rules表单验证
        rules: {
          merchantName: [
            { required: true, message: '请输入商户名称', trigger: 'blur' }
          ],
          merchantActive: [{ required: true, message: '请输入商户是否可用', trigger: 'blur' }]
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
        listData: [], //商户数据,
        listDataCard:[],
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
        merchantList(parameter)
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
            this.$message.error('商户加载失败，请稍后再试！')
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
          this.editForm.merchantId = row.merchantId
          this.editForm.merchantName = row.merchantName
          this.editForm.merchantActive = row.merchantActive
        } else {
          this.title = '添加'
          this.editForm.merchantId = ''
          this.editForm.merchantName = ''
          this.editForm.merchantActive = '0'
        }
      },
      //发卡界面
      sendCard(index, row){
        this.sendCardVisible = true;
        this.editForm.merchantId = row.merchantId
        this.editForm.merchantName = row.merchantName
        this.getCardList();
      },
      doSendCard(editData){
        let cards=this.$refs.singleTable.selection;
        if(cards.length==0){
          this.$message({
            type: 'success',
            message: '请选择要发的卡！'
          });
          return;
        }
        sendCard({
          merchantId:this.editForm.merchantId,
          merchantName:this.editForm.merchantName,
          cards:cards
        }).then(res => {
          this.sendCardVisible = false
          this.loading = false
          if (res.msgFlag=='0') {
            this.$message({
              type: 'success',
              message: '发卡成功！'
            });
          } else {
            this.$message({
              type: 'info',
              message: res.errMsg
            })
          }
        }).catch(err => {
            this.sendCardVisible = false
            this.loading = false
            this.$message.error('发卡失败，请稍后再试！')
        })

      },
      // 编辑、增加页面保存方法
      submitForm(editData) {
        this.$refs[editData].validate(valid => {
          if (valid) {
            merchantSave(this.editForm)
              .then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res.msgFlag=='0') {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '商户保存成功！'
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
      // 删除
      delMerchant(index, row) {
        this.$confirm('确定要删除吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            merchantDel(row.merchantId).then(res => {
                if (res.msgFlag=='0') {
                  this.$message({
                    type: 'success',
                    message: '商户已删除!'
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
          .catch(err => {
            console.log(err);
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      // 关闭编辑、增加弹出框
      closeDialog() {
        this.editFormVisible = false
      },
      // 获取卡列表
      getCardList(parameter) {
        this.loading = true
        // 模拟数据结束

        /***
         * 调用接口，注释上面模拟数据 取消下面注释
         */
        activeCardList(parameter)
          .then(res => {
            this.loading = false
            if (res.msgFlag != "0") {
              this.$message({
                type: 'info',
                message: res.errMsg
              });
            } else {
              this.listDataCard = res.resultJson.list;
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error('卡加载失败，请稍后再试！')
          })
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

 
