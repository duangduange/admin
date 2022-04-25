<template>
    <el-container>
      <el-header>
        <div>
          <img src="@/assets/logo.png">
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">注销</el-button>
      </el-header>
      
      <el-container>
        <el-aside :width="isCollapse? '64px': '200px'">
          <div @click="toggleCollapse">|||</div>
          <el-menu background-color="#33333f" text-color="#eee" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconList[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="changePath(subitem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.getPath()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data : data } = await this.$http.get('menus')
      this.menuList = data.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    changePath(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
    getPath() {
      const activePath = window.sessionStorage.getItem('activePath')
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: #333;
  padding: 0;

  display: flex;
  justify-content: space-between;
  
  div {
    display: flex;
    align-items: center;

    img {
      height: 100%;
    }
    span {
      margin-left: 15px;
      font-size: 20px;
      color: #eee;
    }
  }
}
.el-aside {
  background: #33333f;
  > div {
    background: #445;
    line-height: 25px;
    font-weight: bold;
    color: #aaa;
    letter-spacing: -2px;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
  i {
    margin-right: 5px;
  }
}
.el-main {
  background: #fafaff;
}
</style>
