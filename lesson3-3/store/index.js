// 防止数据冲突，state需要是函数，返回数据对象
// 服务端运行时需要同一个实例
const cookieParser = process.server?require("cookieparser"):undefined
export const state = ()=>{
    return {
        // 登录状态
        user:null
    }
}

export const mutations = {
    setUser(state,data) {
        state.user = data;
    }
    
}

export const actions = {
    nuxtServerInit({commit},{req}){
        let user = null;
        if(req.headers.cookie){
            const parsed = cookieParser.parse(req.headers.cookie);
            try{
                user = JSON.parse(parsed.user);
            } catch(err){

            }
        }
        commit("setUser",user);
    }
}