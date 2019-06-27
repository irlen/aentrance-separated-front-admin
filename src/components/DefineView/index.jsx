import React, { Component } from 'react'
import { Select, Button, Input, DatePicker, Row, Col } from 'antd'
import axios from 'axios'
import moment from 'moment'
import Line from '../components/Line'
import Bar from '../components/Bar'
import WyTable from '../components/WyTable'

const Option = Select.Option
const now1 = moment()
const now2 = moment()
const Now = now1.add(0,'h')
const oneHourBefore = now2.subtract(1,'h')
const RangePicker = DatePicker.RangePicker
export default class DefineView extends Component{
  state={
    dataSourceList:[],
    standarList:{},//对应数据源取出的数据
    dataSource:'',//数据源
    viewType: '',//视图类型
    alldata:[],//曲线图数据列
    adata:'',//单一数据列
    xdata:'',//曲线图横轴对象
    ydata:'',//曲线图纵轴对象
    yydata:'',//曲线图纵轴对象二类
    rangeTime:[],//时间范围
	time_unit:'min5',
    limitCount:'10',//分页查询
	order:'',//排序对象
	orderSort:'',//升降选择
    yyy: [],//曲线图纵轴数据
    xxx: [],//曲线图横轴数据
    unit:'',//曲线图单位
	tableTitle:[],//表格列标题
	talbleOrder:'',//表格排序对象
	tableColumns:[],
	talbeData:[]
  }

