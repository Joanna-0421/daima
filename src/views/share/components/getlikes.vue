<template>
    <div>
        <p  class="title">这里是其他同学分享的经验!</p> 
        <div v-if=" getLikestatus== 'Y'">
            <el-link   href="https://pan.baidu.com/s/1CliU4XgtqFQ6YhLkUHDQyA" style="font-size:25px">
                1、菜鸟教程
            </el-link>
            <p style = "font-size:25px;margin-left: 1000px ; margin-top:-40px">点赞: {{ getLikenum}}
                <button @click = "getLikenum+=1 , getLikestatus= 'N' " style = "font-size:25px; margin-left:5px," class="el-icon-star-off"></button>
            </p>
        </div>


        <div v-else-if=" getLikestatus== 'N'">
            <el-link  href="https://pan.baidu.com/s/1CliU4XgtqFQ6YhLkUHDQyA" style="font-size:25px">
                1、菜鸟教程
            </el-link>
            <p style = "font-size:25px;margin-left: 1000px;margin-top:-40px">点赞: {{ getLikenum}}
                <button @click = "getLikenum-=1 , getLikestatus='Y' " style = "font-size:25px; margin-left:5px," class="el-icon-star-on"></button>
            </p>
        </div>
        <div>
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    label=""
                    width="180">
                    <template slot-scope="scope">
                        
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="姓名"
                    width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px"><el-link :href="'http://www.baidu.com?id='+scope.row.date">{{ scope.row.name }}</el-link></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button 
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">点赞</el-button>
                            <el-button 
                            size="mini"
                            @click="concleEdit(scope.$index, scope.row)">取消点赞</el-button>                        
                    </template>
                </el-table-column>
                <el-table-column
                    label="点赞数"
                    width="180">
                    <template slot-scope="scope">
                        
                        <span style="margin-left: 10px">{{ scope.row.getLikenum }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import API from '@/api/api.js'
import Vue from 'vue'
Vue.prototype.API = API
export default {
    data(){
        return{
            tableData: [{
                date: '1',
                name: '王小虎',
                getLikenum:'0'
                }, {
                date: '2',
                name: '王小虎',
                getLikenum:'3'
                }, {
                date: '3',
                name: '王小虎',
                getLikenum:'0'
                }, {
                date: '4',
                name: '王小虎',
                getLikenum:'0'
            }]
        }
    },
    methods:{
        handleEdit(index, row) {
            //console.log(index, row);
            //console.log(window.localStorage);
            var storage = window.localStorage;
            var id = storage.getItem("id")
            API.getLikestatus({id:id,serial:index}).then(res => {
                console.log(res)
            }).catch(_ => {
                console.log(_)
                if(_=='0'){
                    row.getLikenum = parseInt(row.getLikenum) + 1
                    API.like({id:id,serial:index}).then(res => {
                        console.log(res)
                    }).catch(_ => {
                        console.log(_)
                    })                
                }
            })
        },
        concleEdit(index, row) {
            console.log(index, row);
        }
    }
}
</script>