<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入用户名称" v-model="params.query" @change="getUsers">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-table :data="userList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="role_name" label="职务"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="toggleState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-right: 10px;" @click="showEdit(scope.row)"></el-button>
          <el-popconfirm title="确定删除该用户？" @confirm="deleteUser(scope.row)">
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" style="margin-right: 10px;"></el-button>
          </el-popconfirm>
          <el-tooltip effect="dark" content="分配人员" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.pagenum"
      :page-sizes="[3, 4, 5]"
      :page-size="params.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog title="添加用户" :visible.sync="addFormVisible" destroy-on-close>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" hide-required-asterisk>
        <el-form-item label="姓名" prop="username" style="margin-right: 20px">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="margin-right: 20px">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="margin-right: 20px">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" style="margin-right: 20px">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改信息" :visible.sync="editFormVisible" @closed="clearEditForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="姓名" style="margin-right: 20px">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="margin-right: 20px">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" style="margin-right: 20px">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var emailRule = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)) {
        return callback()
      }
      callback(new Error('邮箱地址不合法'))
    }
    var mobileRule = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)) {
        return callback()
      }
      callback(new Error('手机号码无效'))
    }
    return {
      params: {
        query: '',
        pagenum: 1,
        pagesize: 3, // 每页显示用户数量，艹
      },
      userList: [],
      total: 0, // 我佛
      addFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '用户名的长度在3~11个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '用户名的长度在6~11个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailRule, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileRule, trigger: 'blur' }
        ]
      },
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { validator: emailRule, trigger: 'blur' }
        ],
        mobile: [
          { validator: mobileRule, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const { data: data } = await this.$http.get("users", {
        params: this.params,
      });
      if(data.meta.status !== 200) {
        return this.$message.error('拉取用户数据失败')
      }
      this.userList = data.data.users
      this.total = data.data.total
      console.log(this.userList)
    },
    handleSizeChange(val) {
      this.params.pagesize = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.params.pagenum = val
      this.getUsers()
    },
    async toggleState(info) {
      const { data : data } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
      if(data.meta.status !== 200) {
        this.$message.error('更新状态出错了')
        info.mg_state = !info.mg_state
      }
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const {data : data} = await this.$http.post('users', this.addForm)
        console.log(data);
        if(data.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加成功')
        this.getUsers()
        this.addFormVisible = false
      })
    },
    async showEdit(info) {
      const {data: data} = await this.$http.get(`users/${info.id}`)
      if(data.meta.status !== 200) {
        return this.$message.error('更新数据出错了')
      }
      this.editForm = data.data
      this.editFormVisible = true
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data : data} = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(data);
        if(data.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getUsers()
        this.editFormVisible = false
      })
    },
    clearEditForm() {
      this.$refs.editFormRef.resetFields() // 全部重置，在标签中添加属性只重置校验提示
    },
    async deleteUser(info) {
      const {data: data} = await this.$http.delete(`users/${info.id}`)
      if(data.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.getUsers()
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
  margin-bottom: 20px;
}
.el-table {
  font-size: 16px;
  margin-bottom: 20px;
}
.el-pagination {
  margin-left: 60px;
}
.el-row {
  .el-col:nth-child(2) {
    float: right;
  }
}
.el-popover {
  background: white !important;
}
</style>

// 太离谱了,在带有scoped属性的标签里设置不了ele样式
// 弹框无背景，手动添加
<style lang="less">
.el-popover {
  background: white;
  padding: 10px;
  border-radius: 5px;
}
</style>