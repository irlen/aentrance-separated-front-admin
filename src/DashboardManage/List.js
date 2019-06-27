/** @jsx jsx */
import React ,{ Component } from 'react'
import { Drawer, Button, Row, Col, Input, Tabs, Select, Popconfirm, message, Modal } from 'antd'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { initModules } from '../actions'
import { Amodule } from '../components/Amodule'
import WySpin from '../components/WySpin'
import WyTable from '../components/WyTable'
import { wyAxiosPost } from '../components/WyAxios'
import { forName } from '../components/RegExp'
import AddViewContainer from './AddViewContainer'

const { Option } = Select
class List extends Component{
  state = {
    ids:[],
    id:'',
    pageSize: 10,
    visible: false,
    d_name:'',
    d_indexs:[],
    d_des:'',
    indexList:'',
    xData:[],
    yData:[],

    dvisible: false,
  }
  componentDidMount(){
    this._isMounted = true
    this.getIndex()
    this.getDashboardList()
  }
  getDashboardList = ()=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Dashboard/getDashboard',{},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      curxData.push({
        title: '操作',
        dataIndex: 'edit',
        render: (text, record, index)=>(
          <span>
            <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>this.editDashboard(record.id)}>
              <i className="fa fa-pencil-square" aria-hidden="true"></i>
            </span>
            <span title="添加视图" style={{cursor:"pointer",color: "#00CC66",margin:"0 10px 0 10px"}} onClick={()=>this.addView(record.id)}>
              <i className="fa fa-plus-square" aria-hidden="true"></i>
            </span>
            <Link to={`/app/dashboard/dashboardmanage/${record.id}`}>
              <span title="查看仪表板" style={{cursor:"pointer",color: "#00CC66"}}>
                <i className="fa fa-area-chart" aria-hidden="true"></i>
              </span>
            </Link>
          </span>
        )
      })
      if(this._isMounted){
        this.setState({
          xData: curxData,
          yData: responseData.yyy,
          isSpining: false
        })
      }
    })
  }
  editDashboard = (id)=>{
    if(this._isMounted){
      this.setState({
        id
      },()=>{
        wyAxiosPost('Dashboard/getDashboard',{id},(result)=>{
          const responseData = result.data.msg
          const { d_indexs, d_name, d_des } = responseData
          if(this._isMounted){
            this.setState({
              d_indexs,
              d_name,
              d_des
            },()=>{this.showModal()})
          }
        })
      })
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = e => {
    //合法性校验
    const erroList = []
    const { d_name, d_indexs, d_des, id } = this.state
    if(d_name === ''){
      erroList.push('仪表板名称不能为空')
    }else if(! forName.test(d_name)){
      erroList.push('仪表板名称格式不正确')
    }
    if(d_indexs.length === 0){
      erroList.push('应用不能为空')
    }
    const info = {d_name,d_indexs,d_des, id}
    if(erroList.length === 0){
      wyAxiosPost('Dashboard/saveDashboard',{info},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          this.getDashboardList()
          this.handleCancel()
        }else{
          message.warning(responseData.msg)
        }
      })
    }else{
      let str = ''
      erroList.map((item,index)=>{
        str += index+1+'.'+item+'  '
      })
      message.warning(str)
    }
  }
  pageSizeChange = (current, size)=>{
    if(this._isMounted){
      this.setState({
        pageSize: size
      })
    }
  }

  handleCancel = e => {
    this.setState({
      visible: false,
      d_name:'',
      d_indexs:[],
      d_des:'',
      id:''
    })
  }
  d_indexsChange = (value)=>{
    if(this._isMounted){
      this.setState({
        d_indexs: value
      })
    }
  }
  d_nameChange = (e)=>{
    if(this._isMounted){
      this.setState({
        d_name: e.target.value
      })
    }
  }
  d_desChange = (e)=>{
    if(this._isMounted){
      this.setState({
        d_des: e.target.value
      })
    }
  }
  //获取所有索引
  getIndex = ()=>{
    wyAxiosPost('Elastic/getAllIndex',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted && responseData && responseData.length>0){
        this.setState({
          indexList: responseData,
        })
      }
    })
  }
  onClose = ()=>{
    this.setState({
      dvisible: false
    })
  }
  //添加视图相关
  showDrawer = ()=>{
    this.setState({
      dvisible: true
    })
  }
  addView = (id)=>{
    if(this._isMounted){
      this.setState({
        id
      },()=>{
        wyAxiosPost('Dashboard/getDashboard',{id: this.state.id},(result)=>{
          console.log(result.data.msg)
          const responseData = result.data.msg
          const modules = responseData.modules?JSON.parse(responseData.modules):[]
          const pageData = {modules,id}
          this.props.doInitModules(pageData)
          this.showDrawer()
        })
      })
    }
  }
  //删除
  delSource = ()=>{
    if(this.state.ids.length === 0){
      message.warning('请选择要删除的项')
    }else{
      wyAxiosPost('Dashboard/delDashboard',{ids: this.state.ids},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          if(this._isMounted){
            this.setState({
              ids: []
            },()=>{
              this.getDashboardList()
            })
          }
        }else{
          message.warning(responseData.msg)
        }
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const selectedRowKeys = this.state.ids
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        if(this._isMounted){
          this.setState({
            ids: selectedRowKeys
          })
        }
      }
    }
    return(
      <div>
        <Amodule>
            <Row>
              <Col>
                <Button onClick={this.showModal} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加</span></Button>
                <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delSource:()=>{}} okText="确定" cancelText="取消">
                  <Button style={{marginLeft: "10px"}}>
                    <i className="fa fa-minus-square-o" aria-hidden="true"></i>
                    <span style={{marginLeft:"5px"}}>删除</span>
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
            <Row>
              <Col>
                <div css={{paddingTop:"10px"}}>
                  <WySpin isSpining={this.state.isSpining}>
                    <WyTable
                        pageSize={this.state.pageSize}
                        onShowSizeChange={this.pageSizeChange}
                        rowSelection={rowSelection}
                        xData={this.state.xData?this.state.xData:[]}
                        yData={this.state.yData?this.state.yData:[]}
                      />
                  </WySpin>
                </div>
              </Col>
            </Row>
        </Amodule>
        <Modal
          title={this.state.id === ''?'添加仪表板':'修改仪表板'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div css={{display: "flex",marginTop:"10px"}}>
            <div css={{flex:"0 0 100px"}}>名称：</div>
            <div css={{flex:"1 1 auto"}}><Input value={this.state.d_name} onChange={this.d_nameChange}/></div>
          </div>
          <div css={{display: "flex",marginTop:"10px"}}>
            <div css={{flex:"0 0 100px"}}>应用：</div>
            <div css={{flex:"1 1 auto"}}>
              <Select
                mode="multiple"
                placeholder="Please select"
                style={{ width: '100%' }}
                onChange={this.d_indexsChange}
                value={this.state.d_indexs}
              >
                {
                  this.state.indexList && this.state.indexList.length>0?
                  this.state.indexList.map(item=>{
                    return <Option title={item} value={item} key={item}>{item}</Option>
                  })
                  :
                  ''
                }
              </Select>
            </div>
          </div>
          <div css={{display: "flex",marginTop:"10px"}}>
            <div css={{flex:"0 0 100px"}}>描述：</div>
            <div css={{flex:"1 1 auto"}}><Input value={this.state.d_des} onChange={this.d_desChange}/></div>
          </div>
        </Modal>
        <Drawer
          title="添加视图"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.dvisible}
          closable={true}
          width="90%"
        >
          <AddViewContainer onClose={this.onClose}/>
        </Drawer>
      </div>
    )
  }
}
const mapDispatchToProps = (dispatch)=>({
  doInitModules: (modulesData)=>{
    dispatch(initModules(modulesData))
  }
})
export default connect(null,mapDispatchToProps)(List)
