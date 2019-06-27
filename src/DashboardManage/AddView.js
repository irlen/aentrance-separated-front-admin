/** @jsx jsx */
import React ,{ Component } from 'react'
import { Button, Row, Col, Input, Select, message } from 'antd'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import _ from 'lodash'
import $ from 'jquery'
import { Scrollbars } from 'react-custom-scrollbars'

import { wyAxiosPost } from '../components/WyAxios'
import GenerateViewContainer from './GenerateViewContainer'

class AddView extends Component{
  static defaultProps = {
    className: "layout",
    cols: 24,
    margin:[10,10],
    rowHeight: 20,
    autoSize: true,
    onLayoutChange: function(){}
  }
  state = {
    visible: false,
    sHeight: '0px',
    layout: [],
    modules:[]
  }
  componentDidMount(){
    this._isMounted  = true
    const windowH = parseInt(document.body.clientHeight,0)-104
    if(this._isMounted){
      this.setState({
        sHeight: windowH+'px'
      })
    }
    $(window).resize(()=>{
      const rwindowH = parseInt(document.body.clientHeight,0)-104
      if(this._isMounted){
        this.setState({
          sHeight: rwindowH+'px'
        })
      }
    })
  }
  componentWillReceiveProps(nextProps){
    const modules = nextProps.modules
    if(this._isMounted){
      this.setState({
        modules
      })
    }
  }
  //拖放事件
  dropEvent =  (event)=>{
    const e = event || window.event
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("viewattr"));
    //随机数作为id
    const randomCount = Math.random();
    const curTime = new Date().getTime();
    const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
    const id = asId.toString()
    data.id = id
    data.position = {
      i:id,
      h:13,
      w:12,
      x:0,
      y:0
    }
    data.data = {}
    this.props.doAdd(data)
  }
  dragOverEvent = (event)=>{
    const e = event || window.event
    e.preventDefault();
  }
  dragStartEvent = (event)=>{
    const e = event || window.event
    e.dataTransfer.setData("viewattr",e.target.getAttribute('viewattr'));
  }
  render(){
    return (
      <div style={{display: "flex"}}>
        <div style={{flex:"0 0 100px"}}>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height:this.state.sHeight,borderRight:"rgba(255,255,255,0.2) solid 1px"}}
          >
              <ul style={{padding: "2px 20px 2px 20px"}}>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/map.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"map"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/line.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"line"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/bar.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"bar"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/column.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"column"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/pie.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"pie"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/table.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"table"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{width:"100%",height:"100px",cursor:"move"}}
                  >
                    <img
                      src={require("../asets/calc.png")} alt="" width="100%"
                      draggable={true}
                      viewattr='{"viewType":"calc"}'
                      onDragStart={this.dragStartEvent}
                    />
                  </div>
                </li>
              </ul>
          </Scrollbars>
        </div>
        <div style={{flex:"1 1 auto"}}>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height:this.state.sHeight}}
            onDrop={this.dropEvent}
            onDragOver={this.dragOverEvent}
            >
            {
              <GenerateViewContainer onClose={this.props.onClose}/>
            }

          </Scrollbars>
        </div>
      </div>
    )
  }
}


export default AddView
