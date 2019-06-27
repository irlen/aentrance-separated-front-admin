/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Input, TreeSelect } from 'antd'


import RbMap from '../components/RbMap'
import { Amodule } from '../components/Amodule'
const { Search } = Input
const { SHOW_PARENT, TreeNode } = TreeSelect
class WholeView extends Component{
  constructor(props){
    super(props)
  }
  state = {
    industryValue:[],
    treeData: [
                  {
                    title: 'Node1',
                    value: '0-0',
                    key: '0-0',
                    children: [
                      {
                        title: 'Child Node1',
                        value: '0-0-0',
                        key: '0-0-0',
                        children:[
                          {
                            title: '第三级',
                            value: '0-0-0-0',
                            key: '0-0-0-0',
                          },
                          {
                            title: '222',
                            value: '0-0-0-1',
                            key: '0-0-0-1',
                          }
                        ]
                      },
                    ],
                  },
                  {
                    title: 'Node2',
                    value: '0-1',
                    key: '0-1',
                    children: [
                      {
                        title: 'Child Node3',
                        value: '0-1-0',
                        key: '0-1-0',
                      },
                      {
                        title: 'Child Node4',
                        value: '0-1-1',
                        key: '0-1-1',
                      },
                      {
                        title: 'Child Node5',
                        value: '0-1-2',
                        key: '0-1-2',
                      },
                    ],
                  },
                ],
    cityValue:'',
    cityData: [
                  {
                    title: 'Node1',
                    value: '0-0',
                    key: '0-0',
                    children: [
                      {
                        title: 'Child Node1',
                        value: '0-0-1',
                        key: '0-0-1',
                      },
                      {
                        title: 'Child Node2',
                        value: '0-0-2',
                        key: '0-0-2',
                      },
                    ],
                  },
                  {
                    title: 'Node2',
                    value: '0-1',
                    key: '0-1',
                  },
                ],
    leftW: 0,
    isSearch: true,
    center: {lng: 114.0661345267, lat: 22.5485544122},
    zoom:'12'
  }
  componentDidMount(){
    this._isMounted = true
  }
  toggleSearch = ()=>{
    if(this._isMounted){
      this.setState({
        isSearch: !this.state.isSearch
      })
    }
  }
  industryValueChange = (value)=>{
    if(this._isMounted){
      console.log(value)
      this.setState({ industryValue:value });
    }
  }
  cityValueChange = (value)=>{
    if(this._isMounted){
      console.log(value)
      this.setState({
        cityValue: value
      })
    }
  }
  collapseChange = (value)=>{
    if(this._isMounted){
      this.setState({
        leftW: value
      })
    }
  }
  render(){
    //window动态高度
    //数选择框的属性
    const tProps = {
      treeData:this.state.treeData,
      value: this.state.industryValue,
      onChange: this.industryValueChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '默认全部产业',
      multiple: true,
      allowClear: true,
      treeNodeFilterProp: 'title',
      maxTagCount: 1,
      maxTagPlaceholder:'...共选'+this.state.industryValue.length+'项',
      style: {
        minWidth: 200,
      },
    }
    const relH = this.props.windowH - 100
    return (
      <div className="formap" css={{position: "relative"}}>
          <div css={{display:"flex"}}>
            {
              this.state.leftW !== 0?
              <div css={{flex:`0 0 ${this.state.leftW}px`}}>
                  <div css={{height: `${relH}px`,background:"rgba(0,0,0,0.2)"}}>

                  </div>
              </div>
              :
              ''
            }

            <div css={{height: `${relH}px`,flex:"1 1 auto"}}>
              <RbMap center={this.state.center} zoom={this.state.zoom}/>
            </div>
          </div>
        {
          this.state.isSearch?
          <div css={{width:"100%",height:"50px",lineHeight:"50px",position: "absolute",background:"#ffffff",top:"0px",padding: "0 20px 0 20px",background:"rgba(25,33,57,0.8)"}}>
            <Search
              placeholder="输入产业园查找"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
            <TreeSelect {...tProps} />
            <TreeSelect
              style={{ width: 300 }}
              value={this.state.cityValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={this.state.cityData}
              placeholder="默认为全国"
              treeDefaultExpandAll
              treeNodeFilterProp='title'
              showSearch={true}
              onChange={this.cityValueChange}
              maxTagCount={0}
              maxTagPlaceholder={this.state.cityValue.length}
            />
            <span onClick={this.toggleSearch} css={{float: "right",cursor:"pointer"}}><i className="fa fa-chevron-up"></i></span>
          </div>
          :
          <span onClick={this.toggleSearch} title="展开搜索" css={{position:"absolute",right:"10px",top:"10px",
            borderRadius:"24px",background:"rgba(0,153,51,1)",
            width:"24px",lineHeight:"24px",height:"24px",textAlign:"center",
            cursor:"pointer","&:hover":{opacity:"0.8"}
            }}><i className="fa fa-search" aria-hidden="true"></i>
          </span>
        }

        {
          this.state.leftW !== 0?
          <span css={{background:"rgba(0,153,51,0.2)",
            position:"absolute", top:"50%",left:"285px",cursor:"pointer",lineHeight:"20px", textAlign:"center",
            "&:hover":{opacity:"0.5"},
            borderRadius:"8px 0 0 8px",
            padding:"10px 3px 10px 3px"
          }}
          onClick={()=>{this.collapseChange(0)}}
          >
            <i className="fa fa-angle-double-left" aria-hidden="true"></i>
          </span>
          :
          <span css={{background:"rgba(0,153,51,0.2)",
            position:"absolute", top:"50%",left:"-20px",cursor:"pointer",lineHeight:"20px", textAlign:"center",
            "&:hover":{opacity:"0.5"},
            borderRadius:"0 8px 8px 0",
            padding:"10px 3px 10px 3px"
          }}
          onClick={()=>{this.collapseChange(300)}}
          >
            <i className="fa fa-angle-double-right" aria-hidden="true"></i>
          </span>
        }
      </div>
    )
  }
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})

export default connect(mapStateToProps,null)(WholeView)
