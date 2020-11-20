import axios from 'axios';
import {Message} from 'element-ui'
import en from "element-ui/src/locale/lang/en";


//响应拦截
axios.interceptors.response.use(success => {
        //根据响应状态返回信息拦截
        if (success.status && success.status == 200 && success.data.status == 500) {
            //后端验证失败时的的返回信息
            Message.error({message: success.data.message})
            return;
        }
        //如果不符合上述信息则表示返回成功的信息
        return success.data;

    }, error => {

        //处理异常信息
        if (error.response.status == 504 || error.response.status == 404) {
            Message.error({message: "服务器开小差了，"})
        } else if (error.response.status == 403) {
            Message.error({message: "权限不足，请联系管理员"})
        } else if (error.response.status == 401) {
            Message.error({message: "尚未登录，请登录"})
        } else {
            if (error.response.data.message) {
                Message.error({message: error.response.data.message})
            } else {
                Message.error({message: "未知错误"})
            }
        }
        return;
    }
)


//基础路径
let base = '';
//封装keyvalue 形式的post请求
export const postKeyValueRequest = (url, param) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: param,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            console.log(ret)
            return ret;
        }],
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded'
        }


    })

}


