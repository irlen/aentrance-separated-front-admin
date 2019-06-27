import React from 'react'
import { message } from 'antd'
import { wyAxiosPost } from '../components/WyAxios'
const Authenticated = ()=>{
  const loginInfo = localStorage['loginInfo']
  if(loginInfo){
    return true
  }
}



export default Authenticated
