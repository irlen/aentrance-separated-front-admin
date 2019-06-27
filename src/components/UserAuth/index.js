
import { message } from 'antd'
const userAuth = ()=>{
  if(localStorage.userInfo && localStorage.userAuth){
    const nowTime = new Date().getTime()
    const curTime = localStorage.userInfo.curTime
    const runTime = parseInt(nowTime,0) - parseInt(curTime,0)
    if(runTime > 3600000){
      return false
    }else{
      const userInfo = JSON.parse(localStorage.userInfo)
      userInfo.curTime = nowTime
      localStorage.setItem('userInfo',JSON.stringify(userInfo))
      return true
    }
  }else{
    return false
  }
}

export { userAuth }
