import React from 'react'
import Avatarmenu from './Avatamenu'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { userLogout } from '../actions'

import './less/header.less'
class Header extends React.Component {
  toNavRemember = ()=>{
    this.props.history.push('/admin/searchfor')
  }
  render(){
    return (
      <div className='pagetop' style={{display:"flex",background:"rgba(0,0,0,0.1)",height:"40px",lineHeight:"40px"}} >
          <div style={{background:"#",height:"100%",flex:"0 0 200px",paddingLeft:"10px"}}>
            <img onClick={this.toNavRemember} style={{cursor:"pointer"}} src={require("../asets/logo.png")} height="30" />
            <span style={{marginLeft:"10px"}}>产 业 信 息 管 理 系 统</span>
          </div>
          <div style={{flex:"1 1 auto"}}>
            <Avatarmenu
              userName={sessionStorage.username?sessionStorage.username:'admin'}
            />
          </div>
      </div>
    )
  }
}

export default withRouter(Header)
