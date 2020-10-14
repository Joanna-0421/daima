<template>
  <div class="dashboard-editor-container">
    <!-- 提问框 -->
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="遇到了什么问题？"
      :hide-loading="true"
      :autofocus="true"
      :trigger-on-focus="false"
      clearable
      style="width: 49vw;margin: 16px;border-radius: 30px;overflew: hidden"
      @select="handleSelect"
      @change="handleChange"
      @keyup.enter.native="search"
    />
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜一搜</el-button>
    <!--  -->

    <!-- 搜索推荐 -->
    <h4 v-if="seen" style="margin:16px">看看你的问题是不是这些，其他同学也遇到了哟</h4>
    <el-table
      :data="tableData"
      style="width: 50vw"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :stripe="true"
      empty-text="暂时找不到内容哟"
      @row-click="clickRowHandle"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item v-if="props.row.reasons !== ''" label="原因">
              <span>{{ props.row.reasons }}</span>
            </el-form-item>
            <el-form-item label="解决方案">
              <span>{{ props.row.solve }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="问题描述"
        prop="value"
        style="width:50%"
      />
      <el-table-column
        prop="tag"
        label="标签"
        align="left"
        style="width:20%"
      >
        <template slot-scope="scope" class="tag-group">
          <el-tag
            v-for="item in scope.row.tag"
            :key="item"
            type="primary"
            size="small"
            disable-transitions
            style="margin:4px"
          > {{ item }} </el-tag>
        </template>
      </el-table-column>
      <!-- 操作  -->
      <!-- 以下部分最好设定权限 -->
      <el-table-column label="操作" align="left" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑内容
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            :before-remove="beforeRemove"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row,$index)"
          >删除记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->

    <!-- 这部分是一个编辑bug库的内容的表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="deltaForm" :rules="rules" :model="temp" label-position="left" label-width="85px" style="width: 500px; margin-left:16px;">
        <el-form-item label="问题简述" prop="value">
          <el-input v-model="temp.value" />
        </el-form-item>
        <el-form-item label="原因" prop="reasons">
          <el-input v-model="temp.reasons" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="解决方案" prop="solve">
          <el-input v-model="temp.solve" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <p v-if="unfindResult" style="font-size:14px;margin:16px">找不到解答？
      上<el-link type="primary" href="http://localhost:9527/#/ask/index">提问区</el-link>问问吧！</P>
    <p style="font-size:14px;margin:16px">发现错误？想参与编辑？联系我们！</P>

  </div>
</template>

<script type="module">
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
//import { fetchPv, createArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Vue from 'vue'
import API from '@/api/api.js'
Vue.prototype.API = API

