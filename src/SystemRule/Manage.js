/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, { Component } from 'react'
import { Input, Button, Drawer, Row, Col, message, Modal,Popconfirm, Checkbox, Select } from 'antd'
import _ from 'lodash'
import JSONFormatter from 'json-formatter-js'


import { Amodule } from '../components/Amodule'
import  WyTable  from '../components/WyTable'
import { wyAxiosPost} from '../components/WyAxios'
import WySpin from '../components/WySpin'
import { forName } from '../components/RegExp'
import decodeArr from './decodeArr'
const TextArea = Input.TextArea
const { Option } = Select
class Manage extends Component{
  state = {
    message: '',
    messageForSelectModel:'', //划词时候的日志样例
    pattern:'',
    result: '',
    visible: false,
    modalVisible: false,
    rulename: '',
    ruledes:'',
    lastOne: {   //最近一次执行解析之后的三个量的值
      message: '',
      pattern: '',
      result: '',
    },

    pageSize:5,
    isSpining: false,
    ids:[],
    xData: [],
    yData: [],
    id:'',

    modal2visible: false,
    curSnippet:{ //最近一次选中的数据例的各个属性信息
      id:'',
      start:'',
      end:'',
      str: '',
      name:'',
      selected:''
    },
    isSelectModel: false,//是否是划词匹配模式
    selArr:[],//划词时被选中的数据例
    wholeArr:[],//通过选中的数据例，编译出的整条数据例
  }
  componentDidMount(){
    this._isMounted = true
    this.getRule()
  }
  showDrawer = () => {
    if(this._isMounted){
      this.setState({
        visible: true,
      })
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

  onClose = () => {
    if(this._isMounted){
      this.setState({
        visible: false,
        message: '',
        pattern:'',
        result: '',
        rulename: '',
        ruledes:'',
        lastOne:{},
        id:''
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
  patternChange = (e)=>{
    if(this._isMounted){
      this.setState({
        pattern: e.target.value
      })
    }
  }
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
  showModal = () => {
    if(this._isMounted){
      this.setState({
        modalVisible: true,
      })
    }
  }

  handleCancel = (e) => {
    if(this._isMounted){
      this.setState({
        modalVisible: false,
      })
    }
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
    if(this.isLegal() && this._isMounted){
      this.setState({
        modalVisible: true
      })
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
          this.handleCancel()
          this.onClose()
          this.getRule()
        }else{
          message.warning(responseData.msg)
        }
      })
    }else{
      message.warning('规则名称未填写或填写有误')
    }
  }
  getRule = ()=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Rule/getRule',{},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      curxData.push({
        title: '编辑',
        dataIndex: 'edit',
        render: (text, record, index)=><span style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>this.editRule(record.id)}><i className="fa fa-pencil-square" aria-hidden="true"></i></span>
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
  pageSizeChange = (current, size)=>{
    if(this._isMounted){
      this.setState({
        pageSize: size
      })
    }
  }
  //编辑
  editRule = (id)=>{
    wyAxiosPost('Rule/getRule',{id},(result)=>{
      const responseData = result.data.msg
      const {message, pattern,rulename,ruledes,id} = responseData
      if(this._isMounted){
        this.setState({
          message,
          pattern,
          rulename,
          ruledes,
          id,
          lastOne:{
            pattern,
            message,
            result:''
          }
        },()=>{
          this.showDrawer()
        })
      }
    })
  }
  //删除
  delRule = ()=>{
    wyAxiosPost('Rule/delRule',{ids: this.state.ids},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        message.success(responseData.msg)
        if(this._isMounted){
          this.setState({
            ids: []
          },()=>{
            this.getRule()
          })
        }
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  handle2Ok = e => {
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
                this.handle2Cancel()
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
  handle2Cancel = e => {
    if(this._isMounted){
      this.setState({
        modal2visible: false,
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
  curSnippetChange = (e)=>{
    const cur = _.cloneDeep(this.state.curSnippet)
    const compileCur = Object.assign({},this.state.curSnippet,{name: e.target.value})
    if(this._isMounted){
      this.setState({
        curSnippet: _.cloneDeep(compileCur)
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
        },
        modal2visible: true
      })
    }
  }
  isSelectModelChange = (e)=>{
    if(this._isMounted){
      this.setState({
        isSelectModel: e.target.checked,
        messageForSelectModel: e.target.checked?this.state.message:'',
        selArr:[],
        wholeArr:[],
        currule:'',
        pattern:'',
        result:''
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
    let str = ''
    if(this.state.result){
      str = JSON.stringify(JSON.parse(this.state.result), null, 4)
    }
    return(
      <div>
        <div>
          <Amodule>
              <Row>
                <Col>
                  <Button onClick={this.showDrawer} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加</span></Button>
                  <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delRule:()=>{}} okText="确定" cancelText="取消">
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
        </div>
        <Drawer
          title="数据源配置"
          placement="right"
          onClose={this.onClose}
          visible={this.state.visible}
          width={"80%"}
        >
        {
          // <div css={{padding: "20px"}}>
          //   <span css={{verticalAlign:"top"}}>数据实例: </span><TextArea autosize={{ minRows: 2, maxRows: 6 }} value={this.state.message} onChange={this.messageChange} css={{width:"80%"}} />
          // </div>
          // <div css={{padding: "20px"}}>
          //   <span css={{verticalAlign:"top"}}>Grok解析: </span><TextArea autosize={{ minRows: 2, maxRows: 6 }} value={this.state.pattern} onChange={this.patternChange}  css={{width:"80%"}} />
          // </div>
          // <div css={{padding: "20px"}}>
          //   <Button onClick={this.doAnalysis}>解析</Button>
          // </div>
          // <div css={{padding: "20px"}}>
          //   <span css={{verticalAlign:"top"}}>解析结果：</span><span css={{overflow:"auto",display:"inline-block",width: "80%",minHeight:"200px",border:"rgba(255,255,255,0.2) solid 1px"}}>
          //     <pre>{str}</pre>
          //   </span>
          // </div>
          // <Button  type="primary" onClick={this.readySave} >保存Grok解析</Button>
        }
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
          <Button  type="primary" onClick={this.readySave} >保存Grok解析规则</Button>
        </Drawer>
        <Modal
          title="字段提取"
          visible={this.state.modal2visible}
          onOk={this.handle2Ok}
          onCancel={this.handle2Cancel}
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
          onCancel={this.handleCancel}
        >
          <div css={{display:"flex",lineHeight:"40px"}}>
            <div css={{flex:"0 0 100px"}}>规则名称：</div>
            <div css={{flex:"1 1 auto"}}><Input value={this.state.rulename} onChange={this.rulenameChange}/></div>
          </div>
          <div css={{display:"flex",lineHeight:"40px"}}>
            <div css={{flex:"0 0 100px"}}>规则描述：</div>
            <div css={{flex:"1 1 auto"}}><TextArea value={this.state.ruledes} onChange={this.ruledesChange}/></div>
          </div>
        </Modal>
      </div>
    )
  }
}


export default Manage
