import { Avatar, Menu, Dropdown, Icon, message } from 'antd'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import $ from 'jquery'

import { wyAxiosPost } from '../components/WyAxios'
import * as screenShot from '../components/ScreenShot/index'
class Avatarmenu extends Component{
  constructor(props){
    super(props)
  }
  state={
    fullScreenForDom: ()=>{},
    fullScreenForWindow:()=>{}
  }
  componentDidMount = ()=>{
    // dom全屏
    const fullScreenForDom = ()=>{
      const fullDom = document.querySelector('.fullScreen')
      let requestMethod = fullDom.webkitRequestFullScreen || fullDom.requestFullScreen ||
      fullDom.mozRequestFullScreen ||
      fullDom.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(fullDom);
      }
    }
    // window全屏
    const fullScreenForWindow = ()=>{
      let requestMethod = document.documentElement.requestFullScreen || //W3C
      document.documentElement.webkitRequestFullScreen ||    //Chrome等
      document.documentElement.mozRequestFullScreen || //FireFox
      document.documentElement.msRequestFullScreen; //IE11
      if (requestMethod) {
        requestMethod.call(document.documentElement);
      }
    }
    this.setState({
      fullScreenForDom,
      fullScreenForWindow
    })
  }
  goOut = ()=>{
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userAuth')
    this.props.history.push('/login')
  }
  clearCache = ()=>{
    wyAxiosPost('User/clearCache',{},(result)=>{
      const responseData = result.data
      if(responseData.status === 1){
        message.success(responseData.msg)
      }
    })
  }
    //退出全屏
    // exitFull = ()=>{
    //   let exitMethod = document.exitFullscreen || //W3C
    //   document.mozCancelFullScreen ||    //Chrome等
    //   document.webkitExitFullscreen || //FireFox
    //   document.webkitExitFullscreen; //IE11
    //   if (exitMethod) {
    //     exitMethod.call(document);
    //    }
    // }
  //内容快照
  screenCut = ()=>{
    //创建一个新的canvas
    document.querySelector(".down").setAttribute('href','dataImage');
    const canvas2 = document.createElement("canvas");
    let _canvas = document.querySelector('.realCant');
    const w = parseInt(window.getComputedStyle(_canvas).width);
    const h = parseInt(window.getComputedStyle(_canvas).height);
    //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
    canvas2.width = w * 2;
    canvas2.height = h * 2;
    canvas2.style.width = w + "px";
    canvas2.style.height = h + "px";
    //可以按照自己的需求，对context的参数修改,translate指的是偏移量
    const context = canvas2.getContext("2d");
    context.scale(2,2);
    context.translate(0,0);
    screenShot.html2canvas(document.querySelector('.realCant'),{
      canvas:canvas2,
      allowTaint: true,
      useCORS: true,
      taintTest: false,
      background:'#ffffff'
    }).then(function(canvas) {
  		//document.body.appendChild(canvas);
  		//canvas转换成url，然后利用a标签的download属性，直接下载，绕过上传服务器再下载
  		document.querySelector(".down").setAttribute('href',canvas.toDataURL());
      $(".downin").click()
    });
  }
  render(){
    const menu = (
      <Menu>
      {
        // <Menu.Item>
        //   <span onClick={this.clearCache}>清除缓存</span>
        // </Menu.Item>
        // <Menu.Item>
        //   <span onClick={this.state.fullScreenForWindow}>页面全屏</span>
        // </Menu.Item>
        // <Menu.Item>
        //   <span onClick={this.state.fullScreenForDom}>内容全屏</span>
        // </Menu.Item>
      }
        <Menu.Item>
          <Link to="/">进入前台</Link>
        </Menu.Item>
      {
        // <Menu.Item>
        //   <span onClick={this.goOut}>退出</span>
        // </Menu.Item>
      }

      </Menu>
    )

    return(
      <div style={{float:"right",margin: "0 20px 0 0"}}>
        <Avatar icon="user" style={{background: "#87d068"}}/>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#" style={{fontSize: "12px"}}>
            {this.props.userName}
            <Icon type="down" />
          </a>
        </Dropdown>
        <a className="down" href="imageData" download="内容快照"><span className="downin"></span></a>
      </div>
    )
  }
}

export default withRouter(Avatarmenu)
