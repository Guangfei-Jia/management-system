// export default {
//     methods: {
//       // 触发关闭时
//       handleClose() {
//         this.$confirm('确认关闭？')
//           .then(_ => {
//             this.closeDialog()
//           })
//           .catch(_ => {})
//       },
//       // 关闭dialog
//       closeDialog() {
//         this.$emit('update:dialogVisible', false)
//         this.resetForm()
//       },
//       // 重置表单
//       resetForm(formName = 'form') {
//         this.$refs[formName].resetFields()
//       },
//       // 提交表单
//       submitForm(formName = 'form') {
//         this.$refs[formName].validate((valid) => {
//           if (valid) {
//             this.submit()
//           } else {
//             console.log('error submit!!')
//             return false
//           }
//         })
//       }
//     }
//   }

// 分页
// export default {
//     data() {
//       return {
//         pageParams: {
//           page: 1,
//           pageSize: 20
//         },
//         pageTotal: null,
//         pageSizes: [10, 20, 30, 40, 50]
//       }
//     },
//     created() {
//       this.copyPageParams = Object.assign({}, this.pageParams)
//     },
//     methods: {
//       handleSizeChange() {
//         this.search(false)
//       },
//       handleCurrentChange() {
//         this.search(false)
//       },
//       resetPageParams() {
//         this.pageParams = Object.assign({}, this.copyPageParams)
//       }
//     }
//   }

/**
 * 全局的el-table resize
 * 使用方式：
 * 引入此mixin；
 * 在el-table 上添加 ‘#el-table’ id 并 bind 上 height 属性。
 */

// export default {
//     data() {
//       return {
//         tableHeight: '0'
//       }
//     },
//     mounted() {
//       this.$nextTick(() => {
//         this.windowResize()
//       })
//       window.onresize = () => this.windowResize()
//     },
//     methods: {
//       // 监听窗口变化
//       windowResize() {
//         let table = document.getElementById('el-table-height')
//         table && (this.tableHeight = window.innerHeight - table.getBoundingClientRect().top - 40)
//       }
//     }
//   }
