/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import _ from 'lodash'
import { Row, Col, Input, Button, Collapse, Icon, Select, message, Checkbox, Modal, Typography, Drawer, Cascader, Popconfirm } from 'antd'


import WyTable from '../components/WyTable'
import WyDatePicker from '../components/WyDatePicker'
import { Amodule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import WySpin from '../components/WySpin'
import decodeArr from './decodeArr'
import { forName } from '../components/RegExp'

const { TextArea } = Input
const { Panel } = Collapse
const { Option }  = Select
const { Text } = Typography
const ColorChange = styled.span({
  background:"#3399cc"
})
class Configure extends Component{
  state = {
    message: '', //日志样例
    messageForSelectModel:'', //划词时候的日志样例
    pattern:'', //供匹配的正则
    result: '', //解析出来的结果
    lastOne: {   //最近一次执行解析之后的三个量的值
      message: '',
      pattern: '',
      result: '',
    },

    xData:[],
    yData:[],
    pageSize:10,
    isSpining: false,

    activeKey:[],

    curTime: [],
    //indexList:[],
    compile_status:'all',

    isSpining: false,

    isSelectModel: false,//是否是划词匹配模式
    isExistModel: false,//是否是从已经有的里面选的模式

    selArr:[],//划词时被选中的数据例
    wholeArr:[],//通过选中的数据例，编译出的整条数据例
    curSnippet:{ //最近一次选中的数据例的各个属性信息
      id:'',
      start:'',
      end:'',
      str: '',
      name:'',
      selected:''
    },
    visible: false,
    modalVisible: false,
    rulename:'', //待保存的新规则的名称
    ruledes:'',//待保存的新规则的描述
    appname:'',
    appNameList:[],

    drawerVisible: false,
    group_app: ['all_group'],
    groupAppList:[],

    currule:'', //已有规则中选择时，被选中的规则
    ruleList:[], //已有规则列表

    popVisible: false,
    condition: true

  }
  componentDidMount(){
    this._isMounted = true
    this.getLog()
    this.getAppName()
    this.getGoupAppList()
  }
  getCurRuleList= (appname)=>{
    wyAxiosPost('Rule/getRuleList',{appname},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted && responseData.length>0){
        this.setState({
          ruleList: responseData
        })
      }
    })
  }
  getGoupAppList = ()=>{
    wyAxiosPost('Group/getGroupApp',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          groupAppList: responseData
        })
      }
    })
  }
  compile_statusChange = (value)=>{
    this.setState({
      compile_status:value
    },()=>{
      this.getLog()
    })
  }
  //取词正则相关
  isSelectModelChange = (e)=>{
    if(this._isMounted){
      this.setState({
        isSelectModel: e.target.checked,
        isExistModel: false,
        messageForSelectModel: e.target.checked?this.state.message:'',
        selArr:[],
        wholeArr:[],
        currule:'',
        pattern:'',
        result:''
      })
    }
  }
  selectWord = (event)=>{
    const e = window.event || event
    e.preventDefault()
    e.stopPropagation()
    const curMessage = this.state.message
    const start = e.target.selectionStart
    const end = e.target.selectionEnd
    //交叉选择判断
    if(this.isIntersect(this.state.selArr,start,end)){
      message.warning('选择无效,请避免交叉选择')
      return
    }
    const selectedText = curMessage.slice(start, end)
    const notrim = _.trim(selectedText)
    const randomCount = Math.random();
    const curTime = new Date().getTime();
    const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
    const id = asId.toString()
    if((selectedText.length>0 && notrim.length === 0) || selectedText.length === 0 || selectedText === ''){
      message.warning('请不要选择空字符')
      return
    }
    if(selectedText === this.state.message){
      return
    }
    if(this._isMounted){
      this.setState({
        curSnippet:{
          id,
          start,
          end,
          str: selectedText,
          name:'',
          selected: true
        }
      },()=>{
        this.showModal()
      })
    }
  }
  getAppName = ()=>{
    wyAxiosPost('Source/getAppName',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          appNameList: responseData
        })
      }
    })
  }
  appnameChange = (value)=>{
    if(this._isMounted){
      this.setState({
        appname: value
      })
    }
  }
  //将选中字符串数组中插入未选中字符串数组
  compileArr = (arr,str)=>{
    const resolveArr = []
    if(arr && arr.length>0){
      arr.map((item,index)=>{
        if(index === arr.length-1){
          if(index===0 && item.start !== 0){
            const noSelect = {}
            // const randomCount = Math.random();
            // const curTime = new Date().getTime();
            // const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
            const id = arr[index].id - 1
            noSelect.id = id
            noSelect.selected = false
            noSelect.start = 0
            noSelect.end = arr[index].start
            noSelect.str = str.slice(noSelect.start, noSelect.end)
            resolveArr.push(noSelect)
          }
          resolveArr.push(item)
          const noSelect = {}
          // const randomCount = Math.random();
          // const curTime = new Date().getTime();
          // const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
          const id = arr[index].id + 1
          noSelect.id = id
          noSelect.selected = false
          noSelect.start = item.end
          noSelect.end = str.length
          noSelect.str = str.slice(noSelect.start, noSelect.end)
          resolveArr.push(noSelect)
        }else{
          if(index===0 && item.start !== 0){
            const noSelect = {}
            // const randomCount = Math.random();
            // const curTime = new Date().getTime();
            // const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
            const id = arr[index].id - 1
            noSelect.id = id
            noSelect.selected = false
            noSelect.start = 0
            noSelect.end = arr[index].start
            noSelect.str = str.slice(noSelect.start, noSelect.end)
            resolveArr.push(noSelect)
          }
          resolveArr.push(item)
          const noSelect = {}
          // const randomCount = Math.random();
          // const curTime = new Date().getTime();
          // const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
          const id = arr[index].id + 1
          noSelect.id = id
          noSelect.selected = false
          noSelect.start = item.end
          noSelect.end = arr[index+1].start
          noSelect.str = str.slice(noSelect.start, noSelect.end)
          resolveArr.push(noSelect)
        }
      })
    }
    return resolveArr
  }
  //交叉选择判断
  isIntersect = (arr,start,end)=>{
    let isIn = false
    if(arr && arr.length>0){
      isIn = arr.some(item=>{
        const istart = item.start
        const iend = item.end
        return ((istart<start || istart == start) && (start<iend)) || ((istart<end) && (end<iend || end == iend))
      })
    }
    return isIn
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    if(this.state.curSnippet.name === ''){
      message.warning('字段名不能为空')
    }else{
      const selArr = _.cloneDeep(this.state.selArr)
      const isRename = selArr.some(item=>{
        return item.name === e.target.value
      })
      if(isRename){
        message.warning('请不要用重复字段名')
      }else{
        const curArr = _.cloneDeep(this.state.selArr)
        const newArr = _.cloneDeep(this.state.curSnippet)
        curArr.push(newArr)
        //对数组排序
        const haha = _.sortBy(curArr,(item)=>{
          return item.start
        })
        if(this._isMounted){
          this.setState({
            selArr: _.cloneDeep(haha)
          },()=>{
            const wholeArr = this.compileArr(this.state.selArr,this.state.message)
            if(this._isMounted){
              this.setState({
                wholeArr
              },()=>{
                this.handleCancel()
                const reg = decodeArr(this.state.wholeArr, this.state.messageForSelectModel)
                if(this._isMounted){
                  this.setState({
                    pattern: reg
                  })
                }
              })
            }
          })
        }
      }
    }
  }

  handleCancel = e => {
    if(this._isMounted){
      this.setState({
        visible: false,
        curSnippet:{
          id:'',
          start:'',
          end:'',
          str: '',
          name:''
        }
      })
    }
  }
  modalCancel = e=>{
    if(this._isMounted){
      this.setState({
        modalVisible: false,
        selArr:[],//被选中的数据段
        wholeArr:[],//最终编译数组
        curSnippet:{
          id:'',
          start:'',
          end:'',
          str: '',
          name:'',
          selected:''
        },
        rulename:'',
        appname:'',
        ruledes:'',
        lastOne: {
          message: '',
          pattern: '',
          result: '',
        },
        message:'',
        pattern:'',
        result:'',
        drawerVisible: false
      })
    }
  }
  partCancel =()=>{
    if(this._isMounted){
      this.setState({
        modalVisible: false,
        rulename:'',
        appname:'',
        ruledes:'',
        result:''
      })
    }
  }

  modalShow =  e=>{
    if(this._isMounted){
      this.setState({
        modalVisible: true
      })
    }
  }
  curSnippetChange = (e)=>{
    const cur = _.cloneDeep(this.state.curSnippet)
    const compileCur = Object.assign({},this.state.curSnippet,{name: e.target.value})
    if(this._isMounted){
      this.setState({
        curSnippet: _.cloneDeep(compileCur)
      })
    }
  }
  clearData = ()=>{
    if(this._isMounted){
      this.setState({
        selArr:[],//被选中的数据段
        wholeArr:[],//最终编译数组
        curSnippet:{
          id:'',
          start:'',
          end:'',
          str: '',
          name:'',
          selected:''
        },
        pattern:'',
        result:''
      })
    }
  }

  messageChange = (e)=>{
    if(this._isMounted){
      this.setState({
        message: e.target.value
      })
    }
  }
  curruleChange = (value)=>{
    if(this._isMounted){
      this.setState({
        currule: value,
        isSelectModel:false,
        isExistModel: true,
        selArr:[],//划词时被选中的数据例
        wholeArr:[],//通过选中的数据例，编译出的整条数据例
      },()=>{
        //此时取消划词模式,并匹配出pattern
        let pattern = ''
        const ruleList = this.state.ruleList
        if(value === ''){
          this.setState({
            pattern:''
          })
        }else{
          for (let item of ruleList){
            if(item.rulename === value){
              pattern = item.pattern
              this.setState({
                pattern
              })
              break
            }
          }
        }
      })
    }
  }
  patternChange = (e)=>{
    if(this._isMounted){
      this.setState({
        pattern: e.target.value
      })
    }
  }
  // setActiveKey = (value)=>{
  //   if(this._isMounted){
  //     this.setState({
  //       activeKey: value
  //     })
  //   }
  // }
  doAnalysis = ()=>{
    if(this.state.message !== '' && this.state.pattern !== ''){
      const { message, pattern } =  this.state
      wyAxiosPost('Rule/getMsgByGrok',{message, pattern},(result)=>{
        const response = result.data.msg
        if(this._isMounted){
          this.setState({
            result: response
          },()=>{
            this.setState({
              lastOne: {
                message: this.state.message,
                pattern: this.state.pattern,
                result: this.state.result,
              }
            })
          })
        }
      })
    }else{
      message.warning('抱歉，数据实例和解析规则必须填写');
    }
  }
  curTimeChange = (value)=>{
    if(this._isMounted){
      this.setState({
        curTime: value
      },()=>{
        this.getLog()
      })
    }
  }
  //获取日志
  getLog = ()=>{
    const {compile_status,group_app} = this.state
    const start_time = this.state.curTime[0]
    const last_time = this.state.curTime[1]

    const info = {compile_status,start_time,last_time,group_app}
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Elastic/getLogs',{info},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      const statusIndex = _.findIndex(curxData,(o)=>{return o.dataIndex === 'status'})
      curxData[statusIndex].render = (text, record, index)=><span>{text==='success'?<i css={{color:"#01bd4c"}} className="fa fa-check" aria-hidden="true"></i>:<i className="fa fa-minus" aria-hidden="true"></i>}</span>
      curxData.push({
        title: '操作',
        dataIndex: 'asexample',
        render: (text, record, index)=><Button size="small" type="primary" style={{cursor:"pointer"}} onClick={()=>this.asExample(record.message,record.appname)}>
        设为日志样例
        </Button>
      })
      const curTime = []
      curTime.push(responseData.start_time)
      curTime.push(responseData.last_time)
      if(this._isMounted){
        this.setState({
          xData: curxData,
          yData: responseData.yyy,
          curTime,
          isSpining: false
        })
      }
    })
  }
  //设为样例
  asExample = (message,appname)=>{
    this.setState({
      //此时将已经划词的数据清除，将message和messageForSelectModel同步
      message,
      messageForSelectModel: message,
      pattern:'', //供匹配的正则
      result: '', //解析出来的结果
      lastOne: {   //最近一次执行解析之后的三个量的值
        message: '',
        pattern: '',
        result: '',
      },
      selArr:[],//划词时被选中的数据例
      wholeArr:[],//通过选中的数据例，编译出的整条数据例
      curSnippet:{ //最近一次选中的数据例的各个属性信息
        id:'',
        start:'',
        end:'',
        str: '',
        name:'',
        selected:''
      },
      currule:'', //已有规则中选择时，被选中的规则
      drawerVisible: true,
      appname
    },()=>{
      this.getCurRuleList(appname)
    })
  }
  isLegal = ()=>{
    const {pattern,message,result} = this.state
    let isLegal = true
    if(
      pattern === this.state.lastOne.pattern &&
      _.isEqual(message, this.state.lastOne.message) &&
      _.isEqual(result, this.state.lastOne.result)
    ){
      if(result !== ''){
        if(result !=='{}' && result !=='null'){
          //this.modalShow()
          isLegal = true
        }else{
          isLegal = false
          message.warning('规则有误')
        }
      }else{
        isLegal = false
        message.warning('请先填写规则')
      }
    }else{
      isLegal = false
      message.warning('你还未执行解析，或者更改数据后未重新解析')
    }

    return isLegal
  }
  readySave = ()=>{
    if(this.isLegal()){
      this.modalShow()
    }
  }
  //保存规则
  saveRule = ()=>{
    if(this.state.rulename !== '' && forName.test(this.state.rulename)){
      const {rulename,ruledes,message,pattern,id,appname} = this.state
      wyAxiosPost('Rule/saveRule',{rulename,ruledes,message,pattern,id,appname},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          this.modalCancel()
        }else{
          message.warning(responseData.msg)
        }
      })
    }else{
      message.warning('规则名称未填写或填写有误')
    }
  }
  rulenameChange = (e)=>{
    if(this._isMounted){
      this.setState({
        rulename: e.target.value
      })
    }
  }
  ruledesChange = (e)=>{
    if(this._isMounted){
      this.setState({
        ruledes: e.target.value
      })
    }
  }

  //抽屉组件
  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    })
  }

  drawerClose = () => {
    this.setState({
      selArr:[],//被选中的数据段
      wholeArr:[],//最终编译数组
      curSnippet:{
        id:'',
        start:'',
        end:'',
        str: '',
        name:'',
        selected:''
      },
      rulename:'',
      appname:'',
      ruledes:'',
      lastOne: {
        message: '',
        pattern: '',
        result: '',
      },
      message:'',
      pattern:'',
      result:'',
      drawerVisible: false
    })
  }

  group_appChange = (value)=>{
    if(this._isMounted){
      this.setState({
        group_app: value
      },()=>{
        this.getLog()
      })
    }
  }
  displayRender = (label)=>{
    return label.join(' / ')
  }
  //气泡框相关
  changeCondition = () => {
    //此处判断是否修改过现有规则

  }

  confirm = () => {
    this.setState({ popVisible: false });
    const { condition } = this.state
    if(condition){
      //此处将rule关联到app
      const { currule, appname } = this.state
      const info = {}
      info.rulename = currule
      info.appname = appname
      wyAxiosPost('Source/updateSourceByAppRule',{info},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
        }else{
          message.warning(responseData.msg)
        }
      })
    }else{
      //此处保存为新的rule
      this.showModal()
    }
  }


  cancel = () => {
    this.setState({ popVisible: false });
    message.warning('您已取消该操作');
  }

  handleVisibleChange = popVisible => {

    if(!this.isLegal()){
      return
    }
    const existRule = this.state.currule
    let existRulePattern = ''
    for (let item of this.state.ruleList){
      if(item.rulename === existRule){
        existRulePattern = item.pattern
        break
      }
    }
    const { pattern }  = this.state

    const isHide = existRulePattern === pattern
    if(isHide){
      this.setState({
        popVisible: false,
        condition: true
      },()=>{
        this.confirm()
      })
    }else{
      this.setState({
        popVisible: true,
        condition: false
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
    let str = ''
    if(this.state.result){
      str = JSON.stringify(JSON.parse(this.state.result), null, 4)
    }
    return (
      <div>
        <Row css={{marginTop:"20px"}}>
          <Col>
            <Amodule>
              <div css={{display:"flex",height:"40px"}}>
                <div css={{flex:"1 1 auto"}}>

                  <Cascader
                    options={this.state.groupAppList}
                    displayRender={this.displayRender}
                    onChange={this.group_appChange}
                    value={this.state.group_app}
                    size="small"
                    css={{minWidth:"240px"}}
                  />
                  <Select size="small"
                    css={{minWidth:"160px",marginLeft:"20px"}}
                    value={this.state.compile_status}
                    onChange={this.compile_statusChange}
                  >
                    <Option key='all' value='all'>所有日志</Option>
                    <Option key='uncompile' value='uncompile'>未解析日志</Option>
                    <Option key='compiled' value='compiled'>已解析日志</Option>
                  </Select>
                </div>
                <div>
                  <WyDatePicker
                    rangeTimeChange={ this.curTimeChange }
                    curTime={this.state.curTime}
                  />
                </div>
              </div>
              <div>
                <WySpin isSpining={this.state.isSpining}>
                  <WyTable
                    xData={this.state.xData.length>0?this.state.xData:[]}
                    yData={this.state.yData.length>0?this.state.yData:[]}
                    pageSize={this.state.pageSize}
                    onShowSizeChange={this.pageSizeChange}
                    expandedRowRender={record => { return <div style={{ margin: 0 }}>
                        <pre>
                          { JSON.stringify(record.subdata, null, 4) }
                        </pre>
                      </div>}
                    }
                  />
                </WySpin>
              </div>
            </Amodule>
          </Col>
        </Row>

        <Modal
          title="字段提取"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>字段名：<Input
            css={{width:"80%"}}
            value={this.state.curSnippet.name}
            onChange={this.curSnippetChange}
          /></p>
          <p>匹配对象：{this.state.curSnippet.str}</p>
        </Modal>
        <Modal
          title="为规则命名"
          visible={this.state.modalVisible}
          onOk={this.saveRule}
          onCancel={this.partCancel}
        >
          <div css={{display:"flex",lineHeight:"40px"}}>
            <div css={{flex:"0 0 100px"}}>规则名称：</div>
            <div css={{flex:"1 1 auto"}}><Input value={this.state.rulename} onChange={this.rulenameChange}/></div>
          </div>
          <div css={{display:"flex",lineHeight:"40px"}}>
            <div css={{flex:"0 0 100px"}}>匹配应用：</div>
            <div css={{flex:"1 1 auto"}}>
              <Select
                showSearch
                optionFilterProp="children"
                onChange={this.appnameChange}
                css={{width:"100%"}}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.appname}
              >
                <Option value="">不限</Option>
                {
                  this.state.appNameList && this.state.appNameList.length>0?
                  this.state.appNameList.map(item=>{
                    return <Option key={item} value={item}>{item}</Option>
                  })
                  :
                  ''
                }
              </Select>
            </div>
          </div>
          <div css={{display:"flex",lineHeight:"40px"}}>
            <div css={{flex:"0 0 100px"}}>规则描述：</div>
            <div css={{flex:"1 1 auto"}}><TextArea value={this.state.ruledes} onChange={this.ruledesChange}/></div>
          </div>
        </Modal>
        <Drawer
          title="规则匹配"
          width="80%"
          placement="right"
          closable={false}
          onClose={this.drawerClose}
          visible={this.state.drawerVisible}
        >
          <div css={{padding: "20px"}}>
            <span css={{verticalAlign:"top"}}>数据实例: </span>
            {
              this.state.isSelectModel ?
              <div css={{padding:"5px 0 0 10px",width:"80%",display:"inline-block",border:"#22c960 solid 1px",position:"relative",minHeight:"50px",borderRadius:"5px"}}>
                <span css={{wordWrap:"break-word"}}>
                  {
                    this.state.wholeArr.length>0?
                    this.state.wholeArr.map(item=>{
                        return <span style={{ background:item.selected?'rgba(204,255,0,0.8)':'none'}} key={item.id}>{item.str}</span>
                    })
                    :
                    this.state.messageForSelectModel
                  }
                </span>
                <TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  value={this.state.messageForSelectModel}
                  onSelect={this.selectWord}
                  css={{border: "none",position:"absolute",left:"0px",top:"0px",background:"none",color:"rgba(123,111,255,0.5)"}}
                />
              </div>

              :
              <TextArea
                autosize={{ minRows: 2, maxRows: 6 }}
                value={this.state.message}
                onChange={this.messageChange}
                css={{width:"80%"}}
              />
            }
          </div>
          <div css={{paddingLeft:"100px"}}>
            <span><Checkbox onChange={this.isSelectModelChange} checked={this.state.isSelectModel}>划词匹配</Checkbox></span>
            {
              this.state.wholeArr.length>0?
              <span><Button onClick={this.clearData} size="small" type="primary">重新选择</Button></span>
              :
              ''
            }

            <span css={{marginLeft:"20px",display: "inline-block"}}>
              <Select
                showSearch
                optionFilterProp="children"
                onChange={this.curruleChange}
                css={{width:"200px"}}
                size="small"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.currule}
              >
                <Option key="mykey" value="">请选择</Option>
                {
                    this.state.ruleList && this.state.ruleList.length>0?
                    this.state.ruleList.map(item=>{
                      return <Option key={item.rulename} value={item.rulename} title={item.rulename}>{item.rulename}</Option>
                    })
                    :
                    ''
                }

              </Select>
            </span>
          </div>
          <div css={{padding: "20px"}}>
            <span css={{verticalAlign:"top"}}>Grok解析: </span><TextArea autosize={{ minRows: 2, maxRows: 6 }} value={this.state.pattern} onChange={this.patternChange}  css={{width:"80%"}} />
          </div>
          <div css={{padding: "20px"}}>
            <Button onClick={this.doAnalysis}>解析</Button>
          </div>
          <div css={{padding: "20px"}}>
            <span css={{verticalAlign:"top"}}>解析结果：</span><span css={{overflow:"auto",display:"inline-block",width: "80%",minHeight:"200px",border:"rgba(255,255,255,0.2) solid 1px"}}>
              <pre>{
                str
              }</pre>
            </span>
          </div>
          {
            this.state.isExistModel?
            <Popconfirm
              title="您更改了当前所选规则，是否命名为新的规则并关联此应用？"
              visible={this.state.popVisible}
              onVisibleChange={this.handleVisibleChange}
              onConfirm={this.confirm}
              onCancel={this.cancel}
              okText="确定"
              cancelText="取消"
            >
            <Button type="primary">将该规则关联到此日志例所在应用</Button>
            </Popconfirm>
            :
            <Button  type="primary" onClick={this.readySave} >保存Grok解析规则</Button>
          }

        </Drawer>
      </div>
    )
  }
}

export default Configure
