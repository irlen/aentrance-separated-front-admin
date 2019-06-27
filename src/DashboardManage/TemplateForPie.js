import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import { withRouter } from 'react-router'

import { wyAxiosPost } from '../components/WyAxios'
import WyDatePicker from '../components/WyDatePicker'
import WySpin from '../components/WySpin'
import Pie from '../components/Pie'
//import contextList from '../SubPage/ContextList'


class TemplateForPie extends Component{
  state={
    name:'',
    title:'',
    unit:'',
    pieData:[],

    isSpining: false,
    autoHeight: 300,
    subTime: [],
    showViewData:{},
    updateTime: 0,
    secondData: {}
  }

  //获取数据
  getCurViewData = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = _.cloneDeep(this.state.showViewData.data)
      info.viewType = this.state.showViewData.viewType
      info.pageId = this.props.pageId
      if(this.state.subTime.length>0 && this.props.env !== 'set'){
        info.start_time = this.state.subTime[0]
        info.last_time = this.state.subTime[1]
      }
      wyAxiosPost('Dashboard/getModuleData',{info},(result)=>{
        const responseData = result.data.msg
        if(this.state.subTime.length === 0){
          const curTime = []
          curTime.push(responseData.start_time)
          curTime.push(responseData.last_time)
          if(this._isMounted){
            this.setState({
              name: responseData.name,
              title: responseData.title,
              unit: responseData.unit,
              pieData: responseData.data,
              subTime: _.cloneDeep(curTime),
              secondData: responseData.secondData?responseData.secondData:{}
            })
          }
        }else{
          if(this._isMounted){
            this.setState({
              name: responseData.name,
              title: responseData.title,
              unit: responseData.unit,
              pieData: responseData.data,
              secondData: responseData.secondData?responseData.secondData:{}
            })
          }
        }
      })
    }
  }
  getCurViewDataForFresh = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = _.cloneDeep(this.state.showViewData.data)
      info.viewType = this.state.showViewData.viewType
      //info.api = this.state.showViewData.data.dataMethod
      wyAxiosPost('Dashboard/getModuleData',{info},(result)=>{
        const responseData = result.data.msg
        const curTime = []
        curTime.push(responseData.start_time)
        curTime.push(responseData.last_time)
        if(this._isMounted){
          this.setState({
            name: responseData.name,
            title: responseData.title,
            unit: responseData.unit,
            pieData: responseData.data,
            subTime: _.cloneDeep(curTime),
            secondData: responseData.secondData?responseData.secondData:{}
          })
        }
      })
    }
  }

  subTimeChange = (value,event)=>{
    if(this._isMounted){
      this.setState({
        subTime: value
      },()=>{
        this.getCurViewData()
      })
    }
  }
  //数据更新
  updateData = ()=>{
    if(this.pieTimer1){
      clearInterval(this.pieTimer1)
    }
    const run = ()=>{
      if(this.state.updateTime !== 0){
        if(this.pieTimer2){
          clearInterval(this.pieTimer2)
        }
        let time = this.state.updateTime
        this.pieTimer2 = setInterval(()=>{
          this.getCurViewDataForFresh()
        },time*1000)
        if(this.pieTimer1){
          clearInterval(this.pieTimer1)
        }
      }else{
        if(this.pieTimer2){
          clearInterval(this.pieTimer2)
        }
      }
    }
    this.pieTimer1 = setInterval(run,5000)
  }
  componentDidMount(){
    this._isMounted = true
    if(this._isMounted){
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
  }
  componentWillReceiveProps(nextProps){
    if(
      ! (_.isEqual(this.props.showViewData,nextProps.showViewData)) ||
      this.props.autoHeight !== nextProps.autoHeight ||
      (this.props.updateTime && nextProps.upDateTime && this.props.updateTime !== nextProps.upDateTime)
    ){
      if(this._isMounted){
        this.setState({
          showViewData: nextProps.showViewData,
          autoHeight: nextProps.autoHeight
        },()=>{
          this.getCurViewData()
          if(this.state.updateTime && this.props.env !== 'set'){
            this.updateData()
          }
        })
      }
    }
  }
  componentWillUnmount(){
    this._isMounted = false
    if(this.pieTimer1){
      clearInterval(this.pieTimer1)
    }
    if(this.pieTimer2){
      clearInterval(this.pieTimer2)
    }
  }
  // chartContextmenu = (params,dom,position,viewId)=>{
  //   $('.drcontainer').removeClass('dropShow').addClass('dropHide')
  //   $(dom).closest('.gridContainer').find('.drcontainer').removeClass('dropHide').addClass('dropShow')
  //   if(this.state.secondData){
  //     const {listType,objType} = this.state.secondData
  //     let info ={
  //       listType,
  //       start_time: this.state.subTime[0],
  //       last_time: this.state.subTime[1],
  //       obj: params.name,
  //       objType,
  //       previousPath:this.props.location.pathname
  //     }
  //     this.props.setDropListInfo({
  //        dropData: contextList(info),
  //        dropPosition: {x:position.x+"px",y:position.y+"px"},
  //        isexist: true
  //     })
  //   }
  // }
  render(){
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
            <div style={{float: "right",flex:"0 0 300px"}}>
              <WyDatePicker curTime={this.state.subTime} rangeTimeChange={this.subTimeChange}/>
            </div>
        </div>
      }
        <div className="moduleBody">
          <WySpin isSpining={this.state.isSpining}>
            <Pie
              name={this.state.name?this.state.name:''}
              title={this.state.title?this.state.title:''}
              unit={this.state.unit?this.state.unit:''}
              pieData={this.state.pieData?this.state.pieData:[]}
              height={this.state.autoHeight}
              //onContextmenu={this.chartContextmenu}
            />
          </WySpin>
        </div>
      </div>
    )
  }
}

export default withRouter(TemplateForPie)
