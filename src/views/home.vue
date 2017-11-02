<template>
  <div>
    <el-container>
      <el-header>
        <h1>Vue + Node CURD增删改查项目</h1>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="20" :offset="3">
            <div class="fr margin40">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="addDialog = true">添加</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="margin40">
          <el-col :span="24">
            <el-table :data="userList" tooltip-effect="dark" style="width: 100%" :default-sort="{prop:'create_time',order:'descending'}">
              <el-table-column type="selection" width="55" sortable>

              </el-table-column>
              <el-table-column prop="username" width="180" label="用户名">

              </el-table-column>
              <el-table-column prop="name" width="200" label="姓名" sortable>

              </el-table-column>
              <el-table-column prop="phone" label="手机">

              </el-table-column>
              <el-table-column prop="email" label="邮箱">

              </el-table-column>
              <el-table-column prop="create_time" label="注册日期" sortable>

              </el-table-column>
              <el-table-column prop="is_active" label="状态" width="75">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.is_active == true ? 'success':'danger'">{{scope.row.is_active | formatter}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250">
                <!-- 要想实现el-button 在el-table-column 中显示，就必须要用template包裹 -->
                <template slot-scope="scope">
                  <el-button size="small" type="success" icon="el-icon-edit">编辑</el-button>
                  <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row>
          <el-col :span="24">
            <div class="block">
              <el-pagination layout="prev,pager,next" :total="total" :page-size="5" @current-change="pageChange"></el-pagination>
            </div>
          </el-col>

          <!--<el-col :span="24">
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="5" layout="prev, pager, next, jumper" :total=total>
              </el-pagination>
            </div>
          </el-col>-->


        </el-row>
      </el-main>
    </el-container>

    <el-dialog title="添加新用户" :visible.sync="addDialog" class="el-dialogs" @close="resetForm('addForm')">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="用户名：" prop="username">
          <el-input type="text" v-model="addForm.username" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input type="text" v-model="addForm.name" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="text" v-model="addForm.password" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="repeat_password">
          <el-input type="text" v-model="addForm.repeat_password" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="phone">
          <el-input type="text" v-model.number="addForm.phone" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input type="email" v-model="addForm.email" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addForm.is_active">

          </el-switch>
        </el-form-item>
        <el-form-item class="el">
          <el-button size="small" type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button size="small" @click="resetForm('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import axios from 'axios'
  export default {
      name: "Home",
      // 组件渲染完毕后屌用getUsers，来获取所有的用户列表
      mounted:function(){
          this.getUsers()
      },
      data(){
          // 自定义的验证规则
          var checkPass = (rule,value,callback) => {
              if(value === ''){
                  callback(new Error('确认密码不能为空'));

              }else if(value !== this.addForm.password){
                  callback(new Error('两次密码输入不一致'));
              }else{
                  callback();
              }
          }
          return {
              // 用于收集新增用户的对象
              addForm:{
                  username:'', // 用户名
                  name:'', // 姓名
                  password:'', // 密码
                  repeat_password:'', // 确认密码
                  phone:'', // 电话
                  email:'', // 邮箱
                  is_active:false // 状态
              },
              // 添加的对话框
              addDialog:false,
              // 编辑的对话框
              editDialog:false,
              userList:[
                  /*{
                    username:'zhangsan',
                    name:'张三',
                    phone:'110',
                    email:'110@qq.com',
                    create_time:'2017年11月11号',
                    is_active:'激活'
                  },
                  {
                    username:'lisi',
                    name:'李四',
                    phone:'110',
                    email:'120@qq.com',
                    create_time:'2017年11月12号',
                    is_active:'激活'
                  },
                  {
                    username:'wangwu',
                    name:'王五',
                    phone:'110',
                    email:'130@qq.com',
                    create_time:'2017年11月13号',
                    is_active:'激活'
                  },*/
              ],
              addRules:{
                    username:[
                      {required:true,message:'请输入用户名',tigger:'blur'},
                      {min:3,max:10,message:'长度在 3 到 10 个字符',tigger:'blur'}
                    ],
                    name:[
                      {required:true,message:'请输入姓名',tigger:'blur'},
                    ],
                    password:[
                      {required:true,message:'请输入密码',tigger:'blur'},
                      {min:6,max:12,message:'密码长度不合法',tigger:'blur'}
                    ],
                    repeat_password:[
                      {required:true,validator:checkPass,trigger:'blur'}
                    ],
                    phone:[
                      {required:true,type:'number',message:'必须是数字类型',trigger:'blur'}
                    ],
                    email:[
                      {required:true,type:'email',message:'必须是合法的邮箱格式',trigger:'blur'}
                    ]
              },
              total:0
          }
      },
      methods:{
          // 表单提交
          submitForm:function(formName){
              this.$refs[formName].validate((valid) => {
                  if(valid){
                      // 提交
                      axios.post('/users/create',this.addForm).then((response) => {
                          // console.log(response)
                          var res = response.data;
                          if(res.status == '0'){
                              // 显示成功的消息提示
                              this.$message.success('新增用户成功');
                              this.resetForm('addForm');
                              // 重新获取一下最新数据
                              this.getUsers();
                          }else{
                              // 返回了错误的消息的时候
                              this.$message.error(res.message);
                          }
                      }).catch(function(err){
                          console.log(err)
                      })
                  }else{
                      return false
                  }
              })
          },
          resetForm:function(formName){
              // 将弹出框关闭
              this.addDialog = false;
              // 将弹出框里面的内容清空
              this.$refs[formName].resetFields();
          },
          // 获取数据显示在列表上
          getUsers:function(page){
              // 分页
              axios.get('/users/getUsers',{
                  params:{
                    page:page || 1,
                    pageSize:5
                  }
              }).then(response => {
                  var res = response.data;
                  this.userList = res.userList;
                  this.total = res.count;
//                  console.log(this.total)
              }).catch(err => {
                  console.log(err);
              })
          },
          pageChange:function(value){
//              console.log(value);
              this.getUsers(value);
          }
      }
  }
</script>
<style>
  h1 {
    text-align: center;
  }
  .clearfix {
    clear: both;
  }
  .fr {
    float: right;
  }
  .fl {
    float:left;
  }
  .el {
    text-align: right;
  }
  .el-dialogs {
    width: 900px;
    margin:0 auto;
  }
  .margin40 {
    margin-top: 40px;
  }
  .block {
    margin-top: 40px;
    float: right;
    margin-right: 70px;
  }
</style>

