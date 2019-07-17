import React ,{ Component } from 'react'
import { Table } from 'antd'
import _ from 'lodash'
import DropList from '../DropList'
import sortColumns from '../TableSort'

class WyTable extends Component{
  constructor(){
    super()
    this.state={
      xData:[],
      yData:[],
      onTableClick: function(){},
      onTableContextmenu: function(){},
      dropPosition:{x:"0px",y:"0px"},
      dropData: [],
      isexist: false,
      current:1,
      total:''
    }
  }
  componentDidMount(){
    const {xData,yData} = this.props
    let onTableClick
    let onTableContextmenu
    //点击事件判断
    if(!this.props.onTableClick){
       onTableClick = function(){}
    }else{
       onTableClick = this.props.onTableClick
    }
    //右键点击事件判断
    if(!this.props.onTableContextmenu){
       onTableContextmenu = function(){}
    }else{
       onTableContextmenu = this.props.onTableContextmenu
    }
    this.setState({
      xData: sortColumns(xData),
      yData: yData,
      onTableClick,
      onTableContextmenu
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.activeRowKey){
      if(!(
        JSON.stringify(_.cloneDeep(this.props.xData)) === JSON.stringify(_.cloneDeep(nextProps.xData)) &&
        JSON.stringify(_.cloneDeep(this.props.yData)) === JSON.stringify(_.cloneDeep(nextProps.yData )) &&
        this.props.activeRowKey === nextProps.activeRowKey &&
        JSON.stringify(this.props.dropListInfo) === JSON.stringify(nextProps.dropListInfo) &&
        this.props.current === nextProps.current &&
        this.props.total === nextProps.total
      )){
        this.setState({
          xData: sortColumns(nextProps.xData),
          yData: [...nextProps.yData],
          dropPosition: nextProps.dropListInfo?nextProps.dropListInfo.dropPosition:{x:"0px",y:"0px"},
          dropData: nextProps.dropListInfo?nextProps.dropListInfo.dropData:[],
          isexist: nextProps.dropListInfo?nextProps.dropListInfo.isexist: false,
          current: nextProps.current,
          total: nextProps.total
        })
      }
    }else{
      if(!(
        JSON.stringify(_.cloneDeep(this.props.xData)) === JSON.stringify(_.cloneDeep(nextProps.xData)) &&
        JSON.stringify(_.cloneDeep(this.props.yData)) === JSON.stringify(_.cloneDeep(nextProps.yData )) &&
        JSON.stringify(this.props.dropListInfo) === JSON.stringify(nextProps.dropListInfo) &&
        this.props.current === nextProps.current &&
        this.props.total === nextProps.total
      )){
        this.setState({
          xData: sortColumns(nextProps.xData),
          yData: [...nextProps.yData],
          dropPosition: nextProps.dropListInfo?nextProps.dropListInfo.dropPosition:{x:"0px",y:"0px"},
          dropData: nextProps.dropListInfo?nextProps.dropListInfo.dropData:[],
          isexist: nextProps.dropListInfo?nextProps.dropListInfo.isexist: false,
          current: nextProps.current,
          total: nextProps.total
        })
      }
    }
  }

  render(){
    return(
      <div>
        <Table
          size="small"
          columns={this.state.xData}
          dataSource={this.state.yData}
          pagination={Object.assign(
            {},
            {
            pageSize: this.props.pageSize?this.props.pageSize:5,
            pageSizeOptions: ["5","10","20","30","40"],
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: this.props.onShowSizeChange?(current,size)=>this.props.onShowSizeChange(current,size): function(){},
            current: this.props.current,
            total: this.props.total
          },
          {total: this.state.total,current: this.state.current}
        )}
          rowSelection={this.props.rowSelection?this.props.rowSelection:undefined}
          expandedRowRender={this.props.expandedRowRender?this.props.expandedRowRender:undefined}
          onRow={(record)=>{
              return {
                onClick: ()=>{this.state.onTableClick(record)},
                onContextMenu: (event)=>{
                  let e = event || window.event
                  const xPosition = e.clientX
                  const yPosition = e.clientY
                  const position= {
                    x: xPosition,
                    y: yPosition
                  }
                  const dom = e.target
                  this.state.onTableContextmenu(record,position,dom)
                }
              }
            }
          }
          onChange={(pagination, filters, sorter)=>{this.props.tableChange(pagination, filters, sorter)}}
          >
          </Table>
        <DropList
          dropPosition={_.cloneDeep(this.state.dropPosition)}
          dropData={_.cloneDeep(this.state.dropData)}
          isexist={_.cloneDeep(this.state.isexist)}
        />
      </div>
    )
  }
}

export default WyTable


//columns:[], 表格列对象
//data:[], 表格列数据
//onTableClick: function(){}, 表格行点击事件
//onTableContextmenu: function(){} 表格行右键事件
