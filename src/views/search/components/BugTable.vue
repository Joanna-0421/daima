<template>
  <div class="app-container">
    <el-select
      v-model="search"
      size="medium"
      placeholder="选择标签"
      multiple
      filterable
      style="width:20vw"
    >
      <el-option
        v-for="item in labelData"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      />
    </el-select>
    <!-- note1:如果tag变成了一个数组，那么代码变成data.tag.toString().toLowerCase().includes(search.toLowerCase()) -->
    <!-- note2:放在bug库的话，记得把width里面的值改成70~75vw -->
    <el-button size="medium" style="margin:16px" @click="clearFilter">清空筛选</el-button>
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
            <el-form-item label="原因">
              <span>{{ props.row.reason }}</span>
            </el-form-item>
            <el-form-item label="回答">
              <span>{{ props.row.solve }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column
        label="问题"
        prop="detail"
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
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Vue from 'vue'
import API from '@/api/api.js'
Vue.prototype.API = API
// import tableRouter from '../../../../router/modules/table'
export default {
  name: 'BarChart',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        tag: undefined
      },
      search: [],
      tableKey: 0,
      total: 0,
      labelData: [
        { text: 'json', value: 'json' },
        { text: 'wxss', value: 'wxss' },
        { text: 'wxml', value: 'wxml' },
        { text: 'js', value: 'js' },
        { text: '云函数', value: '云函数' },
        { text: '数据库', value: '数据库' },
        { text: '报错', value: '报错' },
        { text: '路径', value: '路径' },
        { text: '预览', value: '预览' }
      ],
      results: null,
      tableDataBackup: null,
      tableData: null,
      currentRow: null,
      expands: [],
      getRowKeys(row) {
        return row.serial
      }
    }
  },
  mounted() {
    API.getdebugslist({}).then(res => {
      this.tableData = res.msg
      for (var i = 0; i < this.tableData.length; i++) {
        var tag = this.tableData[i].tag.replace(/\"/g, "").trim()
        this.tableData[i].tag = tag.trim().replace(/\'/g,"\"")
        console.log(JSON.parse(this.tableData[i].tag))
        tag = JSON.parse(this.tableData[i].tag)
        this.tableData[i].tag = tag
      }
    }).catch(_ => {
      console.log('失败')
    })
    this.total = this.tableData.length
    this.listQuery.title = this.tableData.detail
    this.listQuery.tag = this.tableData.tag
  },
  methods: {
    getList() {
      return this.tableData
    },
    clearFilter() {
      while (this.search.length !== 0) {
        this.search.pop()
      }
    },
    displayList(filters, row) {
      return row.tag === filters.value
    },
    filterTag(value, row) {
      console.log(value)
      return row.tag === value
    },
    /* setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },*/
    // 用于行展开
    clickRowHandle(row, column, event) {
      if (this.expands.includes(row.serial)) {
        this.expands = this.expands.filter(val => val !== row.serial);
      } else {
        this.expands.push(row.serial)
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}

</script>

<style>

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
</style>
