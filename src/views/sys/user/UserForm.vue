<template>
  <div>
    <el-form
      :model="userForm"
      :rules="rules"
      ref="userForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <!-- <el-form ref="newData" :model="newData" :rules="rules" label-width="80px"> -->
      <el-form-item :label="$t('user.LoginName')" prop="loginName">
        <el-input v-model="userForm.loginName" :placeholder="$t('utils.InputUserName')"></el-input>
      </el-form-item>
      <el-form-item v-if="!editTag" :label="$t('user.password')" prop="password">
        <el-input v-model="userForm.password" :placeholder="$t('utils.InputPassword')"></el-input>
      </el-form-item>
      <!-- :label="$t('user.realName')" -->
      <el-form-item :label="$t('user.realName')" prop="realName">
        <el-input v-model="userForm.realName" :placeholder="$t('utils.InputRealName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.phone')" prop="phone">
        <el-input v-model="userForm.phone" :placeholder="$t('utils.InputPhone')"></el-input>
      </el-form-item>
      <!-- 部门 -->
      <!-- <el-form-item :label="$t('user.realName')" prop="realName">
        <el-input v-model="userForm.realName" :placeholder="$t('utils.InputRealName')"></el-input>
      </el-form-item>-->
      <!-- 角色 -->
      <el-form-item :label="$t('user.role')" prop="roles">
        <el-select v-model="roles" :placeholder="$t('utils.PleaseSelect')" multiple>
          <el-option
            v-for="item in rolesOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="isDisabled[item.enableTag]"
          >
            <!-- <span style="float: left">{{ item.description }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>-->
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('user.enableTag')" prop="enableTag">
        <el-select
          class="filter-item"
          v-model="userForm.enableTag"
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

      <el-form-item :label="$t('user.avater')" prop="avater">
        <el-upload
          class="avatar-uploader"
          action
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editTag" @click="handleCancel()">{{ $t('globalButton.cancel') }}</el-button>
        <el-button v-else @click="resetForm('userForm')">{{ $t('globalButton.reset') }}</el-button>
        <el-button type="primary" @click="submit('userForm')">{{ $t('globalButton.submit') }}</el-button>
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
import { addObj, putObj, getObj } from '@/api/sys/user'
import { fetchAllObjs } from '@/api/sys/role'
export default {
  props: {
    editTag: {
      type: Boolean,
      requied: true
    },
    userId: {
      type: Number
    }
  },

  data: () => {
    return {
      roles: [],
      userForm: {
        loginName: '',
        realName: '',
        password: '',
        phone: '',
        enableTag: '',
        avater: ''
      },
      imageUrl: '',
      statusOptions: ["0", "1", "9"],
      rolesOptions: [],
      isDisabled: {
        0: false,
        1: true
      },
      rules: {
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { type: 'number', message: '手机号码必须为数字', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 深度 watcher模式
    userId: {
      handler: function (val) {
        console.log("val:")
        console.log(val)
        val ? this.loadUser() : this.initData()
      },
      deep: true
    }
  },
  //页面加载钩子函数
  mounted () {
    this.loadAllRoles()
    this.userId ? this.loadUser() : this.initData()
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
      this.userForm = {}
      this.roles = []
      this.rolesOptions = []
    },
    //提交
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        let { createTime, updateTime, ...arg } = this.userForm
        arg.roles = this.roles
        console.log(arg)
        if (valid) {
          //1.提交处理事件
          //2.成功后 初始化并关闭对话框
          //3.失败  提示出错信息
          (this.editTag ? putObj(arg) : addObj(arg))
            .then(() => {
              this.initData()
              this.$emit('show')
              this.$notify({
                title: '成功',
                message: '添加或更新用户成功',
                type: 'success',
                duration: 2000
              })
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
    resetForm (userForm) {
      this.$refs[userForm].resetFields();
    },
    handleCancel () {
      this.$emit('show')
    },
    //根据用户id 加载用户信息
    loadUser () {
      getObj(this.userId).then(resp => {
        this.userForm = resp.data.data
        // let role = resp.data.data.roles
        this.roles = resp.data.data.roles.map(r => r.id)
        console.log("testrole :{}", this.roles)
        console.log(resp.data)
      })
    },
    //加载所有角色
    loadAllRoles () {
      fetchAllObjs().then(resp => {
        this.rolesOptions = resp.data.filter(d => d.enableTag == 0)
        console.log(this.rolesOptions)
      })
    },

    //上传相关
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }

  }

}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>