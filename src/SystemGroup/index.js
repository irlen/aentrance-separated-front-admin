/** @jsx jsx */
import React ,{ Component } from 'react'
import { Button, Row, Col, Input, Tabs, Select, Popconfirm, message, Modal } from 'antd'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import _ from 'lodash'

import  WyTable  from '../components/WyTable'
import { Amodule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import WySpin from '../components/WySpin'

class SystemGroup extends Component{
  state = {
    ids:[],
    visible: false,
    modalVisible: false,
    g_name:'',
    g_des:'',
    id:'',
  }
  componentDidMount(){
    this._isMounted = true
    this.getGroup()
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  //保存分组
  handleOk = e => {
    const { g_name,g_des,id } = this.state
    if(g_name === ''){
      message.warning('组名不能为空')
    }else{
      const info = {g_name,g_des,id}
      wyAxiosPost('Group/saveGroup',{info},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          this.handleCancel()
          this.getGroup()
        }else{
          message.warning(responseData.msg)
        }
      })
    }
  }

  //获取分组
  getGroup = ()=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Group/getGroup',{},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      curxData.push({
        title: '操作',
        dataIndex: 'edit',
        render: (text, record, index)=>{
          return record.status === '1'?
          <span>
            <span title="不可编辑" style={{cursor:"pointer"}}>
              <i className="fa fa-pencil-square" aria-hidden="true"></i>
            </span>
          </span>
          :
          <span>
            <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>this.editGroup(record.id)}>
              <i className="fa fa-pencil-square" aria-hidden="true"></i>
            </span>
          </span>
        }


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
  //编辑分组
  editGroup = (id)=>{
    wyAxiosPost('Group/getGroup',{id},(result)=>{
      const responseData = result.data.msg
      const { g_name, g_des } = responseData
      if(this._isMounted){
        this.setState({
          g_name,
          g_des,
          id
        },()=>{
          this.showModal()
        })
      }
    })
  }
  //删除分组
  delGroup = ()=>{
    if(this.state.ids.length === 0){
      message.warning('请选择要删除的项')
    }else{
      wyAxiosPost('Group/delGroup',{ids: this.state.ids},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          if(this._isMounted){
            this.setState({
              ids: []
            },()=>{
              this.getGroup()
            })
          }
        }else if(responseData.status === 0){
          message.warning(responseData.msg)
        }
      })
    }
  }

  handleCancel = e => {
    if(this._isMounted){
      this.setState({
        visible: false,
        g_name:'',
        g_des:''
      });
    }
  };

  g_nameChange = (e)=>{
    if(this._isMounted){
      this.setState({
        g_name: e.target.value
      })
    }
  }
  g_desChange = (e)=>{
    if(this._isMounted){
      this.setState({
        g_des: e.target.value
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
      },
      getCheckboxProps: record => ({
        disabled: record.status === '1', // Column configuration not to be checked
        name: record.name,
      }),
    }
    return(
      <div>
        <Amodule>
            <Row>
              <Col>
                <Button onClick={this.showModal} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加</span></Button>
                <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delGroup:()=>{}} okText="确定" cancelText="取消">
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
          title="添加分组"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div css={{display:"flex",marginTop:"10px"}}>
            <div css={{flex:"0 0 80px"}}>组名：</div>
            <div css={{flex:"1 1 auto"}}>
              <Input value={this.state.g_name} onChange={this.g_nameChange}/>
            </div>
          </div>
          <div css={{display:"flex",marginTop:"10px"}}>
            <div css={{flex:"0 0 80px"}}>描述：</div>
            <div css={{flex:"1 1 auto"}}>
              <Input value={this.state.g_des} onChange={this.g_desChange}/>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}


export default SystemGroup
