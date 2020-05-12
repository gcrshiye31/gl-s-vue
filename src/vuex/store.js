import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// 登录验证
export default new Vuex.Store({
    state: {
        userName:'',
        merchantId:'',
        isMerchant:false
    },
    mutations: {
        // 登录
        login(state, user) {
            state.userName = user.realName;
            if(user.merchantId&&typeof user.merchantId!='undefined'){
              state.isMerchant=true;
            }
            state.merchantId = user.merchantId;
            localStorage.setItem("userInfo", JSON.stringify(user));
        },
        // 退出
        logout(state, user) {
            state.userName = "";
            state.merchantId = "";
            state.isMerchant = false;
            localStorage.setItem("userInfo", "");
        }
    }
})
