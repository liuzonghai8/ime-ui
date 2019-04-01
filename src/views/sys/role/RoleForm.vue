<template>
  <div>
    <el-form
      :model="roleForm"
      :rules="rules"
      ref="roleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('role.name')" prop="name">
        <el-input v-model="roleForm.name" :placeholder="$t('utils.Inputroleame')"></el-input>
      </el-form-item>

      <!-- :label="$t('rolerealName')" -->
      <el-form-item :label="$t('role.code')" prop="code">
        <el-input v-model="roleForm.code" :placeholder="$t('utils.InputRealName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('role.description')" prop="phone">
        <el-input v-model="roleForm.description" :placeholder="$t('utils.InputPhone')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('role.enableTag')" prop="enableTag">
        <el-select
          class="filter-item"
          v-model="roleForm.enableTag"
          :placeholder="$t('utils.SelectStatus')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item"
            :label="item | statusFilter"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editTag" @click="handleCancel()">{{ $t('globalButton.cancel') }}</el-button>
        <el-button v-else @click="resetForm('roleForm')">{{ $t('globalButton.reset') }}</el-button>
        <el-button type="primary" @click="submit('roleForm')">{{ $t('globalButton.submit') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      <el-button @click="sumbut(newData)">test</el-button>
    </div>-->
  </div>
</template>
<script>
import { addObj, putObj, getObj } from '@/api/sys/role'
export default {
  props: {
    editTag: {
      type: Boolean,
      requied: true
    },
    roleId: {
      type: Number
    }
  },

  data: () => {
    return {
      roles: [],
      roleForm: {
        name: '',
        code: '',
        description: '',
        enableTag: ''
      },
      statusOptions: ["0", "1", "9"],
      rolesOptions: [],
      isDisabled: {
        0: false,
        1: true
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入真名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        enableTag: [{ require: true, message: '必须选择', trigger: 'blur' }]

      }
    }
  },
  watch: {
    // 深度 watcher模式
    roleId: {
      handler: function (val) {
        val ? this.loadrole() : this.initData()
      },
      deep: true
    }
  },
  //页面加载钩子函数
  mounted () {
    this.roled ? this.loadrole() : this.initData()
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

  methods: {
    initData () {
      this.roleForm = {}
    },
    //提交
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        let { createTime, updateTime, ...arg } = this.roleForm
        arg.roles = this.roles
        console.log("向后台传递的数据, arg:{}", arg)
        if (valid) {
          //1.提交处理事件
          //2.成功后 初始化并关闭对话框
          //3.失败  提示出错信息
          (this.editTag ? putObj(arg) : addObj(arg))
            .then((resp) => {
              console.log(resp.data.data)
              if (resp.data.data) {
                this.initData()
                this.$emit('show')
                this.$notify({
                  title: '成功',
                  message: '添加或更新用户成功',
                  type: 'success',
                  duration: 2000
                })
              }
              else {
                this.$notify({
                  title: '失败',
                  message: '添加或更新用户失败',
                  type: 'error',
                  duration: 5000
                })
              }
            })
            .catch(() => {
              this.$notify({
                title: '失败',
                message: '添加或更新用户失败',
                type: 'error',
                duration: 5000
              })
            })
        }
      });
    },
    //重置
    resetForm (roleForm) {
      this.$refs[roleForm].resetFields();
    },
    handleCancel () {
      this.$emit('show')
    },
    //根据用户id 加载用户信息
    loadrole () {
      getObj(this.roled).then(
        resp => {
          this.roleForm = resp.data
          console.log(resp.data)
        })
    },
  }
}
</script>
