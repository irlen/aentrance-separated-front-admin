/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, { Component } from 'react'
import { Col, Row, Select, Button, Modal, Input, Icon, Table, Tooltip, Cascader, message } from 'antd'
import _ from 'lodash'
import Highlighter from 'react-highlight-words'
import moment from 'moment'

import WyDatePicker from '../components/WyDatePicker'
import { Amodule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import WySpin from '../components/WySpin'
import Filter from './Filter'
import Line from '../components/Line'
import WyTable from '../components/WyTable'
const Option = Select.Option
const {Search} = Input
class LogStatistic extends Component{
  state = {
    indexList:[],

    cur_time:[], //数据统计时间范围
    updatetime: '0', //数据更新频率
    // filter_list: [], //过滤器
    // cur_filter: {   //当前操作的过滤器
    //   filter_id:'',
    //   filter_name:'',
    //   filter_rule:{
    //     rule_obj:'',
    //     rule_logic:'',
    //     rule_value:''
    //   },
    //   filter_logic:'or',
    //   filter_run:'yes'
    // },
    //log_index: '',

    visible: false,
    lineIsSpining: false,
    tableIsSpining: false,
    xLineData:[],
    yLineData:[],
    aUnit:'',
    xTableData:[],
    yTableData:[],
    search_text:'',
    searched_text:'',
    groupAppList:[],
    group_app:[]
  }
  componentDidMount(){
    this._isMounted = true
    this.getGroupAppList()
  }
  //获取索引列表
  //获取所有索引
  // getIndex = ()=>{
  //   wyAxiosPost('Source/getAppName',{},(result)=>{
  //     const responseData = result.data.msg
  //     if(this._isMounted && responseData && responseData.length>0){
  //       this.setState({
  //         indexList: responseData,
  //         log_index: responseData[0]
  //       },()=>{
  //         this.getLineData()
  //         this.getTableData()
  //       })
  //     }
  //   })
  // }
  getGroupAppList = ()=>{
    wyAxiosPost('Group/getGroupAndApp',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted && responseData.length>0){
        const group_app = []
        const group = responseData[0].value
        const app = responseData[0].children[0].value
        group_app.push(group)
        group_app.push(app)
        this.setState({
          groupAppList: responseData,
          group_app
        },()=>{
          this.getLineData()
          this.getTableData()
        }
        )
      }
    })
  }
  group_appChange = (value)=>{
    if(this._isMounted){
      console.log(value)
      this.setState({
        group_app: value
      },()=>{
        this.getLineData()
        this.getTableData()
      })
    }
  }
  displayRender = (label)=>{
    return label.join(' / ')
  }

  //获取曲线图数据
  getLineData = ()=>{
    if(this._isMounted){
      this.setState({
        lineIsSpining: true
      })
    }
    const {group_app,cur_time,searched_text} = this.state
    const info = {cur_time,searched_text}
    info.log_index = group_app[1]
    wyAxiosPost('Elastic/getTimeCount',{info},(result)=>{
      const responseData = result.data.msg
      if(responseData){
        const curTime = []
        curTime.push(responseData.start_time)
        curTime.push(responseData.last_time)
        if(this._isMounted){
          if(this.state.cur_time.length>0){
            this.setState({
              xLineData: responseData.xxx,
              yLineData: responseData.yyy,
              aUnit: responseData.unit,
              lineIsSpining: false
            })
          }else{
            this.setState({
              cur_time: curTime,
              xLineData: responseData.xxx,
              yLineData: responseData.yyy,
              aUnit: responseData.unit,
              lineIsSpining: false
            })
          }
        }
      }else{
        if(this._isMounted){
          this.setState({
            lineIsSpining: false
          })
        }
      }
    })
  }
  getTableData = (timeValue)=>{
    if(this._isMounted){
      this.setState({
        tableIsSpining: true
      })
    }
    let cur_time = []
    if(timeValue){
      cur_time = timeValue
    }else{
      cur_time = this.state.cur_time
    }
    const {group_app,searched_text} = this.state
    const info = {cur_time,searched_text}
    info.log_index = group_app[1]
    wyAxiosPost('Elastic/getMessage',{info},(result)=>{
      const responseData = result.data.msg
      if(responseData){
        if(this._isMounted){
          const newx = []
          if(responseData.xxx && responseData.xxx.length>0){
            responseData.xxx.map((item)=>{
              const obj = this.getColumnSearchProps(item.dataIndex)
              const newItem = Object.assign({},item,obj)
              newx.push(newItem)
            })
          }
          this.setState({
            xTableData: [...newx],
            yTableData: responseData.yyy,
            tableIsSpining: false
          })
        }
      }else{
        if(this._isMounted){
          this.setState({
            tableIsSpining: false
          })
        }
      }
    })
  }

  rangeTimeChange = (value)=>{
    if(this._isMounted){
      const search_text = this.state.searched_text
      this.setState({
        cur_time: value,
        search_text
      },()=>{
        this.getLineData()
        this.getTableData()
      })
    }
  }
  updatetimeChange = (value)=>{
    if(this._isMounted){
      this.setState({
        updatetime: value
      })
    }
  }
  showModal = () => {
    const randomCount = Math.random();
    const cur_time = new Date().getTime();
    const asId = parseInt(randomCount,10) + parseInt(cur_time,10)*100
    const filter_id = asId.toString()
    const lastFilter = _.cloneDeep(this.state.cur_filter)
    lastFilter.filter_id = filter_id
    if(this._isMounted){
      this.setState({
        visible: true,
        cur_filter: lastFilter
      })
    }
  }
  handleOk = e => {
    //此处需要存数据库
    const lastFilterList = _.cloneDeep(this.state.filter_list)
    const curFilter = _.cloneDeep(this.state.cur_filter)
    lastFilterList.push(curFilter)
    if(this._isMounted){
      this.setState({
        filter_list: lastFilterList
      })
    }
    this.handleCancel()
  }
  handleCancel = e => {
    if(this._isMounted){
      this.setState({
        visible: false,
        cur_filter: {   //当前操作的过滤器
          filter_id:'',
          filter_name:'',
          filter_rule:{
            rule_obj:'',
            rule_logic:'',
            rule_value:''
          },
          filter_logic:'or',
          filter_run: 'yes'
        }
      })
    }
  }
  //过滤器相关
  // rule_objChange = (value)=>{
  //   const lastFilter = _.cloneDeep(this.state.cur_filter)
  //   lastFilter.filter_rule.rule_obj = value
  //   lastFilter.filter_rule.rule_logic = ''
  //   lastFilter.filter_rule.rule_value = ''
  //   if(this._isMounted){
  //     this.setState({
  //       cur_filter: _.cloneDeep(lastFilter)
  //     })
  //   }
  // }
  // rule_logicChange = (value)=>{
  //   const lastFilter = _.cloneDeep(this.state.cur_filter)
  //   lastFilter.filter_rule.rule_logic = value
  //   lastFilter.filter_rule.rule_value = ''
  //   if(this._isMounted){
  //     this.setState({
  //       cur_filter: _.cloneDeep(lastFilter)
  //     })
  //   }
  // }
  // filter_nameChange = (e)=>{
  //   const lastFilter = _.cloneDeep(this.state.cur_filter)
  //   lastFilter.filter_name = e.target.value
  //   if(this._isMounted){
  //     this.setState({
  //       cur_filter: _.cloneDeep(lastFilter)
  //     })
  //   }
  // }
  // filter_logicChange = (value)=>{
  //   const lastFilter = _.cloneDeep(this.state.cur_filter)
  //   lastFilter.filter_logic = value
  //   if(this._isMounted){
  //     this.setState({
  //       cur_filter: _.cloneDeep(lastFilter)
  //     })
  //   }
  // }
  // log_indexChange = (value)=>{
  //   const search_text = this.searched_text
  //   this.setState({
  //     log_index: value,
  //     search_text
  //   },()=>{
  //     this.getLineData()
  //     this.getTableData()
  //   })
  // }
  //柱状图点击事件
  chartClick = (record)=>{
    const curTime = []
    const timeList = _.cloneDeep(this.state.xLineData)
    let start_time = record.name
    let last_time = record.name
    const timeIndex = timeList.indexOf(record.name)
    // if(timeIndex>0){
    //   start_time = timeList[ timeIndex -1 ]
    // }else if(timeIndex === 0 && timeList.length>1){
    //   const time1 = Date.parse(last_time)
    //   const time2 = Date.parse(timeList[1])
    //   const frontTime = time1 - time2 + time1
    //   start_time = moment(frontTime).format('YYYY-MM-DD hh:mm:ss')
    // }
    if(timeList.length === 1){
      message.warning('抱歉，当前已无法继续下钻分析')
      return
    }
    if(timeIndex === timeList.length-1){
      const time1 = Date.parse(timeList[timeIndex-1])
      const time2 = Date.parse(start_time)
      const afterTime = time2 - time1 + time2
      last_time = moment(afterTime).format('YYYY-MM-DD HH:mm:ss')
    }else{
      last_time = timeList[timeIndex+1]
    }
    curTime.push(start_time)
    curTime.push(last_time)
    if(this._isMounted && curTime[0] !== curTime[1]){
      this.setState({
        cur_time: curTime
      },()=>{
        this.getLineData()
        this.getTableData()
      })
    }else{
      message.warning('抱歉，当前已无法继续下钻分析')
    }
  }
  //柱状图刷子事件
  brushSelect = (params)=>{
    if(params.batch[0].areas.length>0){
      let flowPicTime = []
      const xxxRange = params.batch[0].areas[0].coordRange
      if(Math.abs(xxxRange[0]) === Math.abs(xxxRange[1])){
        flowPicTime.push(this.state.xLineData[Math.abs(xxxRange[1])])
        flowPicTime.push(this.state.xLineData[Math.abs(xxxRange[1])])
      }else{
        flowPicTime.push(this.state.xLineData[Math.abs(xxxRange[0])])
        flowPicTime.push(this.state.xLineData[Math.abs(xxxRange[1])])
      }
      if(flowPicTime[1] === undefined){
        flowPicTime[1] = this.state.xLineData[parseInt(this.state.xLineData.length-1,0)]
      }
      if(this._isMounted){
        this.setState({
          cur_time: flowPicTime
        },()=>{
          this.getLineData()
          this.getTableData()
        })
      }
    }
  }
  //表格搜索相关
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text?text.toString():''}
      />
    ),
  })
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  }
  //嵌套表格生成
  subTable = (record)=>{
    const columns = [
      {title:'Field',dataIndex:'field',key:'field'},
      {title:'Value',dataIndex:'value',key:'value'}
    ]
    const obj = record.subData

    const data = []
    const keys = Object.keys(obj)
    if(keys && keys.length>0){
      keys.map(item=>{
        const aRow = {}
        aRow.key = item
        aRow.field = item
        aRow.value = obj[item]
        data.push(aRow)
      })
    }
    return <Table
            columns={columns}
            dataSource={data}
            size="small"
            pagination={false}
          />
  }
  //搜索
  doSearch = ()=>{
    const searched_text = this.state.search_text
    if(this._isMounted){
      this.setState({
        searched_text
      },()=>{
        this.getLineData()
        this.getTableData()
      })
    }
  }
  search_textChange = (e)=>{
    if(this._isMounted){
      this.setState({
        search_text: e.target.value
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return(
      <div>
        <Row>
          <Col>
            <div css={{display:"flex"}}>
              <div css={{flex:"1 1 auto"}}>
              <Tooltip placement="bottomLeft" title="Example: key1=value1 or key2=value2 , key1:value1 and key2:value2">
                <Search
                  placeholder="Search...(e.g.status:200 AND extension:PHP)"
                  onSearch={value => this.doSearch(value)}
                  css={{ width: "80%" }}
                  size="small"
                  value={this.state.search_text}
                  onChange={this.search_textChange}
                />
              </Tooltip>

              </div>
              <div css={{flex:"0 0 240px"}}>
                {
                  // <Select size='small' value={this.state.log_index} onChange={this.log_indexChange} style={{minWidth:"160px"}}>
                  //   {
                  //     this.state.indexList && this.state.indexList.length>0?
                  //     this.state.indexList.map(item=>{
                  //       return <Option title={item} value={item} key={item}>{item}</Option>
                  //     })
                  //     :
                  //     ''
                  //   }
                  // </Select>
                }

                <Cascader
                  options={this.state.groupAppList}
                  displayRender={this.displayRender}
                  onChange={this.group_appChange}
                  value={this.state.group_app}
                  size="small"
                  css={{minWidth:"220px"}}
                />



              </div>
              {
                // <div css={{flex:"0 0 200px"}}>
                //   <span>数据更新：</span>
                //   <Select size='small' value={this.state.updatetime} onChange={this.updatetimeChange} style={{minWidth:"100px"}}>
                //     <Option key="0" value="0">关闭</Option>
                //     <Option key="5" value="5">5s</Option>
                //     <Option key="60" value="60">1min</Option>
                //   </Select>
                // </div>
              }
              <div css={{flex:"0 0 360px"}}>
                <WyDatePicker  curTime={this.state.cur_time} rangeTimeChange={this.rangeTimeChange}/>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col css={{paddingTop:"20px"}}>
          {
            // <div css={{width:"200px",float:"left"}}>
            //   <Amodule>
            //     <Button type="primary" size="small" onClick={this.showModal}>
            //       <span css={{marginRight:"10px"}}>添加过滤器 </span>
            //       <i className="fa fa-plus" aria-hidden="true"></i>
            //     </Button>
            //     <div>
            //       启用中
            //     </div>
            //     <div css={{paddingLeft:"20px"}}>
            //       {
            //         this.state.filter_list && this.state.filter_list.length>0?
            //         this.state.filter_list.map(item=>{
            //           let dom= ''
            //           if(item.filter_run === "yes"){
            //             dom = <Filter key={item.filter_id} filterData={item}/>
            //           }
            //           return dom
            //         })
            //         :
            //         ''
            //       }
            //     </div>
            //     <div>
            //       未启用
            //     </div>
            //     <div css={{paddingLeft:"20px"}}>
            //       {
            //         this.state.filter_list && this.state.filter_list.length>0?
            //         this.state.filter_list.map(item=>{
            //           let dom= ''
            //           if(item.filter_run === "no"){
            //             dom = <Filter key={item.filter_id} filterData={item}/>
            //           }
            //           return dom
            //         })
            //         :
            //         ''
            //       }
            //     </div>
            //   </Amodule>
            // </div>
          }

              <div css={{
                // float:"right",
                // marginLeft:"20px",
                // width: "-webkit-calc(100% - 220px)",
                // width: "-moz-calc(100% - 220px)",
                // width: "-ms-calc(100% - 220px)",
                // width: "-o-calc(100% - 220px)",
                // width: "calc(100% - 220px)",
              }}>
                <Amodule >
                  <WySpin isSpining={this.state.lineIsSpining}>
                    <Line
                      xData={this.state.xLineData}
                      yData={this.state.yLineData}
                      aUnit={this.state.aUnit}
                      onChartClick={this.chartClick}
                      brush={true}
                      onBrushSelected={this.brushSelect}
                      nozoom={true}
                      dataZoom={true}
                    />
                  </WySpin>
                </Amodule>
                <div css={{marginTop:"20px"}}>
                  <Amodule>
                    <div>

                    </div>
                    <div>
                      <WySpin isSpining={this.state.lineIsSpining}>
                        <WyTable
                          xData={this.state.xTableData}
                          yData={this.state.yTableData}
                          expandedRowRender={(record)=>this.subTable(record)}
                        />
                      </WySpin>
                    </div>
                  </Amodule>
                </div>
              </div>
          </Col>
        </Row>
        {
          // <Modal
          //   title="添加过滤器"
          //   width={648}
          //   visible={this.state.visible}
          //   onOk={this.handleOk}
          //   onCancel={this.handleCancel}
          // >
          //   <div css={{display:"flex", lineHeight:"40px"}}>
          //     <div css={{flex:"0 0 100px", textAlign:"right"}}>过滤器名称：</div>
          //     <div css={{flex:"1 1 auto"}}>
          //       <Input value={this.state.cur_filter.filter_name} onChange={this.filter_nameChange} />
          //     </div>
          //   </div>
          //   <div css={{display:"flex", lineHeight:"40px"}}>
          //     <div css={{flex:"0 0 100px", textAlign:"right"}}>过滤条件：</div>
          //     <div css={{flex:"1 1 auto"}}>
          //       <Select
          //        showSearch
          //        css={{ minWidth: "200px" }}
          //        placeholder="Select a person"
          //        optionFilterProp="children"
          //        onChange={this.rule_objChange}
          //        filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          //       >
          //        <Option key="mykey" value="">请选择...</Option>
          //        <Option value="jack">Jack</Option>
          //        <Option value="lucy">Lucy</Option>
          //        <Option value="tom">Tom</Option>
          //       </Select>
          //       {
          //         this.state.cur_filter.filter_rule.rule_obj !== ''?
          //         <Select
          //           css={{minWidth:"100px"}}
          //           onChange={this.rule_logicChange}
          //         >
          //           <Option key='mykey' value=''>请选择...</Option>
          //           <Option key='is' value='is'>是</Option>
          //           <Option key='isnot' value='isnot'>不是</Option>
          //           <Option key='include' value='include'>包含于</Option>
          //           <Option key='uninclude' value='uninclude'>不包含于</Option>
          //           <Option key='exist' value='exist'>存在</Option>
          //           <Option key='unexist' value='unexist'>不存在</Option>
          //         </Select>
          //         :
          //         ''
          //       }
          //       {
          //         this.state.cur_filter.filter_rule.rule_logic !==''?
          //         <Input css={{width:"200px"}}/>
          //         :
          //         ''
          //       }
          //
          //     </div>
          //   </div>
          //   <div css={{display:"flex", lineHeight:"40px"}}>
          //     <div css={{flex:"0 0 100px", textAlign:"right"}}>过滤逻辑：</div>
          //     <div css={{flex:"1 1 auto"}}>
          //       <Select
          //         css={{minWidth:"60px"}}
          //         value={this.state.cur_filter.filter_logic}
          //         onChange={this.filter_logicChange}
          //       >
          //         <Option key="or" value="or">或</Option>
          //         <Option key="and" value="and">且</Option>
          //       </Select>
          //     </div>
          //   </div>
          // </Modal>
        }

      </div>
    )
  }
}

export default LogStatistic
