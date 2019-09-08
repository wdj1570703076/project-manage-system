<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del" @click="handleEdit()"><span>添加</span></el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection()">删除</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户ID"  align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名称"  align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!--&lt;!&ndash; 弹出框 &ndash;&gt;-->
        <el-dialog title="添加页面" :visible.sync="editVisible" width="50%">
            <div class="handle-box">
               <div class="el-form-item el-form-item--mini">
                   <label class="el-form-item__label">会员帐号</label>
                   <div class="el-form-item__content">
                       <div class="el-input el-input--mini el-input-group el-input-group--append el-input--suffix" style="width: 340px;">
                           <input type="text" autocomplete="off" autofocus="autofocus" placeholder="多个账号请用逗号隔开" class="el-input__inner" v-model="subQuery.account">
                           <div class="el-input-group__append">
                               <label role="checkbox" class="el-checkbox">
                                   <el-checkbox v-model="subQuery.accountFuzzy" value="true"></el-checkbox>
                                   <span class="el-checkbox__label">模糊匹配</span>
                               </label>
                           </div>
                       </div>
                   </div>
               </div>
                <div class="el-form-item el-form-item--mini">
                    <label class="el-form-item__label">会员姓名</label>
                    <div class="el-form-item__content">
                        <div class="el-input el-input--mini el-input-group el-input-group--append el-input--suffix" style="width: 280px;">
                            <input type="text" autocomplete="off" placeholder="输入会员姓名" class="el-input__inner" v-model="subQuery.fullName">
                            <div class="el-input-group__append">
                                <el-checkbox v-model="subQuery.fullNameFuzzy" value="true"></el-checkbox>
                                <span class="el-checkbox__label">模糊匹配</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="el-form-item el-form-item--mini">
                    <label class="el-form-item__label">会员类型</label>
                    <div class="el-form-item__content">
                        <div class="el-select el-select--mini" style="width: 100px;">
                            <el-select v-model="subQuery.type" placeholder="全部类型">
                                <el-option v-for="item in options" :label="item.text" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="el-form-item el-form-item--mini">
                    <label class="el-form-item__label">状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <div class="el-form-item__content">
                        <div class="el-select el-select--mini" style="width: 100px;">
                            <el-select v-model="subQuery.state" placeholder="全部状态">
                                <el-option v-for="item in options2" :label="item.text" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="subHandleSearch">查询</el-button>
            </div>
            <el-table :data="subTableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="subHandleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户ID" width="100" align="center"></el-table-column>
                <el-table-column prop="account" label="用户名" align="center"></el-table-column>
                <el-table-column prop="fullName" label="用户名称" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="subQuery.page" :page-size="subQuery.rows" :total="subPageTotal" @current-change="subHandlePageChange">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData, updateData, deleteData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '/admin/ags',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            subQuery: {
                address: '/user/query',
                accountFuzzy: false,
                fullNameFuzzy: false,
                regIpFuzzy: false,
                orderBy: 'u.add_time',
                sort: 'DESC',
                page: 1,
                rows: 5
            },
            subTableData: [],
            subMultipleSelection: [],
            subPageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            options:[
                {value:'',text:"全部类型"},
                {value:'HY',text:"会员"},
                {value:'TEST',text:"试玩账号"},
                {value:'VHY',text:"推广账号"}
            ],
            options2:[
                {value:'',text:"全部状态"},
                {value:'1',text:"正常"},
                {value:'2',text:"停用"},
                {value:'3',text:"冻结"}
            ]
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            fetchData(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.data.length || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            if (length != 1) {
                this.$message.warning('请选择一条数据删除')
                return
            }
            let subMultiple = {"id":this.multipleSelection[0].id};
            deleteData(subMultiple).then(res => {
                this.$message.success("删除成功！")
                this.fetch();
            }).catch((e) => {
                this.$message.error("删除失败！")
            });
            this.multipleSelection = [];
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        //子模块方法
        // 分页导航
        subHandlePageChange(val) {
            this.$set(this.subQuery, 'page', val);
            this.subGetData();
        },
        // 多选操作
        subHandleSelectionChange(val) {
            this.subMultipleSelection = val;
        },
        subGetData() {
            fetchData(this.cleanParams(this.subQuery)).then(res => {
                this.subTableData = res.data;
                this.subPageTotal = res.totalCount || 50;
            });
        },
        // 添加页面
        handleEdit() {
            fetchData(this.subQuery).then(res => {
                this.subTableData = res.data;
                this.subPageTotal = res.totalCount || 50;
            });
            this.editVisible = true;
        },
        // 添加操作
        handleAdd() {
            const length = this.subMultipleSelection.length;
            if (length != 1) {
                this.$message.warning('请选择一条数据添加')
                return
            }
            let subMultiple = {"userId":this.subMultipleSelection[0].userId,"userName":this.subMultipleSelection[0].fullName};
            updateData(subMultiple).then(res => {
                this.$message.success("添加成功！")
            }).catch((e) => {
                this.$message.error("添加失败！")
            });
            this.fetch();
            this.subMultipleSelection = [];
        },
        // 触发搜索按钮
        subHandleSearch() {
            this.$set(this.cleanParams(this.subQuery), 'page', 1);
            this.subGetData();
        },
        //刷新页面
        fetch () {
            this.editVisible = false;
            this.getData();
        },
        cleanParams(val){
            let v_data ={};
            for(let a in val){
                if (val[a] != null && val[a] != '') {
                    v_data[a] = val[a];
                }else if(a == 'accountFuzzy' || a == 'regIpFuzzy' || a == 'fullNameFuzzy'){
                    v_data[a] = false;
                }
            }
            return v_data;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