  componentDidMount(){
    const time1 = moment(oneHourBefore,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
    const time2 = moment(Now,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
    console.log(time1)
    console.log(time2)
    axios.get('http://10.0.0.6/cps/NetDipperV3-select/System/ajax_getDataSource').then(result=>{
      this.setState({
        dataSourceList: [...result.data],
        rangeTime:[time1,time2]
      })
    }).catch(erro=>{
      console.log(erro)
    })
  }
  //数据源改变事件
  dataSourceChange = (value)=>{
    axios.get('http://10.0.0.6/cps/NetDipperV3-select/System/ajax_getZhiBiao?id='+value+'').then(result=>{
      console.log('standarList'+JSON.stringify(result.data))
      this.setState({
        standarList: Object.assign({},result.data),
        alldata:[],
        adata:'',
        xdata:'',
        ydata:'',
		viewType:'',
		order:'',
		time_unit:'min5',
		orderSort:'asc',
        limitCount:'10',
        yydata:'',
		tableTitle:[],
		talbleOrder:''
      })
    }).catch(erro=>{
      console.log(erro)
    })
    this.setState({
      dataSource: value
    })
  }
  
  //时间切换
  timeunitChange = (value)=>{
    this.setState({
      time_unit: value
    })
  }

  //排序sort切换
  orderSortChange = (value)=>{
    this.setState({
      orderSort: value
    })
  }

  //排序切换
  orderChange = (value)=>{
    this.setState({
      order: value
    })
  }

  //视图切换
  viewChange = (value)=>{
    this.setState({
      viewType: value,
	  alldata:[],
	  adata:'',
	  xdata:'',
	  ydata:'',
	  order:'',
	  orderSort:'asc',
	  limitCount:'10',
	  yydata:'',
	  time_unit:'min5',
	  tableTitle:[],
	  talbleOrder:'',
	  xxx:[],
	  yyy:[]
    })
  }
  //alldatachange事件
  alldataChange = (value)=>{
    this.setState({
      alldata: [...value]
    })
  }
  adataChange = (value)=>{
    this.setState({
      adata: value
    })
  }
  //xdatachange事件
  xdataChange = (value)=>{
    this.setState({
      xdata: value,
      alldata:[],
      adata:'',
	  order:'',
    })
  }
  //ydatachange事件
  ydataChange = (value)=>{
    this.setState({
      ydata: value,
      alldata:[],
      adata:'',
      yydata: '',
	  order:'',
    })
  }
  //yydatachange事件
  yydataChange = (value)=>{
    this.setState({
      yydata: value,
      alldata:[]
    })
  }
  //rangeTimechange事件
  rangeTimeChange = (dates, dateStrings)=>{
    let timearr = []
    timearr = [...dateStrings]
    console.log(timearr)
    this.setState({
      rangeTime: [...timearr]
    })
  }
  //limitCountChange事件
  limitCountChange = (value)=>{
    console.log(value)
    this.setState({
      limitCount: value
    })
  }
	//tableTitleChange事件
	tableTitleChange = (value)=>{
		this.setState({
			tableTitle:[...value]
		})
	}
	//tableOrderChange事件
	tableOrderChange = (value)=>{
		this.setState({
			tableOrder: value
		})
	}
  //提交事件
  forSubmit = ()=>{
	   this.setState({
		   xxx:[],
		   yyy:[],
	   })
	  let data={}
	  if(this.state.viewType ==='line' || this.state.viewType === 'bar'){
		data.dataSource = this.state.dataSource
		data.viewType = this.state.viewType
		data.alldata = this.state.alldata
		data.xdata = this.state.xdata
		data.yydata = this.state.yydata
		data.time_unit = this.state.time_unit
		data.limitCount = this.state.limitCount
		data.alldata = this.state.alldata
		data.adata = this.state.adata
		data.order = this.state.order
		data.orderSort = this.state.orderSort
	  }else if(this.state.viewType ==='wytable'){
		data.dataSource = this.state.dataSource
		data.viewType = this.state.viewType
		data.tableTitle = this.state.tableTitle
		data.order = this.state.tableOrder
		data.orderSort = this.state.orderSort
		data.time_unit = this.state.time_unit
		data.limitCount = this.state.limitCount
	  }

    console.log(data)
    axios({
      method:"post",
      url:"http://10.0.0.6/cps/NetDipperV3-select/System/ajax_selectData",
      data:data,
      headers:{
        "Content-Type": "application/x-www-form-urlencoded "
     }
    }).then(result=>{
      console.log(result)
      // const datalist = result.data.data
      // const xlist = datalist.keys();
      // const ylist = [];
      // for (let key in datalist) {
      //   console.log(key, obj[key])
      // }
      this.setState({
        xxx: result.data.xxx,
        yyy: result.data.yyy,
        unit: result.data.unit
      })
    }).catch(erro=>{
      console.log(erro)
    })
  }
  //生成ylist事件
  foryyDataList = (value)=>{
    if(value === ''){
      return ''
    }else if(value === 'bytes'){
      return(
        <Select style={{minWidth:"120px"}} onChange={this.yydataChange} value={this.state.yydata}>
          <Option key="mykey" value="">请选择</Option>
          {
            this.state.standarList.bytes && this.state.standarList.bytes.length>0?
            this.state.standarList.bytes.map(item=>{
              return(
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
            })
            :
            ''
          }
        </Select>
      )
    }else if(value === 'packets'){
      return(
        <Select style={{minWidth:"120px"}} onChange={this.yydataChange} value={this.state.yydata}>
          <Option key="mykey" value="">请选择</Option>
          {
            this.state.standarList.packets && this.state.standarList.packets.length>0?
            this.state.standarList.packets.map(item=>{
              return(
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
            })
            :
            ''
          }
        </Select>
      )
    }else if(value === 'time'){
      return(
        <Select style={{minWidth:"120px"}} onChange={this.yydataChange} value={this.state.yydata}>
          <Option key="mykey" value="">请选择</Option>
          {
            this.state.standarList.time && this.state.standarList.time.length>0?
            this.state.standarList.time.map(item=>{
              return(
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
            })
            :
            ''
          }
        </Select>
      )
    }
  }
  forDataList = (xdata,ydata,yydata,untreatedData) =>{
    if(xdata != '' && ydata != ''){
      if(yydata === ''){
        if(ydata === 'bytes' && untreatedData.bytes && untreatedData.bytes.length>0){
          return(
            <Select
               mode="multiple"
               style={{width: "450px"}}
               placeholder="请选择"
               defaultValue={[]}
               value={this.state.alldata}
               onChange={this.alldataChange}
              >
              {
                untreatedData.bytes.map(item=>{
                  return(
                    <Option key={item.id} value={item.id}> {item.name} </Option>
                  )
                })
              }
            </Select>
          )
        }else if(ydata === 'packets' && untreatedData.packets && untreatedData.packets.length>0){
          return(
            <Select
               mode="multiple"
               style={{width: "450px"}}
               placeholder="请选择"
               defaultValue={[]}
               value={this.state.alldata}
               onChange={this.alldataChange}
              >
              {
                untreatedData.packets.map(item=>{
                  return(
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          )
        }else if(ydata === 'time' && untreatedData.time && untreatedData.time.length>0){
          return(
            <Select
               mode="multiple"
               style={{width: "450px"}}
               placeholder="请选择"
               defaultValue={[]}
               value={this.state.alldata}
               onChange={this.alldataChange}
              >
              {
                untreatedData.time.map(item=>{
                  return(
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          )
        }
      }else if(yydata != ''){
        if(untreatedData.default && untreatedData.default.length>0){
          return(
            <Select
               style={{width: "350px"}}
               placeholder="请选择"
               defaultValue=''
               value={this.state.adata}
               onChange={this.adataChange}
              >
              <Option key='mykey' value=''>请选择</Option>
              {
                untreatedData.default.map(item=>{
                  if(item.id != xdata){
                    return(
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    )
                  }
                })
              }
            </Select>
          )
        }
      }
    }else{
      return (
        <Select
           mode="multiple"
           style={{width: "350px"}}
           placeholder="请选择"
           defaultValue={[]}
           value={this.state.alldata}
           onChange={this.alldataChange}
          >
        </Select>
      )
    }
  }
  render(){
    return(
      <div>
        <ul>
          <li>
            <span className="def_left"> 数据源：</span>
            <span className="def_right">
              <Select style={{width: "120px"}} value={this.state.dataSource} onChange={this.dataSourceChange}>
                <Option key="mykey" value="">请选择</Option>
                {
                  this.state.dataSourceList.map(item=>{
                    return(
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </span>
          </li>
          {
            this.state.dataSource == ''?'':
            <li>
              <span className="def_left"> 视图类型：</span>
              <span className="def_right">
                <Select style={{width: "120px"}} value={this.state.viewType} onChange={this.viewChange} >
				  <Option key="mykey" value="">请选择</Option>
                  <Option key="line" value="line">曲线图</Option>
                  <Option key="bar" value="bar">柱状图</Option>
                  <Option key="wytable" value="wytable">表格</Option>
                </Select>
              </span>
            </li>
          }


		  {
			//曲线图X轴
		  }
		  {
			  this.state.viewType == 'line' || this.state.viewType == 'bar'?
			  <li>
				<span className="def_left"> X轴：</span>
				<span className="def_right">
				  <Select style={{width: "120px"}} value={this.state.xdata} onChange={this.xdataChange}>
					<Option key="mykey" value="">请选择</Option>
					{
					  this.state.standarList.default && this.state.standarList.default.length>0?this.state.standarList.default.map(item=>{
						return(
						  <Option key={item.id} value={item.id}>{item.name}</Option>
						)
					  })
					  :
					  ''
					}
				  </Select>
				</span>
			  </li>
			  :
			  ''
		  }


		 {
			//曲线图y轴
		 }
		 {
			  this.state.viewType == 'line' || this.state.viewType == 'bar'?
			  <li>
				<span className="def_left"> y轴：</span>
				<span className="def_right">
				  <Select style={{width: "120px"}} value={this.state.ydata} onChange={this.ydataChange}>
					<Option key="mykey" value=''>请选择</Option>
					<Option key="bytes" value='bytes'>流量类</Option>
					<Option key="packets" value='packets'>数据包类</Option>
					<Option key="time" value='time'>时间类</Option>
				  </Select>
				  {
					this.foryyDataList(this.state.ydata)
				  }

				</span>
			  </li>
			  :
			  ''
		  }


		{
			//曲线图数据列
		}
		{
			this.state.viewType == 'line' || this.state.viewType == 'bar'?
			<li>
				<span className="def_left"> 数据列：</span>
				<span className="def_right">
				{
				  this.forDataList(this.state.xdata,this.state.ydata,this.state.yydata,this.state.standarList)
				}
				</span>
			</li>
			:
			''
		}


		{
			//曲线图排序
		}
		{
			this.state.viewType == 'line' || this.state.viewType == 'bar'?
			<li>
			<span className="def_left"> 排序:</span>
			<span className="def_right">
			<Select style={{width: "120px"}} value={this.state.order} onChange={this.orderChange}>
			  {
				  this.state.standarList.all && this.state.standarList.all.length>0?this.state.standarList.all.map(item=>{
					  if (item.id == this.state.xdata)
						return(
						  <Option key={item.id} value={item.id}>{item.name}</Option>
						)
					  else if (this.state.yydata && item.id == this.state.yydata)
						return(
						  <Option key={item.id} value={item.id}>{item.name}</Option>
						)
				  })
				  :
				  ''
				}
			  </Select>
			 <Select style={{width: "120px"}}  value={this.state.orderSort} onChange={this.orderSortChange}>
			   <Option key="asc" value="asc">从小到大</Option>
			   <Option key="desc" value="desc">从大到小</Option>
			  </Select>
			</span>
		  </li>
		  :
		  ''
		}

		{
			//表格数据列
		}
		{
		  this.state.viewType == 'wytable'?
          <li>
				<span className="def_left"> 数据列：</span>
				<span className="def_right">
					<Select
					   mode="multiple"
					   style={{width: "350px"}}
					   placeholder="请选择"
					   defaultValue={[]}
					   value={this.state.tableTitle}
					   onChange={this.tableTitleChange}
					  >
						{
							this.state.standarList.all && this.state.standarList.all.length>0?
							this.state.standarList.all.map(item=>{
								return(
									<Option key={item.id} value={item.id}>{item.name}</Option>
								)
							})
							:
							''
						}
					</Select>
				</span>
			</li>
			:
			''
		}
		{
			//表格排序
		}
		{
			this.state.viewType == 'wytable'?
			<li>
			<span className="def_left"> 排序:</span>
			<span className="def_right">
			<Select style={{width: "120px"}} value={this.state.tableOrder} onChange={this.tableOrderChange}>
				<Option key="mykey" value="">请选择</Option>
			  {
				this.state.standarList.all && this.state.standarList.all.length>0?
				this.state.standarList.all.map(item=>{
					return(
						<Option key={item.id} value={item.id}>{item.name}</Option>
					)
				})
				:
				''
			 }
			 </Select>
			 <Select style={{width: "120px"}}  value={this.state.orderSort} onChange={this.orderSortChange}>
			   <Option key="asc" value="asc">从小到大</Option>
			   <Option key="desc" value="desc">从大到小</Option>
			  </Select>
			</span>
		  </li>
		  :
		  ''
		}

        {
          this.state.viewType == ''?'':
		  <li>
            <span className="def_left"> 时间选择：</span>
            <span className="def_right">
				<Select style={{width: "120px"}}  value={this.state.time_unit} onChange={this.timeunitChange}>
                <Option key="min5" value="min5">最近五分钟</Option>
                <Option key="hour1" value="hour1">最近一小时</Option>
                <Option key="hour3" value="hour3">最近三小时</Option>
                <Option key="hour6" value="hour6">最近六小时</Option>
              </Select>
			  {/*
              <RangePicker
                  defaultValue={[moment(oneHourBefore,'YYYY-MM-DD HH:mm'),moment(Now,'YYYY-MM-DD HH:mm')]}
                  ranges={{
                    '最近一小時':[moment().subtract(1,'h'),moment()],
                    '最近三小時': [moment().subtract(3,'h'), moment()],
                    '最近六小時': [moment().subtract(6,'h'), moment()],
                    '最近一周': [moment().subtract(1,'w'), moment()]
                  }}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  onChange={this.rangeTimeChange}
              />
			  */}
            </span>
          </li>
		}
		{
          this.state.viewType == ''?'':
          <li>
            <span className="def_left"> 条数：</span>
            <span className="def_right">
             <Select style={{width: "120px"}}  value={this.state.limitCount} onChange={this.limitCountChange}>
                <Option key="10" value="10">10</Option>
                <Option key="50" value="50">50</Option>
                <Option key="100" value="100">100</Option>
                <Option key="all" value="all">全部</Option>
              </Select>
            </span>
          </li>
        }
        </ul>
        <Button type="primary" onClick={this.forSubmit}>提交</Button>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{"width":"100%","height":"30px"}}></div>
			{
				this.state.viewType == 'bar'?
				(
					 this.state.xxx.length>0 && this.state.yyy.length>0?
						<Bar xData={this.state.xxx} yData={this.state.yyy} aUnit={this.state.unit}/>
					:
					''
				)
				:
				this.state.viewType == 'wytable'?
				(
						this.state.xxx.length>0 && this.state.yyy.length>0?
						<WyTable xData={this.state.xxx} yData={this.state.yyy}/>
						:
						''
				)
				:
				this.state.viewType == 'line'?
				(
						this.state.xxx.length>0 && this.state.yyy.length>0?
						<Line xData={this.state.xxx} yData={this.state.yyy} aUnit={this.state.unit}/>
						:
						''
				):
				''
			}

          </Col>
        </Row>
      </div>
    )
  }
}
