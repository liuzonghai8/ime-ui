<template>
  <el-row>
    <el-col :span="8" style="margin-top:15px;">左边</el-col>
    <el-col :span="16" style="margin-top:15px;">右边</el-col>
  </el-row>
</template>
<script>
import { fetchAllObjs, getRoleByUserId } from '@/api/sys/role'
import { deleteUserRole, addUserRole } from '@/api/sys/user'
export default {
  props: {
    userId: {
      type: Number
    }
  },
  data: () => {
    return {
      allRoles: [],
      selected: []
    }
  },
  mounted () {
    this.loadAllRoles();
    this.loadRole();
  },
  methods: {
    //加载角色选项
    loadAllRoles () {
      fetchAllObjs().then(resp => {
        this.allRoles = resp.data.filter(d => d.enableTag == 0)
        console.log(this.allRoles)
      });
    },
    loadRole () {
      //this.$axios.get("upms/sys/role/user/" + this.user.id)
      getRoleByUserId(this.userId)
        .then(resp => {
          this.possessRoles = resp.data
          console.log(resp.data)
        })
    }
  }
}
</script>

