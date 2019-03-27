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
      >{{ $t('table.add') }}</el-button>

      <!-- 搜索输入框 -->
      <el-input
        v-model="search"
        :placeholder="$t('utils.KeywordSearch')"
        class="filter-item"
        prefix-icon="el-icon-search"
        style="width: 390px"
      />
    </div>
    <!-- table  -->
    <el-table
      v-loading="loading"
      :element-loading-text="$t('utils.LoadData')"
      :data="datas"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      cell-click
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :label="$t('user.id')" prop="id" sortable="custom" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginName" :label="$t('user.LoginName')">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realName" :label="$t('user.realNmae')">
        <template slot-scope="scope">
          <span>{{ scope.row.realNmae }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" :label="$t('user.phone')">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="enable_tag" :label="$t('user.enableTag')">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.enableTag==='0' ? '有效': '不可用' }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column align="center" class-name="status-col" :label="$t('user.enableTag')">
        <template slot-scope="scope">
          <el-tag>{{scope.row.enableTag | statusFilter}}</el-tag>
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
            @click="handleEdit(scope.row)"
          >{{ $t('table.edit') }}</el-button>
          <!--单个 删除按钮  class="filter-item"-->
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            round
            @click="handleDelete(scope.row)"
          >{{ $t('table.delete') }}</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" round>角色</el-button>
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
    <!-- 对话框 editeMack ? $t('table.edit') : $('table.add')+ -->
    <el-dialog
      :title="(editeMack? $t('table.add'):$t('table.edit'))+$t('user.title')"
      :visible.sync="dialogVisible"
    >
      <UserForm/>
    </el-dialog>
  </div>
</template>
<script>
import { fetchObjs, deleteObj } from '@/api/sys/user'
import UserForm from './UserForm'
export default {
  data: () => {
    return {
      search: '', // 搜索关键字
      total: 0, // 总条数
      selected: [], // 选择的条目
      total: 20, // 总条数
      datas: [], // 数据集合
      loading: true, // 加载进度条
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      selections: [],//选中的内容
      dialogVisible: false,
      editeMack: false,
      userId: ''
    }
  },
  components: {
    UserForm
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
      handler () {
        // 变化后的回调函数，这里我们再次调用getDataFromServer即可
        this.getDatas()
      },
      deep: true // deep为true，会监视pagination的属性及属性中的对象属性变化
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
    sortChange () {
      console.log('改版排序顺序')
    },
    handleCreate () {
      this.dialogVisible = true
      this.editeMack = false
      console.log('handleCreate')
    },
    handleEdit (param) {
      this.userId = param
      this.dialogVisible = true
      this.editeMack = true
    },
    handleDelete (param) {
      this.delete(param)
    },
    //提交按钮
    submit () {

    },
    getDatas () {
      fetchObjs({
        key: this.search, // 搜索条件
        page: this.pagination.page, // 当前页
        rows: this.pagination.rowsPerPage, // 每页大小
        sortBy: this.pagination.sortBy, // 排序字段
        desc: this.pagination.descending // 是否降序
      }).then(resp => {
        this.datas = resp.data.list
        this.total = resp.data.total
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


