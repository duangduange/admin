<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="角色"></el-table-column>
        <el-table-column prop="path" label="途径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" type="warning">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag v-else type="success">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const { data: res } = await this.$http.get('rights/list')
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户权限列表失败')
      }
      console.log(res.data);
      this.rightsList = res.data
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>

<style lang="less">

</style>