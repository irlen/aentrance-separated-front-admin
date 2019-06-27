/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import RGL, { WidthProvider } from "react-grid-layout"
import _ from 'lodash'
import { Icon, Button, Modal, Input, Select, message } from 'antd'
import { Link } from 'react-router-dom'

import { wyAxiosPost } from '../components/WyAxios'
import TemplateForLine from './TemplateForLine'
import TemplateForColumn from './TemplateForColumn'
import TemplateForTable from './TemplateForTable'
import TemplateForPie from './TemplateForPie'
import TemplateForMap from './TemplateForMap'
import TemplateForCalc from './TemplateForCalc'
import DropList from '../components/DropList'
import { setPosition } from '../actions'
require('../../node_modules/react-grid-layout/css/styles.css')
require('../../node_modules/react-resizable/css/styles.css')
const ReactGridLayout = WidthProvider(RGL);
const Option = Select.Option


class Detail extends Component{
  static defaultProps = {
    className: "layout",
    cols: 24,
    margin:[10,10],
    rowHeight: 20,
    autoSize: true,
    onLayoutChange: function(){}
  }
  state = {
    modules:[],
    layout:[],
    updateTime: 0,
    dropListInfo: {
     dropData: [],
     dropPosition: {x:"0px",y:"0px"},
     isexist: false
   }
  }
  getAllViewData = ()=>{
    const { id } = this.props
    wyAxiosPost('Dashboard/getDashboard',{id},(result)=>{
      const responseData = JSON.parse(_.cloneDeep(result.data.msg.modules))
      const positions = []
      if(responseData && responseData.length>0){
        responseData.map(item=>{
          let initPo = _.cloneDeep(item.position)
          initPo.h = parseInt(initPo.h,10)
          initPo.w = parseInt(initPo.w,10)
          initPo.x = parseInt(initPo.x,10)
          initPo.y = parseInt(initPo.y,10)
          const { i, h, w, x, y } = initPo
          positions.push({i,h,w,x,y})
        })
      }
      const updateTime = parseInt(result.data.msg.updateTime,10)
      if(this._isMounted){
        this.setState({
          modules: _.cloneDeep(responseData),
          layout: positions,
          updateTime
        })
      }
    })
  }
  //数据更新
  updateData = ()=>{
    if(window.mapTimer1){
      clearInterval(window.mapTimer1)
    }
    const run = ()=>{
      if(this.state.updateTime !== 0){
        if(window.mapTimer2){
          clearInterval(window.mapTimer2)
        }
        const time = this.state.updateTime
        window.mapTimer2 = setInterval(()=>{
          this.getAllViewData()
        },time*1000)
        if(window.mapTimer1){
          clearInterval(window.mapTimer1)
        }
      }else{
        if(window.mapTimer2){
          clearInterval(window.mapTimer2)
        }
      }
    }
    window.mapTimer1 = setInterval(run,5000)
  }
  componentDidMount(){
    this._isMounted = true
    this.getAllViewData()
    //this.updateData()
  }
  componentWillReceiveProps(nextProps){
    if(this.props.isRefresh !== nextProps.isRefresh){
      this.getAllViewData()
    //  this.updateData()
    }
  }
  componentWillUnmount(){
    this._isMounted = false
    // if(window.mapTimer1){
    //   clearInterval(window.mapTimer1)
    // }
    // if(window.mapTimer2){
    //   clearInterval(window.mapTimer2)
    // }
  }
  onLayoutChange = (layout)=>{
    const newLayout = []
    if(layout && layout.length>0){
      layout.map(item=>{
        const {i,h,w,x,y} = item
        newLayout.push({i,h,w,x,y})
      })
    }
    if(newLayout.length>0){
      this.props.doSetPosition(newLayout)
      //先存下modules，更新位置后再取出來

      // wyAxiosPost('Screen/getScreen',{},(result)=>{
      //   const responseData = result.data.msg
      //   this.setState({
      //     modules: _.cloneDeep(responseData)
      //   })
      // })
    }
  }