export default {
  directives: { waves },
  data() {
    return {
      el: '#app',
      questions: null,
      state: '',
      seen: true,
      select: false,
      timeout: null,
      getResults: null,
      isSearch: false,
      unfindResult: false,
      tableData: [{
        serial: 63,
        value: '改动原来代码后onLoad函数出错',
        reasons: '1.对函数内部的嵌套函数不清楚。2.onLoad函数没有删全，只删了上半部分，下半部分没有删掉',
        solve: '1.多去编写代码这个问题会被解决。2.检查一下onLoad函数的完整性。',
        tag: ['onLoad函数', '  js'] },
      { serial: 8,
        value: '图片无法显示（音频无法播放）（会出现报错：Failed to load local image resource /images/xx.png）',
        reasons: '1.图片（音频）的名称里面混有中文字符（包含中文逗号等）。2.是在代码中图片（音频）的路径不对' +
        '3.可能图片的位置被无意间改动了。4.图片命名里可能有空格。',
        solve: '1.检查一下图片（音频）的名称里面是否有中文字符，如果有，对图片（音频）文件重命名。2.检查一下代码里面所写的程序路径是否正确。' +
        '3.回想一下之前有没有把图片（音频）移动了位置，如果图片移动过位置的话，在小程序里面也要改相应的路径哟。4.注意这些路径里面的空格，可能会很坑！',
        tag: ['图片与音频', ' 相对路径', '  Failed to load'] },
      { serial: 39,
        value: '显示上传成功了，但是数据库里面没有需要的东西，且没有报错（或者是数据上传得太慢了）',
        reasons: '1. wxml文件中与绑定上传相关的代码（如bindinput）拼写有误。2.有可能是data后面没有加数组下标（e.g：data[0]）。' +
        '（note: 这时会出现提示：Setting data field "xx" to undefined is invalid。因为data是数组名，无法从数组名中读取信息（具体原因将在c++课程中第四章学习））' +
        '3.数据库中的集合名和代码里面的集合名不一致。',
        solve: '1.尝试刷新，有时候这里反应很慢 2.试试检查一下wxml文件中有关的地方，这里拼写不对是不会报错的哟。3. 试试给data数组添加下标。' +
        '4 注意检查代码中的集合名与数据库中的集合名是否一致。',
        tag: ['没有报错', '  js', '  上传'] },
      { serial: 20,
        value: '如何调整按钮大小?(字体的大小)',
        reasons: '',
        solve: '利用wxss中的属性size，设置size的值。E.g：size:30px;',
        tag: ['大小属性', '  wxss'] },
      { serial: 30,
        value: '读取数据库中数据时没有报错，但是就是读取不出来',
        reasons: '在云函数中读取函数中写的数据库名与js中读取函数中写的数据库名字不一样。',
        solve: '试试检查一下云函数中的数据库名与js中读取函数的数据库名是否一致。',
        tag: ['读取', ' js'] },
      { serial: 21,
        value: '为何点击按钮后没有反应？',
        reasons: '1.可能是js中与按钮反应相关的变量拼写错误。2.如果该按钮和页面跳转相关的话，有可能在app.json文件中没有对应的页面路径。' +
        '此外，在app.json文件中路径的名字不小心写错了也会出现类似的情况哟。',
        solve: ' 1.检查js文件中与wxml文件中变量的拼写是否正确。2.检查一下对应路径有没有在app.json文件中。若没有，试试手动添加对应的路径。' +
        '其次，检查一下路径名是否正确，这个点很坑!',
        tag: ['js', ' 没有反应'] }
      ],
      expands: [],
      getRowKeys(row) {
        return row.serial
      },
      temp: {
        id: undefined,
        value: '',
        reasons: '',
        solve: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        value: [{ required: true, message: 'title is required', trigger: 'blur' }],
        solve: [{ required: true, message: 'measures is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadAll()
  },
  methods: {
    loadAll() {
      API.getdebugslist({}).then(res => {
        console.log(res)
        this.questions = res.msg
      }).catch(_ => {
        console.log('失败')
      })
    },
    querySearchAsync(queryString, cb) {
      console.log(this.state)
      var questions = this.questions
      var results = queryString ? questions.filter(this.createStateFilter(queryString)) : questions
      this.getResults = null
      this.getResults = results
      // 这里需要写一个逻辑
      cb(results)
    },
    createStateFilter(queryString) {
      /* 如果输入的词与记录不匹配，不予显示。
      原先在匹配的位置使用了函数，但是现在不用函数了，效率得到了提高
      */
      return (state) => {
        state.value = state.detail
        return (state.detail.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    // 搜索键用的函数，对应第二条支线
    search() {
      this.select = true
      this.isSearch = true
      console.log(this.length)
      if (this.getResults != null && this.state !== '') {
        this.seen = false
        this.tableData = null
        this.tableData = this.getResults
        console.log(this.getResults)
      }
      this.unfindResult = true
      // 恢复搜索推荐，如何改进逻辑？
      if (this.state === '' && this.select === true) {
        var data = [{
          serial: 63,
          value: '改动原来代码后onLoad函数出错',
          reasons: '1.对函数内部的嵌套函数不清楚。2.onLoad函数没有删全，只删了上半部分，下半部分没有删掉',
          solve: '1.多去编写代码这个问题会被解决。2.检查一下onLoad函数的完整性。',
          tag: ['onLoad函数', '  js'] },
        { serial: 8,
          value: '图片无法显示（音频无法播放）（会出现报错：Failed to load local image resource /images/xx.png）',
          reasons: '1.图片（音频）的名称里面混有中文字符（包含中文逗号等）。2.是在代码中图片（音频）的路径不对' +
          '3.可能图片的位置被无意间改动了。4.图片命名里可能有空格。',
          solve: '1.检查一下图片（音频）的名称里面是否有中文字符，如果有，对图片（音频）文件重命名。2.检查一下代码里面所写的程序路径是否正确。' +
          '3.回想一下之前有没有把图片（音频）移动了位置，如果图片移动过位置的话，在小程序里面也要改相应的路径哟。4.注意这些路径里面的空格，可能会很坑！',
          tag: ['图片与音频', ' 相对路径', '  Failed to load'] },
        { serial: 39,
          value: '显示上传成功了，但是数据库里面没有需要的东西，且没有报错（或者是数据上传得太慢了）',
          reasons: '1. wxml文件中与绑定上传相关的代码（如bindinput）拼写有误。2.有可能是data后面没有加数组下标（e.g：data[0]）。' +
          '（note: 这时会出现提示：Setting data field "xx" to undefined is invalid。因为data是数组名，无法从数组名中读取信息（具体原因将在c++课程中第四章学习））' +
          '3.数据库中的集合名和代码里面的集合名不一致。',
          solve: '1.尝试刷新，有时候这里反应很慢 2.试试检查一下wxml文件中有关的地方，这里拼写不对是不会报错的哟。3. 试试给data数组添加下标。' +
          '4 注意检查代码中的集合名与数据库中的集合名是否一致。',
          tag: ['没有报错', '  js', '  上传'] },
        { serial: 20,
          value: '如何调整按钮大小?(字体的大小)',
          reasons: '',
          solve: '利用wxss中的属性size，设置size的值。E.g：size:30px;',
          tag: ['大小属性', '  wxss'] },
        { serial: 30,
          value: '读取数据库中数据时没有报错，但是就是读取不出来',
          reasons: '在云函数中读取函数中写的数据库名与js中读取函数中写的数据库名字不一样。',
          solve: '试试检查一下云函数中的数据库名与js中读取函数的数据库名是否一致。',
          tag: ['读取', ' js'] },
        { serial: 21,
          value: '为何点击按钮后没有反应？',
          reasons: '1.可能是js中与按钮反应相关的变量拼写错误。2.如果该按钮和页面跳转相关的话，有可能在app.json文件中没有对应的页面路径。' +
          '此外，在app.json文件中路径的名字不小心写错了也会出现类似的情况哟。',
          solve: ' 1.检查js文件中与wxml文件中变量的拼写是否正确。2.检查一下对应路径有没有在app.json文件中。若没有，试试手动添加对应的路径。' +
          '其次，检查一下路径名是否正确，这个点很坑!',
          tag: ['js', ' 没有反应'] }
        ]
        this.seen = true
        this.select = false
        this.tableData.pop()
        this.tableData = null
        this.tableData = data
        this.unfindResult = false
      }
    },
    handleSelect(item) {
      console.log(this.tableData.length)
      console.log(item)
      this.unfindResult = false
      // 把原来的推荐记录去掉。再想想这么样提高去掉推荐记录的效率！在前一个版本利用pop() and push()来实现
      this.tableData.splice(0, this.tableData.length, item)
      this.seen = false
      this.select = true
    },
    handleFilter() {
      this.loadAll()
    },
    // 用于行展开
    clickRowHandle(row, column, event) {
      if (this.expands.includes(row.serial)) {
        this.expands = this.expands.filter(val => val !== row.serial)
      } else {
        this.expands.push(row.serial)
      }
    },
    handleChange(item) {
      if (item.split('').length === 0) {
        this.unfindResult = false
      }
    },
    // 以下都是用于编辑bug库内容的函数
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['deltaForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['deltaForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createArticle().then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['deltaForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['deltaForm'].validate((valid) => {
        if (valid) {
          // 注意：tableData是数组名，记得把tableData改成待操作的数组
          const index = this.tableData.findIndex(v => v.id === this.temp.id)
          console.log(index)
          this.tableData.splice(index, 1, this.temp)
          var serial = this.tableData[index].serial
          var question = this.tableData[index].value
          // uesd for test
          var classify = null
          var detail = this.tableData[index].solve
          var tag = JSON.stringify(this.tableData[index].tag)
          console.log(serial)
          console.log(question)
          API.updateList({
            serial: 1,
            question,
            classify,
            detail,
            tag
          }).then(res => {
            console.log(res)
          }).catch(_ => {
            console.log(_)
            if (_.successFlag === 'Y') {
              this.$notify({
                title: '成功！',
                message: '修改成功！',
                type: 'success'
              })
              this.dialogFormVisible = false
              console.log('上传成功')
            } else {
              this.$notify({
                title: '出错了{>~<}',
                message: '系统繁忙，提交失败',
                type: 'error'
              })
              console.log('系统繁忙，提交失败了')
              return false
            }
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.image{
  border-radius: 10px;
}

.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
.size{
  font-size: 13px;
  color:rgb(102, 189, 230);
}
.introduction{
  font-size: 15px;
}
</style>
