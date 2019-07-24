/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React ,{ Component } from 'react'
import { Row, Col, Button, Popconfirm, Input, Modal, Select, message } from 'antd'
import _ from 'lodash'

import WyTable from '../components/WyTable'
import WySpin from '../components/WySpin'
import { wyAxiosPost } from '../components/WyAxios'

const { Search } = Input
const { Option } = Select
class UserManage extends Component{

  state = {
    xData: [],
    yData:[],
    ids: [],
    visible: false,
    id:"",
    isSpining: false,
    useranme:"",
    role:"2",
    password:"",
    pageSize: 10
  }
  getTable = ()=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('User/getUserList',{},result=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      curxData.push({
        title: '操作',
        dataIndex: 'edit',
        render: (text, record, index)=>{
          if(record.id === "1"){
            return <span>
              <span title="编辑" style={{cursor:"pointer"}} >
                <i className="fa fa-pencil-square" aria-hidden="true"></i>
              </span>
            </span>
          }else{
            return <span>
              <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>{this.editUser(record.id)}} >
                <i className="fa fa-pencil-square" aria-hidden="true"></i>
              </span>
            </span>
          }
        }
      })
      if(this._isMounted){
          this.setState({
            xData: curxData,
            yData: _.cloneDeep(responseData.yyy),
            isSpining: false
          })
        }
      })
  }
  componentDidMount(){
    this._isMounted = true
    this.getTable()

  }



  showModal = () => {
    if(this._isMounted){
      this.setState({
        visible: true
      })
    }
  }

  handleCancel = e => {
    if(this._isMounted){
      this.setState({
        visible: false,
        password:"",
        username:"",
        role:"2"
      })
    }
  }
  delUser = ()=>{
    wyAxiosPost('User/delUser',{ids:this.state.ids},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        this.getTable()
        message.success(responseData.msg)
      }else{
        message.warning(responseData.msg)
      }
    })
  }

  addUser = ()=>{
    this.setState({
      id: ""
    },()=>{
      this.showModal()
    })
  }
  editUser = (id)=>{
    this.setState({
      id
    },()=>{
      wyAxiosPost('User/getUserById',{id},(result)=>{
        const responseData = result.data.msg
        const {username,role,password} = result.data.msg
        if(this._isMounted){
          this.setState({
            username,
            password,
            role
          },()=>{
            this.showModal()
          })
        }
      })
    })
  }
  inputChange = (value,field)=>{
    if(this._isMounted){
      this.setState({
        [field]: value
      })
    }
  }
  saveUser = ()=>{
    const {username,password,role} = this.state
    const erroList = []
    if(username === ''){
      erroList.push('名称不能为空')
    }
    if(password === ''){
      erroList.push('密码不能为空')
    }
    if(erroList.length === 0){
      wyAxiosPost('User/saveUser',{id: this.state.id},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          this.getTable()
          this.handleCancel()
          message.success(responseData.msg)
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
  tableChange = (pagination)=>{
    if(this._isMounted){
      this.setState({
        pageSize: pagination.pageSize
      })
    }
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
      },
      getCheckboxProps: record => ({
        disabled: record.id === '1', // Column configuration not to be checked
        name: record.name,
      }),
    }
    return (
      <div>
        <Row gutter={16}>
          <Col>
            <div css={{display:"flex"}}>
              <div css={{flex:"1 1 auto"}}>
              <Search
                 placeholder="输入用户名称或角色搜索"
                 onSearch={(value)=>{this.doSearch(value)}}
                 style={{ width: 200 }}
                 onChange={(value)=>{this.reset(value)}}
               />
              </div>
              <div css={{flex:"0 0 240px"}}>
                <Button onClick={this.addUser} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加用户</span></Button>
                <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delUser:()=>{}} okText="确定" cancelText="取消">
                  <Button style={{marginLeft: "10px"}}>
                    <i className="fa fa-minus-square-o" aria-hidden="true"></i>
                    <span style={{marginLeft:"5px"}}>删除</span>
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </Col>
        </Row>
        <Row css={{marginTop:"20px"}}>
          <Col>
            <WySpin isSpining={this.state.isSpining}>
              <WyTable
                rowSelection={rowSelection}
                xData={this.state.xData}
                yData={this.state.yData}
                pageSize={this.state.pageSize}
                tableChange={this.tableChange}
              />
            </WySpin>
          </Col>
        </Row>
        <Modal
            title="用户"
            visible={this.state.visible}
            onOk={this.saveUser}
            onCancel={this.handleCancel}
          >
            <div style={{display:"flex",margin:"10px 0 10px 0"}}>
              <div style={{flex:"0 0 60px"}}>用户名</div>
              <div style={{flex:"1 1 auto"}}>
                <Input
                  onChange={(e)=>{this.inputChange(e.target.value,'username')}}
                  value={this.state.username}
                />
              </div>
            </div>
            <div style={{display:"flex",margin:"10px 0 10px 0"}}>
              <div style={{flex:"0 0 60px"}}>密码</div>
              <div style={{flex:"1 1 auto"}}>
              <Input.Password
                onChange={(e)=>{this.inputChange(e.target.value,'password')}}
                value={this.state.password}
              />
              </div>
            </div>
            <div style={{display:"flex",margin:"10px 0 10px 0"}}>
              <div style={{flex:"0 0 60px"}}>角色</div>
              <div style={{flex:"1 1 auto"}}>
                <Select
                  style={{width:"100%"}}
                  onChange={(value)=>{this.inputChange(value,'role')}}
                  value={this.state.role}
                >
                  <Option value="2" key="2">普通用户</Option>
                  <Option value="1" key="1">超级管理员</Option>
                </Select>
              </div>
            </div>
          </Modal>
      </div>
    )
  }
}




export default UserManage