  generatedView =()=>{
    let divArry = []
    if(this.state.modules && this.state.modules.length>0){
      this.state.modules.map((item,index)=>{
        let compiledPosition = {}
        if(item.position){
          const h = parseInt(item.position.h)
          const w = parseInt(item.position.w)
          const x = parseInt(item.position.x)
          const y = parseInt(item.position.y)
          compiledPosition = Object.assign({},{h,w,x,y})
        }
        if(Object.keys(compiledPosition).length > 0){
          if(item.viewType === 'line' || item.viewType === 'bar'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <TemplateForLine
                  pageId={this.props.id}
                  autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70}
                  showViewData={_.cloneDeep(item)}
                  updateTime={this.state.updateTime}
                  setDropListInfo={(value)=>this.setDropListInfo(value)}
                />
              </div>
            )
          }else if(item.viewType === 'column'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition} >
                <TemplateForColumn
                  pageId={this.props.id}
                  autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70}
                  showViewData={_.cloneDeep(item)}
                  updateTime={this.state.updateTime}
                  setDropListInfo={(value)=>this.setDropListInfo(value)}
                />
              </div>
            )
          }else if(item.viewType === 'table'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <TemplateForTable
                  pageId={this.props.id}
                  autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70}
                  showViewData={_.cloneDeep(item)}
                  updateTime={this.state.updateTime}
                  setDropListInfo={(value)=>this.setDropListInfo(value)}
                />
              </div>
            )
          }else if(item.viewType === 'pie'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <TemplateForPie
                  pageId={this.props.id}
                  autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70}
                  showViewData={_.cloneDeep(item)}
                  updateTime={this.state.updateTime}
                  setDropListInfo={(value)=>this.setDropListInfo(value)}
                />
              </div>
            )
          }else if(item.viewType === 'map'){
           divArry.push(
            <div style={{background: "rgba(0,0,0,0.2)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
              <TemplateForMap
                pageId={this.props.id}
                autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70}
                showViewData={_.cloneDeep(item)}
                updateTime={this.state.updateTime}
              />
            </div>
            )
          }else if(item.viewType === 'calc'){
           divArry.push(
            <div style={{background: "rgba(0,0,0,0.2)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
              <TemplateForCalc
                pageId={this.props.id}
                autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70}
                showViewData={_.cloneDeep(item)}
                updateTime={this.state.updateTime}
                setDropListInfo={(value)=>this.setDropListInfo(value)}
              />
            </div>
            )
          }
        }
      })
    }
    return divArry
  }
  setDropListInfo = (value)=>{
    if(this._isMounted){
      this.setState({
        dropListInfo:value
      })
    }
  }
  render(){
    const {dropData,dropPosition,isexist}  = this.state.dropListInfo
    return(
      <div className="gridContainer">
        <Link  css={{position:"fixed", top:"70px",right:"20px",zIndex:100000}} to={'/app/dashboard/dashboardmanage/null'}>
          <Button type="primary" size="small">
            <i className="fa fa-chevron-left" aria-hidden="true"></i> <span css={{display:"inline-block",marginLeft:"10px"}}>返回</span>
          </Button>
        </Link>
        {
          this.state.layout && this.state.layout.length>0?
          <ReactGridLayout
            {...this.props}
            draggableHandle=".moduleHeader"
            useCSSTransforms={true}
            onLayoutChange={this.onLayoutChange}
            style={{position: "relative"}}
            isDraggable={false}
            isResizable={false}
            layout={this.state.layout}
          >
            {
              this.generatedView()
            }
          </ReactGridLayout>
          :
          ''
        }
        <DropList
          dropPosition={dropPosition}
          dropData={dropData}
          isexist={isexist}
        />
      </div>
    )
  }
}


const mapStateToProps  = (state)=>({
  modules: state.homeview.modules
})
const mapDispatchToProps = (dispatch)=>({
  doSetPosition : (positions)=>{
    dispatch(setPosition(positions))
  }
})


export default connect(mapStateToProps,mapDispatchToProps)(Detail)
