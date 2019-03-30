<template>
  <div class="app-container">
    <!-- 上部：搜索框、按钮等 -->
    <div class="filter-container">
      <!-- 添加按钮 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >{{ $t('globalButton.add') }}</el-button>

      <!-- 搜索输入框 -->
      <el-input
        style="margin-left: 10px;width: 390px"
        v-model="search"
        :placeholder="$t('utils.KeywordSearch')"
        class="filter-item"
        prefix-icon="el-icon-search"
      />
    </div>
    <!-- table height="850" -->
    <el-table
      v-loading="loading"
      :element-loading-text="$t('utils.LoadData')"
      :data="datas"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      cell-click
      header-click
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :label="$t('user.id')" prop="id" sortable="custom" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="login_name" sortable="custom" :label="$t('user.LoginName')">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="real_name" sortable="custom" :label="$t('user.realName')">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" :label="$t('user.phone')">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roles" :label="$t('user.role')">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roles " :key="role.id">{{ role.name +"、 "}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="status-col"
        prop="enable_tag"
        sortable="custom"
        :label="$t('user.enableTag')"
      >
        <template slot-scope="scope">
          <el-tag>{{scope.row.enableTag | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="create_time"
        sortable="custom"
        :label="$t('user.createTime')"
      >
        <template slot-scope="scope">
          <!-- <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="update_time"
        sortable="custom"
        :label="$t('user.updateTime')"
      >
        <template slot-scope="scope">
          <!-- <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" width="280">
        <template slot-scope="scope">
          <!-- 编辑按钮  :disabled="!(selections.length==1)"    v-show="selections.length"-->
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            round
            @click="handleEdit(scope.row.id)"
          >{{ $t('globalButton.edit') }}</el-button>
          <!--单个 删除按钮  class="filter-item"-->
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            round
            @click="handleDelete(scope.row)"
          >{{ $t('globalButton.delete') }}</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            round
            @click="handleAddRole(scope.row)"
          >{{$t('user.role')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- :current-page="currentPage4" -->
    <div v-show="!loading" class="pagination-container">
      <el-pagination
        :page-sizes="[10, 20, 30, 100,`${total}`]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 对话框 editTag ? $t('table.edit') : $('table.add')+ -->
    <el-dialog
      :title="(editTag? $t('globalButton.edit'):$t('globalButton.add'))+'  '+$t('user.title')"
      :visible.sync="dialogUserForm"
      center
      :close="closeDialog"
      :before-close="closeDialog"
      v-if="dialogUserForm"
    >
      <!-- <UserForm :userId="userId"/> -->
      <UserForm :editTag="editTag" :userId="userId" v-on:show="closeDialog"/>
    </el-dialog>
    <el-dialog
      :title="$t('user.title')"
      :visible.sync="dialogUerRole"
      center
      :close="closeDialog"
      :before-close="closeDialog"
      v-if="dialogUerRole"
    >
      <UserRole :userId="userId" v-on:show="closeDialog"/>
    </el-dialog>
  </div>
</template>
<script>
import { fetchObjs, deleteObj } from '@/api/sys/user'
import UserForm from './UserForm'
import UserRole from './UserRole'
export default {
  data: () => {
    return {
      search: '', // 搜索关键字
      total: 0, // 总条数
      //selected: [], // 选择的条目
      datas: [], // 数据集合
      loading: true, // 加载进度条
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: ''

      },
      //selections: [],//选中的内容
      dialogUserForm: false,
      dialogUerRole: false,
      editTag: false,
      userId: 0
    }
  },
  components: {
    UserForm,
    UserRole
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: "有效",
        1: "无效",
        9: "锁定"
      };
      return statusMap[status];
    }
  },
  watch: {
    // 监听数据的变化，数据有变化时刷新列表 // 监视pagination属性的变化
    pagination: {
      deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
      handler () {
        // 变化后的回调函数，这里我们再次调用getDataFromServer即可
        this.getDatas()
      }

    },
    // 监视搜索字段
    search: {
      handler () {
        this.getDatas()
      }
    }
  },
  mounted () {
    // 根据监听pagination 的获取数据
    this.getDatas()
  },

  methods: {
    initData () {
      this.editTag = false
      this.dialogUserForm = false
      this.dialogUerRole = false
      this.userId = 0
      this.getDatas()

    },
    //关闭对话框
    closeDialog () {
      console.log("click  close ")
      this.initData();
    },
    //排序
    sortChange (param) {
      this.pagination.sortBy = param.prop // 排序字段
      this.pagination.descending = (param.order === 'descending' ? true : false)// 是否降序
    },
    //弹出新建按钮
    handleCreate () {
      this.dialogUserForm = true
      this.editTag = false
    },
    //弹出编辑按钮
    handleEdit (param) {
      this.userId = param
      this.dialogUserForm = true
      this.editTag = true
    },
    //删除
    handleDelete (param) {
      this.delete(param)
    },
    //弹出添加角色按钮
    handleAddRole (param) {
      this.dialogUerRole = true
      this.userId = param.id
    },
    //提交按钮
    submit () {

    },
    //从服务器获取数据
    getDatas () {
      fetchObjs({
        key: this.search, // 搜索条件
        page: this.pagination.page, // 当前页
        rows: this.pagination.rowsPerPage, // 每页大小
        sortBy: this.pagination.sortBy, // 排序字段
        desc: this.pagination.descending // 是否降序
      }).then(resp => {
        this.datas = resp.data.data.records
        this.total = resp.data.data.total
        this.loading = false
        console.log(resp.data)
      })
    },
    //表格选择
    handleSelectionChange (val) {
      this.selections = val
    },
    //表格页号的改变
    handleSizeChange (val) {
      this.pagination.rowsPerPage = val
    },
    //表格页内条数的改变
    handleCurrentChange (val) {
      this.pagination.page = val
    },

    //物理删除的办法
    delete (param) {
      this.$confirm('此操作将永久删除该用户(用户名:' + param.loginName + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteObj(param.id)
            .then(() => {
              this.getDatas()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
        },
          () => { console.log('取消') }
        )
    }
    //
  }
}
</script>


