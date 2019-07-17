/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'


import SideTree from './SideTree'
import SubClassify from './SubClassify'
class IndusClassify extends Component {
  state={
    currentValue: '',
  }
  componentDidMount(){
    this._isMounted = true
  }

  setCurrent = (value)=>{
    if(this._isMounted){
      this.setState({
        currentValue: value
      })
    }
  }


  componentWillUnmount(){
    this._isMounted = false
  }

  render(){
    let indusIdArr = []
    const indexArr = ['one','two','three','four','five']
    if(this.state.currentValue && this.state.currentValue.length>0){
      indusIdArr = this.state.currentValue.split('_')
    }
    return(
      <div>
        <div>
          <SideTree setCurrent={this.setCurrent}/>
        </div>
        <div css={{display:"flex"}}>
          {
            indusIdArr && indusIdArr.length>0?
            indusIdArr.map((item,index)=>{
                return <SubClassify key={item} showId={indusIdArr} rank={indexArr[index]} />
            })
            :
            ''
          }
          {
            indusIdArr && indusIdArr.length<5?
            <SubClassify key={'last'} showId={indusIdArr} rank={indexArr[indusIdArr.length]} />
            :
            ''
          }

        </div>
      </div>
    )
  }
}


export default IndusClassify
