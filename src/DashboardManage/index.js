/** @jsx jsx */
import React ,{ Component } from 'react'
import { jsx, css } from '@emotion/core'
import { withRouter } from 'react-router'
import List  from './List'
import Detail from './Detail'
class DashboardManage extends Component{
  render(){
    return(
      <div>
      {
        this.props.match.params.id === 'null'?
        <List />
        :
        <Detail id={this.props.match.params.id}/>
      }

      </div>
    )
  }
}

export default withRouter(DashboardManage)
