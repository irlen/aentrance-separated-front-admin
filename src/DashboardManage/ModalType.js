/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, { Component } from 'react'
import { Button, Modal, Input, Select, InputNumber } from 'antd'

import { wyAxiosPost } from '../components/WyAxios'
import * as regions from './regions'
import mapList from './mapList'
const { Option } = Select
class ModalType extends Component{
  state = {
    visible: false,

    viewType:'',
    setId:'',
    xList:[],
    fieldList:[],
    indexList:[],
    s_mapList:[],
    s_cityList:[],
    top_count: 10,
  //for line
    name:'',
    x:'',
    y:'',
    cal_method:'',
    des:'', //描述
    field:'',
    app_name:'',
    s_map:"china",
    s_city:''

  }
  componentDidMount(){
    this._isMounted = true
    const { title, visible, viewType, setId } =  this.props
    this.getField()
    this.getIndexs()

    if(this._isMounted){
      this.setState({
        title,
        visible,
        viewType,
        setId,
        s_mapList: mapList,
        s_cityList: regions[this.state.s_map]
      })
    }
  }
  componentWillReceiveProps(nextProps){
    const {title, visible, viewType, setId } =  this.props
    const { modules } = nextProps
    if(
      viewType !== nextProps.viewType ||
      setId !== nextProps.setId ||
      title !== nextProps.title ||
      visible !== nextProps.visible
    ){
      if(this._isMounted){
        if(nextProps.visible === true){
          //回显字段
          let cur_module = {}
          if(modules && modules.length>0){
            for(let item of modules){
              if(item.id === nextProps.setId){
                cur_module = item
                break
              }
            }
          }
          this.setState({
            title:nextProps.title,
            visible: nextProps.visible,
            viewType: nextProps.viewType,
            setId: nextProps.setId,
            s_mapList: mapList,
            s_cityList: regions[this.state.s_map]
          },()=>{
            //***********************************************************************此处判断各个视图类型的字段回显
            if(nextProps.viewType === 'map'){
              const {name,s_map,app_name,s_city,field,des} = cur_module.data
              this.setState({
                name,s_map,app_name,s_city,field,des
              })
            }else if(nextProps.viewType === 'pie' || nextProps.viewType === 'column'){
              let {name,field,top_count,des} = cur_module.data
              if(!top_count){
                top_count = 10
              }
              this.setState({
                name,field,top_count,des
              })
            }
          })
        }else{
          this.setState({
            visible: nextProps.visible,
            title: nextProps.title,
            viewType: nextProps.viewType,
            setId: nextProps.setId,
            s_mapList: mapList,
            s_cityList: regions[this.state.s_map]
          })
        }
      }
    }
  }
  //Input类型传值
  dataChange=(value,field)=>{
    this.setState({
      [field]: value.target.value
    })
  }
  selectChange = (value,field)=>{
    const newCustoms = []
    if(this._isMounted){
      if(field === 's_map'){
        this.setState({
          [field]: value,
          s_city:'',
          s_cityList: regions[value]
        })
        return
      }
      this.setState({
        [field]: value
      })
    }
  }


