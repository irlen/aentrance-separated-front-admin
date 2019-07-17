/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'


import { updateIndus } from '../actions'


const { TreeNode } = TreeSelect
const one = [
  {
    name:"一级a",
    value:"aa",
    id:"a"
  },{
    name:"一级b",
    value:"bb",
    id:"b"
  }
]
const two = [
  {
    oneId: "a",
    dataList:[
      {name:"二级a0",value:"a0",id:"a0"},
      {name:"二级a1",value:"a1",id:"a1"},
      {name:"二级a2",value:"a2",id:"a2"}
    ]
  },{
    oneId: "b",
    dataList:[
      {name:"二级b0",value:"b0",id:"b0"},
      {name:"二级b1",value:"b1",id:"b1"},
      {name:"二级b2",value:"b2",id:"b2"}
    ]
  }
]
const three = [
  {
    oneId:"a",
    twoId:"a0",
    dataList:[
      {name:"三级a00",value:"a00",id:"a00"},
      {name:"三级a01",value:"a01",id:"a01"},
      {name:"三级a02",value:"a02",id:"a02"}
    ]
  },{
    oneId:"b",
    twoId:"b1",
    dataList:[
      {name:"三级b10",value:"b10",id:"b10"},
      {name:"三级b12",value:"b12",id:"b12"},
      {name:"三级b13",value:"b13",id:"b13"}
    ]
  }
]

class SideTree extends Component{
  state = {
    indusList: {}
  }
  componentDidMount(){
    this._isMounted = true
    const value = {one,two,three}
    console.log(value)
    this.props.updateIndus(value)
    if(this._isMounted){
      this.setState({
        indusList: value
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.indus,nextProps.indus)){
      if(this._isMounted){
        this.setState({
          indusList: nextProps.indus
        })
      }
    }
  }
  generateTree = (one,two,three)=>{
    return one.map((item,index)=>{
      return (
        //一级
        <TreeNode value={item.id} title={item.name} key={item.id}>
          {
            _.find(two,(o)=>{return o.oneId === item.id})?
            _.find(two,(o)=>{return o.oneId === item.id}).dataList.map((twoItem)=>{
                return (
                  //二级
                  <TreeNode value={`${item.id}_${twoItem.id}`} title={twoItem.name} key={`${item.id}_${twoItem.id}`}>
                    {
                      _.find(three,(o)=>{return (o.oneId === item.id) && (o.twoId === twoItem.id)})?
                      _.find(three,(o)=>{return (o.oneId === item.id) && (o.twoId === twoItem.id)}).dataList.map((threeItem)=>{
                        return (
                          <TreeNode value={`${item.id}_${twoItem.id}_${threeItem.id}`} title={threeItem.name} key={`${item.id}_${twoItem.id}_${threeItem.id}`}>
                          </TreeNode>

                        )
                      })
                      :
                      ''
                    }
                  </TreeNode>
                )
              })
              :
              ''
          }

        </TreeNode>
      )
    })
  }
  onChange = value => {
    if(this._isMounted){
      this.setState({
         value
       },()=>{
         if(value){
           this.props.setCurrent(value)
         }
       })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return(
      <div>
      <TreeSelect
        showSearch
        style={{ width: 300 }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
      >
      {this.generateTree(one,two,three)}
      {
        // <TreeNode value="parent 1" title="parent 1" key="0-1">
        //   <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
        //     <TreeNode value="leaf1" title="my leaf" key="random" />
        //     <TreeNode value="leaf2" title="your leaf" key="random1" />
        //   </TreeNode>
        //   <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
        //     <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
        //   </TreeNode>
        // </TreeNode>
      }

      </TreeSelect>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  indus : state.indus
})
const mapDispatchToProps = (dispatch)=>({
  updateIndus: (value)=>{dispatch(updateIndus(value))}
})
export default connect(mapStateToProps,mapDispatchToProps)(SideTree)
