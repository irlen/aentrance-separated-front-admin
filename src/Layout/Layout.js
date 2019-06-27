/** @jsx jsx */
import React, { Component }  from 'react'
import { Button } from 'antd'
import { css, jsx } from '@emotion/core'
import { withTheme } from 'emotion-theming'
import { Scrollbars } from 'react-custom-scrollbars'

import SideNav from './SideNavContainer'
import Header from './HeaderContainer'
import Container from './Container'
class Layout extends Component {

  componentDidMount(){
    //控制layout各部分高度
    //const leftContainer = document.querySelector(".leftContainer")
    const rightContainer = document.querySelector(".rightContainer")
    //const navContaineer = document.querySelector(".navContainer")
    const containerIn = document.querySelector(".containerIn")
    const windowH = parseInt(document.body.clientHeight,0)
    //leftContainer.style.height = windowH +'px'
    rightContainer.style.height = windowH +'px'
    //navContaineer.style.height = windowH +'px'
    containerIn.style.height = windowH-60 +'px'
    this.props.setWindowH(windowH)
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0)
      this.props.setWindowH(rwindowH)
      //leftContainer.style.height = rwindowH +'px'
      rightContainer.style.height = rwindowH +'px'
      //navContaineer.style.height = rwindowH +'px'
      containerIn.style.height = rwindowH-60 +'px'
    }
  }
  componentWillReceiveProps(nextProps){
  }
  render(){
    const {navWidth} = this.props
    return (
      <div css={{borderRight: this.props.theme.forBorder,display:"flex"}} >
      {
        // <div className="leftContainer" css={{borderRight: this.props.theme.forBorder}}  style={{flex:"0 0 "+this.props.navWidth}}>
        //   <Scrollbars
        //     autoHide
        //     autoHideTimeout={100}
        //     autoHideDuration={200}
        //     universal={true}
        //     className='leftContainer'
        //     >
        //     <SideNav />
        //   </Scrollbars>
        // </div>
      }

        <div className="rightContainer" css={{flex:"1 1 auto"}}>
          <div className="headerContainer" css={{height:"60px",borderBottom: this.props.theme.forBorder }} >
            <Header />
          </div>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            className='containerIn'
          >
            <Container />
          </Scrollbars>
        </div>
      </div>
    )
  }
}

export default withTheme(Layout)
