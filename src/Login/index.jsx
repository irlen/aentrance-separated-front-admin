/** @jsx jsx */

import { jsx, css } from '@emotion/core'
import React from 'react'
import { message, Row, Col } from 'antd'
import $ from 'jquery'
import { connect, dispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { setAuth, getCompiledAuth } from '../actions'
import Loginfrom from './loginform'
import { userLogin } from '../actions'
import { wyAxiosPost } from '../components/WyAxios'
class LoginComponent extends React.Component {
  state={
    verificated: false
  }
  componentDidMount(){
    //容器高度自适应
    const loginContainer = document.querySelector(".loginContainer")
    const windowH = parseInt(document.body.clientHeight,0);
    loginContainer.style.height = windowH +'px'
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0)
      loginContainer.style.height = rwindowH +'px'
    }
    //动画陆续加载
    // setTimeout(function(){
    //   $('.global').addClass('globaldomoving')
    // },1000)
    // setTimeout(function(){
    //   $('.apptitle').addClass('apptitledomoving')
    //   $('.halfglobal').fadeIn()
    //   $('.loginform').fadeIn()
    // },2000)
  }
  //登陆提交事件
  loginSubmit = (values)=>{
    wyAxiosPost('User/login',values,(result)=>{
      const responseData = result.data.msg
      if(responseData.is_login){
        localStorage['loginInfo'] = document.cookie
        this.props.history.push('/app')
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  render(){
    // if(this.state.verificated){
    //   return (
    //     <Redirect to={{
    //       pathname: '/app',
    //       search: ''
    //     }}/>
    //   )
    // }else{
      return(
        <div className="loginContainer evntContainer" css={{position: "relative"}}>
        {
          // <div className="apptitle">
          //   <Row>
          //     <Col style={{textAlign:"center"}}>
          //     <div style={{width: "50px",height:"50px",borderRadius:"25px",margin:"0 auto",background:"rgba(255,255,255,0.8)"}}>
          //       <img style={{width:"80px", height:"80px", margin:"-15px 0 0 -15px"}} src={require("../Login/images/dipperpic.png")} width="100%" />
          //     </div>
          //     </Col>
          //   </Row>
          //   <Row style={{marginTop:"8px"}}>
          //     <Col style={{textAlign:"center"}}>
          //       <img style={{width:"120px" ,height:"32px"}} src={require("../Login/images/netdipper.png")} width="100%" />
          //     </Col>
          //   </Row>
          // </div>
        }

          <div className="loginform" css={{position: "absolute", top:"50%", marginTop:"-116px",left:"50%",marginLeft:"-98px"}}>
            <Loginfrom className="formponent" loginSubmit={this.loginSubmit.bind(this)}/>
          </div>
        </div>
      )
    //}
  }
}


export default connect()(LoginComponent)
