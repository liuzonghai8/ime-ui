<template>
  <div>
    <el-form
      :model="userForm"
      :rules="rules"
      ref="userForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form ref="newData" :model="newData" :rules="rules" label-width="80px"> -->
      <el-form-item label="登陆名" prop="name">
        <el-input v-model="userForm.loginName" placeholder="请输用户名"></el-input>
      </el-form-item>
      <el-form-item label="真名" prop="name">
        <el-input v-model="userForm.realNmae" placeholder="请输用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('userForm')">立即创建</el-button>
        <el-button @click="resetForm('userForm')">重置</el-button>
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
export default {
  props: {
    editMark: {
      type: Boolean,
      requied: true
    },
    userId: {
      type: Number
    }
  },

  data: () => {
    return {
      newData: {},
      userForm: {
        loginName: '',
        realNmae: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        realNmae: [
          { required: true, message: '请输入真名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  //页面加载钩子函数
  mounted () {
    this.userId ? this.loadUser() : this.initData()
  },

  methods: {
    initData () {
      this.newData = {}
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("验证成功")
          //TO DO 
        } else {
          console.log("000")
        }
      });
    },
    resetForm (userForm) {
      this.$refs[userForm].resetFields();
    },

    //提交按钮事件
    submitk () {
      if (this.$refs[form].validate(valid)) {
        console.log(valid)
          // 将数据提交到后台 通过editMark 判断是添加还是修改
          (this.editMark ? putObj(this.newData) : addObj(this.newData))
          .then(() => {
            this.initData(), this.$emit('show'),
              console.log("保存成功")
          })
      }
    },

    //根据用户id 加载用户信息
    loadUser () {
      getObj(this.userId).then(resp => { this.newData = resp.data })
    }
  }

}
</script>

