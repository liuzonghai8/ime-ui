<template>
  <div class="app-container">
    <!-- 上部：搜索框、按钮等 -->
    <div class="filter-container">
      <!-- <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>-->
      <el-input v-model="search" placeholder="请输入内容" prefix-icon="el-icon-search" />
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>-->
    </div>
    <!-- 表格内容 -->
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="datas"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- 表格列数据 -->
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="65"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- 分页 -->
      <!-- <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />-->
    </el-table>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      tableKey: 0,
      total: 0, // 总条数
      search: '', // 搜索关键字
      selected: [], // 选择的条目
      total: 20, // 总条数
      datas: [], // 数据集合
      loading: true, // 加载进度条
      pagination: {} // 监听变化

    }
  },

  methods: {
    handleCreate() {
      console.log('添加按钮')
    },
    handleDownload() {
      console.log('导出')
    }
  }

}
</script>
