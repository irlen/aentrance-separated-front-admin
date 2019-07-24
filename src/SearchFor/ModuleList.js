/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Row, Col, Drawer, Button } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'


import { wyAxiosPost } from '../components/WyAxios'

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
class ModuleList extends Component{
  state = {
    list: [],
    curTarget:'',
    hoverTarget:'',
    windowH:'',
    visible: false
  }

  componentDidMount(){
    this._isMounted = true
    this.setState({
      list: _.cloneDeep(this.props.list),
      curTarget: this.props.curTarget
    })
  }
  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.list,nextProps.list) || this.props.curTarget !== nextProps.curTarget || this.props.windowH !== nextProps.windowH){
      if(this._isMounted){
        this.setState({
          list: _.cloneDeep(nextProps.list),
          curTarget: nextProps.curTarget,
          windowH: nextProps.windowH
        })
      }
    }
  }
  doShow =(type,id,name)=>{
     wyAxiosPost('Search/getDataByIdType',{type,id},(result)=>{
       const responseData = _.cloneDeep(result.data.msg)
       const list  = responseData.msg.list
       const data = responseData.msg.data
       this.props.setFieldList(type,list)
       this.props.setTypeField(type,id)
       this.props.setDetail(type,name,data)
     })
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
  edit = (type,id)=>{
    console.log(type,id)
    this.showDrawer()

  }
  onClose = () => {
    this.setState({
      visible: false,
    })
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  render(){
    return (
      <div style={{width:"300px",background:"#f9f9f9",padding:"20px"}}>
        <Scrollbars
          autoHide
          autoHideTimeout={100}
          autoHideDuration={200}
          universal={true}
          style={{ height:`${this.state.windowH - 390}px` }}
        >
          {
            this.state.list && this.state.list.length>0?
            this.state.list.map(item=>{
              return <Item key={item.name} onMouseOver={()=>{this.handleHover(item.id)}} onMouseLeave={this.handleOut}>
                      <div css={{flex:"0 0 30px"}}>
                      {
                        this.state.hoverTarget === item.id?
                        <span onClick={()=>{this.edit(this.props.type,item.id)}} css={{color:"rgb(1, 189, 76)"}}><i className="fa fa-pencil" aria-hidden="true"></i></span>
                        :
                        ''
                      }
                      </div>
                      {
                        item.id === this.state.curTarget?
                        <div onClick={()=>{this.doShow(this.props.type,item.id,item.name)}} css={{flex:"1 1 auto",color:"rgb(1, 189, 76)"}}>{item.name}</div>
                        :
                        <div onClick={()=>{this.doShow(this.props.type,item.id,item.name)}} css={{flex:"1 1 auto"}}>{item.name}</div>
                      }
                      <div css={{flex:"0 0 10px"}}>
                      {
                        item.id === this.state.curTarget && this.props.type !== 'enterprise'?
                        <span css={{color:"rgb(1, 189, 76)"}}><i className="fa fa-chevron-right" aria-hidden="true"></i></span>
                        :
                        ''
                      }

                      </div>
                    </Item>
            })
            :
            ''
          }
        </Scrollbars>
        <Drawer
          title={<Button><i className="fa fa-chevron-left" aria-hidden="true"></i> <span style={{marginLeft:"10px"}}>返回</span></Button>}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={"100%"}
        >

        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})

export default connect(mapStateToProps,null)(ModuleList)
