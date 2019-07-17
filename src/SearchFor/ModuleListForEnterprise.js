/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import _ from 'lodash'



const Item = styled.div({
  background: "rgba(0,0,0,0.1)",
  lineHeight: "30px",
  borderRadius:"5px",
  cursor:"pointer",
  display:"flex",
  "&:hover":{
    boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.1)"
  },
  "&:active":{
    boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)"
  },
  padding: "0 10px 0 10px",
  marginBottom: "4px"
})
class ModuleListForEnterprise extends Component{
  state = {
    list: [],
    curTarget:'',
    hoverTarget:''
  }

  componentDidMount(){
    this._isMounted = true
    this.setState({
      list: _.cloneDeep(this.props.list),
      curTarget: this.props.curTarget
    })
  }
  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.list,nextProps.list) || this.props.curTarget !== nextProps.curTarget){
      if(this._isMounted){
        this.setState({
          list: _.cloneDeep(nextProps.list),
          curTarget: nextProps.curTarget
        })
      }
    }
  }


doShow =()=>{
  console.log("aaaaaaaa")
}
handleHover = (value)=>{
  if(this._isMounted){
    this.setState({
      hoverTarget: value
    })
  }
}
handleOut = ()=>{
  if(this._isMounted){
    this.setState({
      hoverTarget: ''
    })
  }
}

  componentWillUnmount(){
    this._isMounted = false
  }

  render(){
    return (
      <div style={{width:"300px",background:"#f9f9f9",padding:"20px"}}>
        {
          this.state.list && this.state.list.length>0?
          this.state.list.map(item=>{
            return <Item key={item.name} onMouseOver={()=>{this.handleHover(item.name)}} onMouseLeave={this.handleOut}>
                    <div css={{flex:"0 0 30px"}}>
                    {
                      this.state.hoverTarget === item.name?
                      <span css={{color:"rgb(1, 189, 76)"}}><i className="fa fa-pencil" aria-hidden="true"></i></span>
                      :
                      ''
                    }
                    </div>
                    {
                      item.name === this.state.curTarget?
                      <div onClick={this.doShow} css={{flex:"1 1 auto",color:"rgb(1, 189, 76)"}}>{item.name}</div>
                      :
                      <div onClick={this.doShow} css={{flex:"1 1 auto"}}>{item.name}</div>
                    }

                    <div css={{flex:"0 0 10px"}}>

                    </div>
                  </Item>
          })
          :
          ''
        }
      </div>
    )
  }
}


export default ModuleListForEnterprise
