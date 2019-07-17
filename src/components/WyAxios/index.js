import axios from 'axios'
import Qs from 'qs'
import { message } from 'antd'
import { host } from '../Host'

const wyAxiosPost = (url,data,callback)=>{
  const dataAuthList = []
  if(localStorage.userAuth && JSON.parse(localStorage.userAuth).dataAuth.length>0){
    const dataAuth = JSON.parse(localStorage.userAuth).dataAuth
    dataAuth.map(item=>{
      dataAuthList.push(item.api_name)
    })
  }
  if(dataAuthList.length>0 && dataAuthList.indexOf(url) !== -1){
    message.warning("非常抱歉，您没有权限进行此操作")
    return
  }

  const wholeUrl = host+url
  let udata = data
  if(localStorage.userInfo){
    udata = Object.assign({},data,{userInfo:localStorage.userInfo})
  }
  const postData = Qs.stringify(udata)
  axios.defaults.withCredentials=true
  axios({
    url: wholeUrl,
    data: postData,
    method: "post",
    withCredentials: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  }
).then((result)=>{
    // if(result.data.ret === 200){
    //   if(result.data.data.status === 1){
    //     callback(result.data)
    //   }else{
    //     //message.error(url+':'+result.data.data.msg)
    //     message.error(result.data.data.msg)
    //   }
    // }else{
    //   //message.error('业务请求错误：'+url+result.data.msg)
    //   message.error(result.data.msg)
    // }
    if(result.status === 200){
      callback(result)
    }
  }).catch(error=>{
	  // message.error('系统请求错误：'+url+error)
	  message.error('系统请求有误')
    return
  })
}

export { wyAxiosPost }