  //获取字段列表
  getField = ()=>{
    wyAxiosPost('Dashboard/getIndexsField',{id: this.props.id},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          fieldList: responseData
        })
      }
    })
  }
  //获取当前Id对应应用
  getIndexs = ()=>{
    wyAxiosPost('Dashboard/getIndexs',{id: this.props.id},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          indexList: responseData
        })
      }
    })
  }
  doSubmit = ()=>{
    let data = {}
    const { setId, viewType } = this.state
    //*********************************************************************************************************按照视图类型提交数据到 redux
    if(viewType === 'map'){
      const { name,s_map,app_name,s_city,field,des } = this.state
      data = { setId,name,s_map,app_name,s_city,field,des }
    }else if(viewType === 'pie' || viewType === 'column'){
      const { name,field,top_count,des } = this.state
      data = { setId,name,field,top_count,des }
    }
    this.props.handleOk(data)
  }
  handleCancel = ()=>{
    if(this._isMounted){
      this.setState({
        name:'',
        x:'',
        y:'',
        cal_method:'',
        des:'', //描述
        field:'',
        app_name:'',
        s_map:"china",
        s_city:''
      },()=>{
        this.props.handleCancel()
      })
    }
  }


  generateList = ()=>{
    const {s_mapList, s_cityList, fieldList} = this.state
    const domList = []
    const viewType = this.state.viewType
    const name = <div key="name" css={{display:"flex",marginTop:"10px"}}>
                  <div css={{flex:"0 0 100px"}}>名称：</div>
                  <div css={{flex:"1 1 auto"}}>
                    <Input value={this.state.name} onChange={(value)=>{this.dataChange(value,'name')}}/>
                  </div>
                </div>
    const x = <div key="x" css={{display:"flex",marginTop:"10px"}}>
                <div css={{flex:"0 0 100px"}}>X轴：</div>
                <div css={{flex:"1 1 auto"}}>
                  <Input value={this.state.x} onChange={(value)=>{this.dataChange(value,'x')}}/>
                </div>
              </div>
    const y = <div key="y" css={{display:"flex",marginTop:"10px"}}>
                <div css={{flex:"0 0 100px"}}>Y轴：</div>
                <div css={{flex:"1 1 auto"}}>
                  <Input value={this.state.y} onChange={(value)=>{this.dataChange(value,'y')}}/>
                </div>
              </div>
    const cal_method = <div key="cal_method" css={{display:"flex",marginTop:"10px"}}>
                          <div css={{flex:"0 0 100px"}}>计算方式：</div>
                          <div css={{flex:"1 1 auto"}}>
                            <Select css={{width:"100%"}} value={this.state.cal_method} onChange={(value)=>{this.dataChange(value,'y')}}>
                              <Option key='count' value='count'>统计个数</Option>
                              <Option key='sum' value='sum'>求和</Option>
                              <Option key='max' value='max'>最大值</Option>
                              <Option key='min' value='min'>最小值</Option>
                              <Option key='avg' value='avg'>平均值</Option>
                            </Select>
                          </div>
                        </div>
    const field = <div key="field" css={{display:"flex",marginTop:"10px"}}>
                          <div css={{flex:"0 0 100px"}}>字段：</div>
                          <div css={{flex:"1 1 auto"}}>
                            <Select css={{width:"100%"}} value={this.state.field} onChange={(value)=>{this.selectChange(value,'field')}}>
                              {
                                fieldList && fieldList.length>0?
                                fieldList.map(item=>{
                                  return <Option key={item} value={item} title={item}>{item}</Option>
                                })
                                :
                                ''
                              }
                            </Select>
                          </div>
                        </div>
    const des = <div key="des" css={{display:"flex",marginTop:"10px"}}>
                  <div css={{flex:"0 0 100px"}}>描述：</div>
                  <div css={{flex:"1 1 auto"}}>
                    <Input value={this.state.des} onChange={(value)=>{this.dataChange(value,'des')}}/>
                  </div>
                </div>
    const app_name = <div key="app_name" css={{display:"flex",marginTop:"10px"}}>
                          <div css={{flex:"0 0 100px"}}>应用：</div>
                          <div css={{flex:"1 1 auto"}}>
                            <Select
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              css={{width:"100%"}}
                              value={this.state.app_name}
                              onChange={(value)=>{this.selectChange(value,'app_name')}}>
                              {
                                this.state.indexList && this.state.indexList.length>0?
                                this.state.indexList.map(item=>{
                                  return <Option key={item} value={item} title={item}>{item}</Option>
                                })
                                :
                                ''
                              }
                            </Select>
                          </div>
                        </div>
    const s_map = <div key="s_map" css={{display:"flex",marginTop:"10px"}}>
                          <div css={{flex:"0 0 100px"}}>地图：</div>
                          <div css={{flex:"1 1 auto"}}>
                            <Select
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              css={{width:"100%"}}
                              value={this.state.s_map}
                              onChange={(value)=>{this.selectChange(value,'s_map')}}
                            >
                                {
                                  s_mapList && s_mapList.length>0?
                                  s_mapList.map(item=>{
                                    return <Option key={item.value} value={item.value} title={item.name}>{item.name}</Option>
                                  })
                                  :
                                  ''
                                }
                              </Select>
                          </div>
                        </div>
    const s_city = <div key="s_city" css={{display:"flex",marginTop:"10px"}}>
                          <div css={{flex:"0 0 100px"}}>所在城市：</div>
                          <div css={{flex:"1 1 auto"}}>
                            <Select
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              css={{width:"100%"}}
                              value={this.state.s_city}
                              onChange={(value)=>{this.selectChange(value,'s_city')}}>
                              {
                                s_cityList && s_cityList.length>0?
                                s_cityList.map((item,index)=>{
                                  return <Option key={index} value={item.name} title={item.name}>{item.name}</Option>
                                })
                                :
                                ''
                              }
                            </Select>
                          </div>
                        </div>
    const top_count = <div key="app_name" css={{display:"flex",marginTop:"10px"}}>
                          <div css={{flex:"0 0 100px"}}>Top条数：</div>
                          <div css={{flex:"1 1 auto"}}>
                            <InputNumber min={1} defaultValue={10} onChange={(value)=>{this.selectChange(value,'top_count')}} />
                          </div>
                        </div>
    //***********************************************************************此处根据各个视图类型生成字段列表
    if(viewType === 'map'){
      domList.push(name,s_map,app_name,s_city,field,des)
    }else if(viewType === 'pie' || viewType === 'column'){
      domList.push(name,field,top_count,des)
    }
    return domList
  }
  render(){
    return (
      <Modal
        title={this.state.title}
        visible={this.state.visible}
        onOk={this.doSubmit}
        onCancel={this.handleCancel}
      >
        {
          this.generateList()
        }
      </Modal>
    )
  }
}

export default ModalType
