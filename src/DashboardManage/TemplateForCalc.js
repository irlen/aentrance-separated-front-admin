import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router'
import $ from 'jquery'
import { Modal } from 'antd'

import { wyAxiosPost } from '../components/WyAxios'
//import contextList from '../SubPage/ContextList'
import WyDatePicker from '../components/WyDatePicker'

class TemplateForCalc extends Component{
  state = {
    showViewData: {},
    autoHeight: 100,
    updateTime: 0,
    secondData: {},
    title:'',
    value:'',
    visible: false,
    subTime:[]
  }
  componentDidMount(){
    this.setState({
      showViewData: this.props.showViewData,
      autoHeight: this.props.autoHeight,
      updateTime: this.props.updateTime
    },()=>{
      this.getCurViewData()
      if(this.state.updateTime && this.props.env !== 'set'){
        this.updateData()
      }
    })
  }
  componentWillReceiveProps(nextProps){
    if(
      ! (_.isEqual(this.props.showViewData,nextProps.showViewData)) ||
      this.props.autoHeight !== nextProps.autoHeight ||
      (this.props.updateTime && nextProps.upDateTime && (this.props.updateTime !== nextProps.upDateTime))
    ){
      this.setState({
        showViewData: nextProps.showViewData,
        autoHeight: nextProps.autoHeight,
        updateTime: nextProps.updateTime
      },()=>{
        this.getCurViewData()
        if(this.state.updateTime && this.props.env !== 'set'){
          this.updateData()
        }
      })
    }
  }
  componentWillUnmount(){
    if(this.calcTimer1){
      clearInterval(this.calcTimer1)
    }
    if(this.calcTimer2){
      clearInterval(this.calcTimer2)
    }
  }
  //获取数据
  getCurViewData = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = {}
      info.viewType = this.state.showViewData.viewType
      info.api = this.state.showViewData.data.dataMethod
      if(this.state.subTime.length>0 && this.props.env !== 'set'){
        info.start_time = this.state.subTime[0]
        info.last_time = this.state.subTime[1]
      }
      wyAxiosPost('Screen/getScreenData',{info},(result)=>{
        const responseData = result.data.msg
        const { title,value } = responseData
        if(this.state.subTime.length === 0){
          const subTime = []
          subTime.push(responseData.start_time)
          subTime.push(responseData.last_time)
          this.setState({
            title,
            value,
            subTime
          })
        }else{
          this.setState({
            title,
            value
          })
        }
      })
    }
  }
  getCurViewDataForFresh = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = {}
      info.viewType = this.state.showViewData.viewType
      info.api = this.state.showViewData.data.dataMethod
      wyAxiosPost('Screen/getScreenData',{info},(result)=>{
        const responseData = result.data.msg
        const { title,value } = responseData
        const subTime = []
        subTime.push(responseData.start_time)
        subTime.push(responseData.last_time)
        this.setState({
          title,
          value,
          subTime
        })
      })
    }
  }
  //数据更新
  updateData = ()=>{
    if(this.calcTimer1){
      clearInterval(this.calcTimer1)
    }
    const run = ()=>{
      if(this.state.updateTime !== 0){
        if(this.calcTimer2){
          clearInterval(this.calcTimer2)
        }
        let time = this.state.updateTime
        this.calcTimer2 = setInterval(()=>{
          this.getCurViewDataForFresh()
        },time*1000)
        if(this.calcTimer1){
          clearInterval(this.calcTimer1)
        }
      }else{
        if(this.calcTimer2){
          clearInterval(this.calcTimer2)
        }
      }
    }
    this.calcTimer1 = setInterval(run,5000)
  }
  // contextMenu = (event)=>{
  //   const e= event||this.event
  //   $('.drcontainer').removeClass('dropShow').addClass('dropHide')
  //   $(e.target).closest('.gridContainer').find('.drcontainer').removeClass('dropHide').addClass('dropShow')
  //   if(this.state.secondData){
  //     let info ={
  //       start_time: this.state.subTime[0],
  //       last_time: this.state.subTime[1],
  //       listType:'danger',
  //       obj: this.state.showViewData.data.dataMethod,
  //       objType:'danger',
  //       previousPath:this.props.location.pathname
  //     }
  //     const x = e.clientX
  //     const y = e.clientY
  //     if(this.props.setDropListInfo){
  //       this.props.setDropListInfo({
  //          dropData: contextList(info),
  //          dropPosition: {x:x+"px",y:y+"px"},
  //          isexist: true
  //       })
  //     }
  //   }
  // }

  showModal = () => {
   this.setState({
     visible: true,
   });
 }

  handleOk = (e) => {
   this.setState({
     visible: false,
   });
 }

  handleCancel = (e) => {
   this.setState({
     visible: false,
   });
 }
  subTimeChange = (value,event)=>{
   this.setState({
     subTime: value
   },()=>{
     this.getCurViewData()
   })
 }
  render(){
    const height = this.state.autoHeight + 20
    return(
      <div className="amodule" style={{margin:"0px"}}>
      {
        this.props.env === 'set'?
        ''
        :
        <div className="moduleHeader" style={{display:"flex"}}>
          <div className="moduleHeaderIn"style={{flex:"1 1 auto"}}>
            {this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0?this.state.showViewData.data.moduleName:''}
          </div>
          <div style={{flex:"0 0 20px"}}>
            <span onClick={this.showModal} style={{cursor: "pointer"}}><i className="fa fa-list-alt"></i></span>
          </div>
        </div>
      }
        <div className="moduleBody"
        //onContextMenu={this.contextMenu} 
        style={{height,textAlign:"center", cursor:"pointer",fontSize:"40px",lineHeight:height-20+"px",color:"rgba(0,255,102,0.8)"}}>
          {this.state.value}
        </div>
        <Modal
          title="属性"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div style={{display: "flex"}}>
            <div style={{flex:"0 0 100px"}}>统计时间范围：</div>
            <div style={{flex:"1 1 auto"}}><WyDatePicker curTime={this.state.subTime} rangeTimeChange={this.subTimeChange}/></div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default withRouter(TemplateForCalc)
