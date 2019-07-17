/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React ,{ Component } from 'react'
import { Row, Col, Button, Input, Popconfirm, Drawer, message } from 'antd'
import _ from 'lodash'

import WyTable from '../components/WyTable'
import WySpin from '../components/WySpin'
import FormList from './FormList'
import { wyAxiosPost } from '../components/WyAxios'

const { Search } = Input
class DataBuilding extends Component{
  state = {
    xData:[],
    yData:[],
    ids:[],
    drawerVisible:false,
    isSpining: false,
    pageSize: 10,
    id:'',
    curFields: {}, //当前编辑的ID对应的字段
    current: 1,
    total:'',
    search:''
  }
  componentDidMount(){
    this._isMounted = true
    this.getTotal('')
  }
  getTotal = (search)=>{
    wyAxiosPost('Build/getBuildCount',{search},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          total: responseData.msg
        },()=>{
          this.getParkList(undefined, undefined, undefined)
        })
      }
    })
  }
  doSearch = (value)=>{
    if(this._isMounted){
      this.setState({
        search: value,
        current: 1
      },()=>{
        this.getTotal(this.state.search)
      })
    }
  }
  reset = (value)=>{
    const info = value.target.value
    if(info === ''){
      this.setState({
        search:''
      },()=>{
        this.getTotal(this.state.search)
      })
    }
  }
  //获取园区列表
  getParkList = (pagination=undefined, filters=undefined, sorter=undefined)=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    let current = this.state.current
    let pageSize = this.state.pageSize
    let search = this.state.search

    if(pagination){
      current = pagination.current
      pageSize = pagination.pageSize
    }
    wyAxiosPost('Build/getBuildList',{current,pageSize,search},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      curxData.push({
        title: '操作',
        dataIndex: 'edit',
        render: (text, record, index)=>(
          <span>
            <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>{this.editPark(record.key)}} >
              <i className="fa fa-pencil-square" aria-hidden="true"></i>
            </span>
          </span>
        )
      })
      if(this._isMounted){
        this.setState({
          xData: curxData,
          yData: responseData.yyy,
          isSpining: false,
          current
        })
      }
    })
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    })
  }
  addPark = ()=>{
    if(this._isMounted){
      this.setState({
        id:'',
        drawerVisible: true,
      })
    }
  }
  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    })
  }
  //删除
  delPark = ()=>{
    const ids = this.state.ids
    wyAxiosPost('Build/delBuild',{ids},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        if(this._isMounted){
          this.setState({
            current: 1,
            search:'',
            ids:[]
          },()=>{
            this.getTotal(this.state.search)
            message.success(responseData.msg)
          })
        }
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  //修改
  editPark = (id)=>{
    if(this._isMounted){
      this.setState({
        id
      },()=>{
        //获取该ID对应的所有字段，初始化时间字段
        wyAxiosPost('Build/getBuildById',{id: id},(result)=>{
          const responseData = result.data.msg
          if(this._isMounted){
            this.setState({
              curFields: _.cloneDeep(responseData.msg)
            },()=>{
              this.showDrawer()
            })
          }
        })
      })
    }
  }

  pageSizeChange = (current, size)=>{
    if(this._isMounted){
      this.setState({
        pageSize: size
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
    return (
      <div>
        <Row gutter={16}>
          <Col>
            <div css={{display:"flex"}}>
              <div css={{flex:"1 1 auto"}}>
              <Search
                placeholder="产业园、楼宇、地址"
                onSearch={(value)=>{this.doSearch(value)}}
                style={{ width: 200 }}
                onChange={(value)=>{this.reset(value)}}
               />
              </div>
              <div css={{flex:"0 0 240px"}}>
                <Button onClick={this.addPark} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加楼宇</span></Button>
                <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delPark:()=>{}} okText="确定" cancelText="取消">
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
                pageSize={this.state.pageSize}
                onShowSizeChange={this.pageSizeChange}
                rowSelection={rowSelection}
                xData={this.state.xData?this.state.xData:[]}
                yData={this.state.yData?this.state.yData:[]}
                tableChange={this.getParkList}
                total={this.state.total}
                current={this.state.current}
              />
            </WySpin>
          </Col>
        </Row>
        <Drawer
          title={this.state.id === ''?'新增楼宇':'修改楼宇'}
          width={"90%"}
          onClose={this.closeDrawer}
          visible={this.state.drawerVisible}
        >

        {
          this.state.drawerVisible?
          <FormList id={this.state.id} getTotal={()=>{
            if(this._isMounted){
              this.setState({
                current:1,
                search:''
              },()=>{this.getTotal(this.state.search)})
            }
          }} closeDrawer={this.closeDrawer} curFields={this.state.id === ''?{}:this.state.curFields} />
          :
          ''
        }

        </Drawer>

      </div>
    )
  }
}

export default DataBuilding
