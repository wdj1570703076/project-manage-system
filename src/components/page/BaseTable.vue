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
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection()">批量删除</el-button>
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
                           <input type="text" autocomplete="off" autofocus="autofocus" placeholder="多个账号请用逗号隔开" class="el-input__inner">
                           <div class="el-input-group__append">
                               <label role="checkbox" class="el-checkbox">
                                   <span aria-checked="mixed" class="el-checkbox__input">
                                       <span class="el-checkbox__inner">
                                       </span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value="">
                                   </span>
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
                            <input type="text" autocomplete="off" placeholder="输入会员姓名" class="el-input__inner">
                            <div class="el-input-group__append">
                                <label role="checkbox" class="el-checkbox">
                                    <span aria-checked="mixed" class="el-checkbox__input">
                                        <span class="el-checkbox__inner">
                                        </span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value="">
                                    </span><span class="el-checkbox__label">模糊匹配</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="el-form-item el-form-item--mini">
                    <label class="el-form-item__label">会员类型</label>
                    <div class="el-form-item__content">
                        <div class="el-select el-select--mini" style="width: 100px;">
                            <div class="el-input el-input--mini el-input--suffix">
                                <input type="text" autocomplete="off" placeholder="全部类型" readonly="readonly" class="el-input__inner">
                                <span class="el-input__suffix">
                                    <span class="el-input__suffix-inner">
                                        <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                                    </span>
                                </span>
                            </div>
                            <div class="el-select-dropdown el-popper" style="display: none; min-width: 100px;">
                                <div class="el-scrollbar" style="">
                                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
                                        <ul class="el-scrollbar__view el-select-dropdown__list">
                                            <li class="el-select-dropdown__item selected">
                                                <span>会员</span>
                                            </li>
                                            <li class="el-select-dropdown__item">
                                                <span>试玩帐号</span>
                                            </li>
                                            <li class="el-select-dropdown__item"><span>推广帐号</span></li>
                                        </ul></div><div class="el-scrollbar__bar is-horizontal">
                                    <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
                                    </div><div class="el-scrollbar__bar is-vertical">
                                        <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="el-form-item el-form-item--mini">
                    <label class="el-form-item__label">状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <div class="el-form-item__content">
                        <div class="el-select el-select--mini" style="width: 100px;">
                            <div class="el-input el-input--mini el-input--suffix">
                                <input type="text" autocomplete="off" placeholder="全部状态" readonly="readonly" class="el-input__inner">
                                <span class="el-input__suffix"><span class="el-input__suffix-inner">
                                    <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                                </span>
                                </span>
                            </div>
                            <div class="el-select-dropdown el-popper" style="display: none; min-width: 100px;">
                                <div class="el-scrollbar" style="">
                                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
                                        <ul class="el-scrollbar__view el-select-dropdown__list">
                                            <li class="el-select-dropdown__item">
                                                <span>正常</span>
                                            </li>
                                            <li class="el-select-dropdown__item">
                                                <span>停用</span>
                                            </li>
                                            <li class="el-select-dropdown__item">
                                                <span>冻结</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="el-scrollbar__bar is-horizontal">
                                        <div class="el-scrollbar__thumb" style="transform: translateX(0%);">

                                        </div>
                                    </div>
                                    <div class="el-scrollbar__bar is-vertical">
                                        <div class="el-scrollbar__thumb" style="transform: translateY(0%);">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                name: '',
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
                type: 'HY',
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
            id: -1
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
            fetchData(this.subQuery).then(res => {
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
            this.editVisible = false;
            this.subMultipleSelection = [];
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
