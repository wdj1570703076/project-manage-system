<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="param.account" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { loginCheck } from '../../api/index';
import crypto from 'crypto';
export default {
    data: function() {
        return {
            param: {
                account: "",
                password: "",
            },
            rules: {
                account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {

                if (valid) {

                    let account = this.param.account;
                    let  md5 = crypto.createHash("md5");
                    let password = md5.update(this.param.password).digest('hex');  //password 加密完的密码
                    let params = {'account':account,'password':password};

                    loginCheck(params).then(r => {
                        let res = JSON.parse(JSON.stringify(r));
                        if(res.token!=null && res.token!=''){
                            this.$message.success('登录成功');
                            localStorage.setItem('name', res.name);
                            localStorage.setItem('token', res.token); // 将用户信息存到localStorage中
                            this.$router.push('/');
                        }else{
                            this.$message.success('登录失败');
                            return false;
                        }
                    }).catch((e) => {
                        if (e.response) {
                            if (e.response.status == 400){
                                this.$message.error('账号不存在！');
                            }else if(e.response.status == 404){
                                this.$message.error('网路连接异常！');
                            }
                        }else{
                            this.$message.error(e);
                        }
                        return false;
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
