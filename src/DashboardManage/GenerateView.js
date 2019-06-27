/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React ,{ Component } from 'react'
import RGL, { WidthProvider } from "react-grid-layout"
import _ from 'lodash'
import { Button, Modal, Input, Select, message } from 'antd'

import { forName } from '../components/RegExp'
import { wyAxiosPost } from '../components/WyAxios'
import TemplateForLine from './TemplateForLine'
import TemplateForColumn from './TemplateForColumn'
import TemplateForTable from './TemplateForTable'
import TemplateForPie from './TemplateForPie'
import TemplateForMap from './TemplateForMap'
import TemplateForCalc from './TemplateForCalc'

import ModalTypeContainer from './ModalTypeContainer'
require('../../node_modules/react-grid-layout/css/styles.css')
require('../../node_modules/react-resizable/css/styles.css')
const ReactGridLayout = WidthProvider(RGL);
const Option = Select.Option
class GenerateView extends Component{
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

    setId:'',
    viewType:'',
    moduleName:'',
    dataMethod:'',
    updateTime:'0',

    visible: false,
    dataSourceList:[],
  }
  componentDidMount(){
    this._isMounted = true
    this.setState({
      modules: this.props.modules
    })
    // wyAxiosPost('Screen/getScreen',{},(result)=>{
    //   const responseData = result.data.msg.updateTime
    //   this.setState({
    //     updateTime: responseData
    //   })
    // })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.modules,nextProps.modules)){
      if(this._isMounted){
        this.setState({
          modules: _.cloneDeep(nextProps.modules)
        })
      }
    }
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
    }
  }
  showModal = (setId,viewType) => {
    if(this._isMounted){
      this.setState({
        setId,
        viewType
      },()=>{
        this.setState({
          visible: true
        })
      })
    }

    // this.state.modules.map((item,index)=>{
    //   if(item.id === id){
    //     this.setState({
    //       moduleName: this.state.modules[index].data?this.state.modules[index].data.moduleName:'',
    //       dataMethod: this.state.modules[index].data?this.state.modules[index].data.dataMethod:'',
    //     })
    //     return
    //   }
    // })
    // this.setState({
    //   visible: true,
    //   setId: id,
    //   viewType
    // },()=>{
      // wyAxiosPost('Screen/getScreenApi',{viewType: this.state.viewType},(result)=>{
      //   const responseData = result.data.msg
      //   this.setState({
      //     dataSourceList: _.cloneDeep(responseData)
      //   })
      // })
     //});
  }

  handleOk = (data) => {
    const erroList = []
    const validateField = (key)=>{
      if(key === 'name'){
        if(data[key] === '' || data[key] === undefined){
          erroList.push('名称不能为空')
        }
      }else if(key === 'app_name'){
        if(data[key] === '' || data[key] === undefined){
          erroList.push('应用不能为空')
        }
      }else if(key === 's_map'){
        if(data[key] === '' || data[key] === undefined){
          erroList.push('地图不能为空')
        }
      }else if(key === 's_city'){
        if(data[key] === '' || data[key] === undefined){
          erroList.push('城市不能为空')
        }
      }else if(key === 'field'){
        if(data[key] === '' || data[key] === undefined){
          erroList.push('字段不能为空')
        }
      }
    }
    const keys = Object.keys(data)
    if(keys && keys.length>0){
      keys.map(item=>{
        validateField(item)
      })
    }
    if(erroList.length === 0){
      this.props.doSetData(data)
      this.handleCancel()
    }else{
      let str = ''
      erroList.map((item,index)=>{
        str += index+1+'.'+item+'  '
      })
      message.warning(str)
    }
  }
  handleCancel = (e) => {
    if(this._isMounted){
      this.setState({
        visible: false,
        setId: '',
        viewType:'',
        moduleName:'',
        dataMethod:'',
      });
    }
  }
  // moduleNameChange = (e)=>{
  //   this.setState({
  //     moduleName: e.target.value
  //   })
  // }
  dataMethodChange = (value)=>{
    if(this._isMounted){
      let moduleName = ''
      for(let item of this.state.dataSourceList){
        if(value === item.api){
          moduleName = item.name
          break
        }
      }
      this.setState({
        dataMethod: value,
        moduleName
      })
    }
  }
  updateTimeChange = (value)=>{
    if(this._isMounted){
      this.setState({
        updateTime: value
      })
    }
  }

  //保存页面
  saveModules = ()=>{
    const info = {}
    info.modules = this.props.modules
    info.updateTime = this.state.updateTime
    info.id = this.props.id
    wyAxiosPost('Dashboard/saveModule',{info},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        this.props.onClose()
        message.success(responseData.msg)
      }else{
        message.warning(responseData.msg)
      }
    })

    // wyAxiosPost('Screen/saveScreen',{info},(result)=>{
    //   const responseData = result.data
    //   if(responseData.status === 1){
    //     this.props.closeWindow()
    //     message.success(responseData.msg)
    //   }else{
    //     message.warning(responseData.msg)
    //   }
    // })
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
                <div className="moduleHeader" style={{width: "100%",height:"50px",lineHeight:"50px"}}>
                  <span>{item.data?item.data.name:''}</span>
                  <span
                    style={{float:"right",display:"inline-block", cursor:"pointer"}}
                    title="删除此模块"
                    onClick={()=>{this.props.doDeleteModule(item.id)}}
                  >
                  <i className="fa fa-times" aria-hidden="true"></i>
                  </span>
                  <span
                    style={{float:"right",margin:"0 10px 0 0", cursor:"pointer"}}
                    title="模块设置"
                    onClick={()=>(this.showModal(item.id,item.viewType))}
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                  </span>
                </div>
                <TemplateForLine pageId={this.props.id} env="set" autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70} showViewData={_.cloneDeep(item)}/>
              </div>
            )
          }else if(item.viewType === 'column'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <div className="moduleHeader" style={{width: "100%",height:"50px",lineHeight:"50px"}}>
                  <span>{item.data?item.data.name:''}</span>
                  <span
                    style={{float:"right", cursor:"pointer"}}
                    title="删除此模块"
                    onClick={()=>{this.props.doDeleteModule(item.id)}}
                  >
                  <i className="fa fa-times" aria-hidden="true"></i>
                  </span>
                  <span
                    style={{float:"right",margin:"0 10px 0 0", cursor:"pointer"}}
                    title="模块设置"
                    onClick={()=>(this.showModal(item.id,item.viewType))}
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                  </span>
                </div>
                <TemplateForColumn pageId={this.props.id} env="set" autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70} showViewData={_.cloneDeep(item)}/>
              </div>
            )
          }else if(item.viewType === 'table'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <div className="moduleHeader" style={{width: "100%",height:"50px",lineHeight:"50px"}}>
                  <span>{item.data?item.data.name:''}</span>
                  <span
                    style={{float:"right", cursor:"pointer"}}
                    title="删除此模块"
                    onClick={()=>{this.props.doDeleteModule(item.id)}}
                  >
                  <i className="fa fa-times" aria-hidden="true"></i>
                  </span>
                  <span
                    style={{float:"right",margin:"0 10px 0 0", cursor:"pointer"}}
                    title="模块设置"
                    onClick={()=>(this.showModal(item.id,item.viewType))}
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                  </span>
                </div>
                <TemplateForTable pageId={this.props.id} env="set" autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70} showViewData={_.cloneDeep(item)}/>
              </div>
            )
          }else if(item.viewType === 'pie'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <div className="moduleHeader" style={{width: "100%",height:"50px",lineHeight:"50px"}}>
                  <span>{item.data?item.data.name:''}</span>
                  <span
                    style={{float:"right", cursor:"pointer"}}
                    title="删除此模块"
                    onClick={()=>{this.props.doDeleteModule(item.id)}}
                  >
                  <i className="fa fa-times" aria-hidden="true"></i>
                  </span>
                  <span
                    style={{float:"right",margin:"0 10px 0 0", cursor:"pointer"}}
                    title="模块设置"
                    onClick={()=>(this.showModal(item.id,item.viewType))}
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                  </span>
                </div>
                <TemplateForPie pageId={this.props.id} env="set" autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70} showViewData={_.cloneDeep(item)}/>
              </div>
            )
          }else if(item.viewType === 'map'){
             divArry.push(
               <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                 <div className="moduleHeader" style={{width: "100%",height:"50px",lineHeight:"50px"}}>
                   <span>{item.data?item.data.name:''}</span>
                   <span
                     style={{float:"right", cursor:"pointer"}}
                     title="删除此模块"
                     onClick={()=>{this.props.doDeleteModule(item.id)}}
                   >
                   <i className="fa fa-times" aria-hidden="true"></i>
                   </span>
                   <span
                     style={{float:"right",margin:"0 10px 0 0", cursor:"pointer"}}
                     title="模块设置"
                     onClick={()=>(this.showModal(item.id,item.viewType))}
                   >
                     <i className="fa fa-cog" aria-hidden="true"></i>
                   </span>
                 </div>
                 <TemplateForMap pageId={this.props.id} env="set" autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70} showViewData={_.cloneDeep(item)}/>
               </div>
            )
          }else if(item.viewType === 'calc'){
            divArry.push(
              <div style={{background: "rgba(0,0,0,0.4)",borderRadius:"5px",overflow:"hidden"}} key={item.id} data-grid={compiledPosition}>
                <div className="moduleHeader" style={{width: "100%",height:"50px",lineHeight:"50px"}}>
                  <span>{item.data?item.data.name:''}</span>
                  <span
                    style={{float:"right", cursor:"pointer"}}
                    title="删除此模块"
                    onClick={()=>{this.props.doDeleteModule(item.id)}}
                  >
                  <i className="fa fa-times" aria-hidden="true"></i>
                  </span>
                  <span
                    style={{float:"right",margin:"0 10px 0 0", cursor:"pointer"}}
                    title="模块设置"
                    onClick={()=>(this.showModal(item.id,item.viewType))}
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                  </span>
                </div>
                <TemplateForCalc pageId={this.props.id} env="set" autoHeight={compiledPosition?compiledPosition.h*30-10-70:13*30-10-70} showViewData={_.cloneDeep(item)}/>
              </div>
           )
          }
        }
      })
    }
    return divArry
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return (
      <div>
        <div style={{width: "100%",height:"30px",lineHeight:"30px", textAlign: "right"}}>
          <span style={{float:"left",marginLeft:"20px"}}>
            <span>数据更新间隔：</span>
            <span>
              <Select
                style={{minWidth:"120px"}}
                value={this.state.updateTime}
                onChange={this.updateTimeChange}
              >
                <Option value="0" key="mykey">不自动更新</Option>
                <Option value="60" key="60s">60s</Option>
                <Option value="300" key="300s">300s</Option>
              </Select>
            </span>
          </span>
          <Button size="small" type="primary" title="保存页面" onClick={this.saveModules} >保存</Button>
        </div>
        <ReactGridLayout
          {...this.props}
          draggableHandle=".moduleHeader"
          useCSSTransforms={true}
          onLayoutChange={this.onLayoutChange}
          style={{position: "relative"}}
          layout={this.state.layout}
        >
          {this.generatedView()}
        </ReactGridLayout>
        {
          // <Modal
          //   title="模块设置"
          //   visible={this.state.visible}
          //   onOk={this.handleOk}
          //   onCancel={this.handleCancel}
          // >
        }

          <ModalTypeContainer
            title="模块设置"
            visible={this.state.visible}
            handleCancel={this.handleCancel}
            handleOk={(data)=>this.handleOk(data)}
            viewType={this.state.viewType}
            setId={this.state.setId}
          />

          {
            //</Modal>
          }

      </div>
    )
  }
}


export default GenerateView
