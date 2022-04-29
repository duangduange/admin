<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="addRole">
          <el-button type="primary" @click="addFormVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag type="warning" closable @close="deleteRight(scope.row.id, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="10">
                    <el-tag closable @close="deleteRight(scope.row.id, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="14">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="success" closable @close="deleteRight(scope.row.id, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-right: 10px;" @click="showEdit(scope.row)"></el-button>
            <el-popconfirm title="确定删除该角色？" @confirm="deleteRole(scope.row)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" style="margin-right: 10px;"></el-button>
            </el-popconfirm>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightsTree(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="addFormVisible" destroy-on-close>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" hide-required-asterisk>
        <el-form-item label="角色" prop="roleName" style="margin-right: 20px">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc" style="margin-right: 20px">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改描述" :visible.sync="editFormVisible" @closed="clearEditForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色" style="margin-right: 20px">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc" style="margin-right: 20px">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改权限" :visible.sync="rightsTreeVisible" @closed="clearCurrentRights">
      <el-tree :data="rightsTree" :props="{ label: 'authName', children: 'children' }" ref="rightsTreeRef" show-checkbox default-expand-all node-key="id" :default-checked-keys="currentRights"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRightsTree">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],

      addFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请添加描述', trigger: 'blur' }
        ]
      },

      editFormVisible: false,
      editForm: {},
      editFormRules: {
        roleDesc: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      },

      rightsTreeVisible: false,
      rightsTree: [],
      currentRights: [],
      currentRole: 0
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const { data: res } = await this.$http.get('roles')
      if(res.meta.status !== 200) {
        return this.$message.error('网络异常')
      }
      console.log(res.data);
      this.roleList = res.data
    },
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const { data: res} = await this.$http.post('roles', this.addForm)
        console.log(res);
        if(res.meta.status !== 201) {
          return this.$message.error('网络异常')
        }
        this.$message.success('添加成功')
        this.getRoles()
        this.addFormVisible = false
      })
    },
    async showEdit(info) {
      const { data: res } = await this.$http.get(`roles/${info.id}`)
      if(res.meta.status !== 200) {
        return this.$message.error('网络异常')
      }
      this.editForm = res.data
      this.editFormVisible = true
    },
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, { // 出现了,roleId,我当时是真的细
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        console.log(res);
        if(res.meta.status !== 200) {
          return this.$message.error('网络异常')
        }
        this.$message.success('修改成功')
        this.getRoles()
        this.editFormVisible = false
      })
    },
    clearEditForm() {
      this.$refs.editFormRef.resetFields() // 全部重置，在标签中添加属性只重置校验提示
    },
    async deleteRole(info) {
      const { data: res } = await this.$http.delete(`roles/${info.id}`)
      if(res.meta.status !== 200) {
        return this.$message.error('网络异常')
      }
      this.getRoles()
    },
    deleteRight(roleId, id) {
      this.$confirm('确定取消该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${roleId}/rights/${id}`)
        if(res.meta.status !==200) {
          return this.$message.error('网络异常')
        }
        this.$message.success('成功取消权限')
        this.getRoles()
      }).catch(err => console.log(err))
    },
    async showRightsTree(info) {
      // 回顾 这列表数据不能加载的时候拿，不重新拿的话默认勾选变不了!!
      const { data: res } = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) {
        return this.$message.error('网络异常')
      }
      this.defaultRights(info, this.currentRights)
      this.rightsTree = res.data
      this.rightsTreeVisible = true
      this.currentRole = info.id
    },
    defaultRights(val, arr) {
      if(!val.children) {
        return arr.push(val.id)
      }
      val.children.forEach(item => this.defaultRights(item, arr))
    },
    clearCurrentRights() {
      this.currentRights = []
    },
    async changeRightsTree() {
      // 回顾 数据方法忘加()调用
      const keys = this.$refs.rightsTreeRef.getCheckedKeys()
      const halfkeys = this.$refs.rightsTreeRef.getHalfCheckedKeys()
      const selected = [...keys, ...halfkeys].join(",")
      const { data: res } = await this.$http.post(`roles/${this.currentRole}/rights`, { rids: selected })
      if(res.meta.status !== 200) {
        return this.$message.error('网络异常')
      }
      this.$message.success('修改成功')
      this.getRoles()
      this.rightsTreeVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>

<style lang="less">
.addRole {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
.el-table {
  .el-row {
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
  }
  .el-row:last-child {
    border-bottom: none;
  }
  .el-tag {
    margin: 10px;
  }
}
</style>