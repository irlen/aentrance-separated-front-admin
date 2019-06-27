/**  @jsx jsx */
import React ,{ Component } from 'react'
import { Drawer, Button, Row, Col, Input, Tabs, Select, Popconfirm, message } from 'antd'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import _ from 'lodash'

import  WyTable  from '../components/WyTable'
import LogSet from './LogSet'
import { Amodule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import WySpin from '../components/WySpin'
import { singleIp, singlePort, forName } from '../components/RegExp'
const TabPane = Tabs.TabPane
const TextArea = Input.TextArea
const Option = Select.Option
const Password = Input.Password
let AddLogSetDom = styled.div({
  lineHeight:"40px",
  border: "rgba(255,255,255,0.2) dashed 1px",
  borderRadius:"5px",
  textAlign:"center",
  cursor:"pointer",
  marginTop:"10px",
  '&:hover':{
    background: "rgba(0,0,0,0.2)"
  },
  '&:active':{
    background: "rgba(0,0,0,0.4)"
  }
})
class AutoSet extends Component {
  state = {
    visible: false,

    sourcename:'',
    sourcedes:'',
    hostname:'', //主机名称
    hostip:'', //主机Ip
    hostuser:'', //主机用户名
    hostpassword:'', //主机密码
    hostport:'', //主机端口
    sysplatform:'linux',//主机系统
    logList:[],  //日志列表
    setype:'handset',

    activeKey:'1',


    pageSize:5,
    isSpining: false,
    ids:[],
    xData: [],
    yData: [],
    id:'',
    //新增分组
    isNew: false,
    g_name:'',
    g_des:'',
    groupList:[],
    selgroup:[],
  }
  componentDidMount(){
    this._isMounted = true
    this.getSource()
    this.getGroup()
  }
  selgroupChange = (value)=>{
    const nameArr = value
    const idArr = this.nameToId(this.state.groupList,'g_name',nameArr,'id')
    if(this._isMounted){
      this.setState({
        selgroup: _.cloneDeep(idArr)
      })
    }
  }
  //name和id转换
  nameToId = (arr,nameField,nameArr,idField)=>{
    const idArr = []
    if(nameArr && nameArr.length>0){
      nameArr.map(item=>{
        const obj = _.find(arr,(o)=>{return o[nameField] === item})
        idArr.push(obj[idField])
      })
    }
    return idArr
  }
  idToName = (arr,idField,idArr,nameField)=>{
    const nameArr = []
    if(idArr && idArr.length>0){
      idArr.map(item=>{
        const obj = _.find(arr,(o)=>{return o[idField] === item})
        nameArr.push(obj[nameField])
      })
    }
    return nameArr
  }
  //获取分组
  getGroup = ()=>{
    wyAxiosPost('Group/getGroup',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          groupList: responseData.yyy,
        })
      }
    })
  }
  //新增分组
  addNewGroup = ()=>{
    if(this._isMounted){
      this.setState({
        isNew: true
      })
    }
  }
  //取消新增
  addCancel = ()=>{
    if(this._isMounted){
      this.setState({
        isNew: false,
        g_name:'',
        g_des:''
      })
    }
  }
  //保存分组
  addOk = ()=>{
    const { g_name,g_des } = this.state
    if(g_name === ''){
      message.warning('组名不能为空')
    }else{
      const info = {g_name,g_des}
      wyAxiosPost('Group/saveGroup',{info},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          if(this._isMounted){
            this.setState({
              isNew: false,
              g_name:'',
              g_des:''
            })
          }
          this.getGroup()
        }else{
          message.warning(responseData.msg)
        }
      })
    }
  }
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
  //获取数据源
  getSource = ()=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Source/getSource',{},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
      curxData.push({
        title: '操作',
        dataIndex: 'edit',
        render: (text, record, index)=>{
          let dom = ''
          if(record.sysplatform === 'linux'){
            dom = <span>
                    <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>this.editSource(record.id)}>
                      <i className="fa fa-pencil-square" aria-hidden="true"></i>
                    </span>
                    <span title="下载安装包" style={{cursor:"pointer",color: "#00CC66",marginLeft:"20px"}} onClick={()=>this.downLoadInstall(record.id)}>
                      <i className="fa fa-cloud-download" aria-hidden="true"></i>
                    </span>
                    <span title="下载配置文件" style={{cursor:"pointer",color: "#00CC66",marginLeft:"20px"}} onClick={()=>this.downLoadFile(record.id)}>
                      <i className="fa fa-download" aria-hidden="true"></i>
                    </span>
                    <span title="安装" style={{cursor:"pointer",color: "#00CC66",marginLeft:"20px"}} onClick={()=>this.doInstall(record.id)}>
                      <i className="fa fa-wrench" aria-hidden="true"></i>
                    </span>
                    <Popconfirm
                      title="您确定要卸载吗?"
                      onConfirm={()=>this.doUninstall(record.id)}
                      onCancel={()=>{ return }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <span title="卸载" style={{cursor:"pointer",color: "#00CC66",marginLeft:"20px"}}>
                        <i className="fa fa-chain-broken" aria-hidden="true"></i>
                      </span>
                    </Popconfirm>

                  </span>
          }else if(record.sysplatform === 'windows'){
            dom = <span>
                    <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>this.editSource(record.id)}>
                      <i className="fa fa-pencil-square" aria-hidden="true"></i>
                    </span>
                    <span title="下载安装包" style={{cursor:"pointer",color: "#00CC66",marginLeft:"20px"}} onClick={()=>this.downLoadInstall(record.id)}>
                      <i className="fa fa-cloud-download" aria-hidden="true"></i>
                    </span>
                    <span title="下载配置文件" style={{cursor:"pointer",color: "#00CC66",marginLeft:"20px"}} onClick={()=>this.downLoadFile(record.id)}>
                      <i className="fa fa-download" aria-hidden="true"></i>
                    </span>
                  </span>
          }
          return dom
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
  //下载安装包
  downLoadInstall = (id)=>{
    wyAxiosPost('Source/download',{id},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 0){
        message.warning(responseData.msg)
        return
      }
      const a = document.createElement('a'); //创建一个<a></a>标签
      a.href = responseData.msg; // response is a blob
      a.download = "intimatelog_install.zip";  //文件名称
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }
  //下载配置文件
  downLoadFile = (id)=>{
    wyAxiosPost('Source/uploadYaml',{id},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 0){
        message.warning(responseData.msg)
        return
      }
      const a = document.createElement('a'); //创建一个<a></a>标签
      a.href = responseData.msg; // response is a blob
      //a.download = "";  //文件名称
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }
  //安装
  doInstall = (id)=>{
    wyAxiosPost('Source/install',{id},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        message.success(responseData.msg)
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  //卸载
  doUninstall = (id)=>{
    wyAxiosPost('Source/uninstall',{id},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        message.success(responseData.msg)
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  //编辑
  editSource = (id)=>{
    wyAxiosPost('Source/getSource',{id},(result)=>{
      const responseData = result.data.msg
      let logList = responseData.logList
      if(logList && logList.length>0){
        for(let item of logList){
          item.logissingle = item.logissingle ==='true'?true:false
          item.logisreread = item.logisreread ==='true'?true:false
        }
      }
      const {
        sourcename,
        sourcedes,
        hostname, //主机名称
        hostip, //主机Ip
        hostuser, //主机用户名
        hostpassword, //主机密码
        hostport, //主机端口
        sysplatform,//主机系统
        setype,
        id,
        selgroup
      } = responseData
      if(this._isMounted){
        this.setState({
          sourcename,
          sourcedes,
          hostname, //主机名称
          hostip, //主机Ip
          hostuser, //主机用户名
          hostpassword, //主机密码
          hostport, //主机端口
          sysplatform,//主机系统
          logList,  //日志列表
          setype,
          id,
          selgroup
        },()=>{
          this.showDrawer()
        })
      }
    })
  }
  dataChange = (e,arg)=>{
    for(let item of Object.keys(this.state)){
      if(item === arg){
        if(this._isMounted){
          this.setState({
            [arg]: e.target.value
          })
        }
        break
      }
    }
  }
  sysplatformChange = (value)=>{
    let setype = this.state.setype
    if(value === 'windows'){
      setype = 'handset'
    }
    if(this._isMounted){
      this.setState({
        sysplatform: value,
        hostuser:'', //主机用户名
        hostpassword:'', //主机密码
        hostport:'', //主机端口
        setype
      })
    }
  }
  setypeChange = (setype)=>{
    if(this._isMounted){
      this.setState({
        setype
      })
    }
  }
  doAddLog = ()=>{
    const randomCount = Math.random();
    const curTime = new Date().getTime();
    const asId = parseInt(randomCount,10) + parseInt(curTime,10)*100
    const id = asId.toString()
    const curLog = {
      id,
      logpath:'',
      logisreread: false,
      logissingle: true,
      logtag:'',
      logrule:[]
    }
    const curLogList = _.cloneDeep(this.state.logList)
    curLogList.push(curLog)
    if(this._isMounted){
      this.setState({
        logList: [...curLogList]
      })
    }
  }
  doDeleteLog = (id)=>{
    const curLogList = _.cloneDeep(this.state.logList)
    for(let i=0; i<curLogList.length; i++){
      if(curLogList[i].id === id){
        curLogList.splice(i,1)
        break
      }
    }
    if(this._isMounted){
      this.setState({
        logList: [...curLogList]
      })
    }
  }
  updateLog = (id,arg,value)=>{
    const curLogList = _.cloneDeep(this.state.logList)
    for(let i=0; i<curLogList.length; i++){
      if(curLogList[i].id === id){
        curLogList[i][arg] = value
        break
      }
    }
    if(this._isMounted){
      this.setState({
        logList: [...curLogList]
      })
    }
  }
  showDrawer = () => {
    if(this._isMounted){
      this.setState({
        visible: true,
      })
    }
  }
  onClose = () => {
    if(this._isMounted){
      this.setState({
        visible: false,
        sourcename:'',
        sourcedes:'',

        hostname:'', //主机名称
        hostip:'', //主机Ip
        hostuser:'', //主机用户名
        hostpassword:'', //主机密码
        hostport:'22', //主机端口
        sysplatform:'linux',//主机系统
        logList:[],  //日志列表
        setype:'handset',
        id:'',
        activeKey:'1',
        selgroup:[]
      })
    }
  }
  //保存数据源
  doSave = ()=>{
    const {
      sourcename,
      sourcedes,
      hostname, //主机名称
      hostip, //主机Ip
      hostuser, //主机用户名
      hostpassword, //主机密码
      hostport, //主机端口
      sysplatform,//主机系统
      logList,  //日志列表
      setype,
      id,
      selgroup
    } = this.state
    const info = {
      sourcename,
      sourcedes,
      hostname, //主机名称
      hostip, //主机Ip
      hostuser, //主机用户名
      hostpassword, //主机密码
      hostport, //主机端口
      sysplatform,//主机系统
      logList,  //日志列表
      setype,
      id,
      selgroup
    }
    //合法性校验
    const erroList = []

    if(info.sourcename === ''){
      erroList.push('数据源名称不能为空')
    }else if(! forName.test(info.sourcename)){
      erroList.push('数据源名称格式不正确')
    }
    if(info.selgroup.length === 0){
      erroList.push('所属分组不能为空')
    }
    if(info.hostip === ''){
      erroList.push('主机ip不能为空')
    }else if(! singleIp.test(info.hostip)){
      erroList.push('主机ip格式不正确')
    }
    if(info.sysplatform === 'linux'){
      if(info.hostuser === ''){
        erroList.push('用户名不能为空')
      }
      if(info.hostpassword === ''){
        erroList.push('密码不能为空')
      }
      if(info.hostport !== '' && (!singlePort.test(info.hostport))){
        erroList.push('SSH端口无效')
      }
    }
    if(info.logList.length === 0){
      erroList.push('未添加日志信息')
    }else{
      for(let item of logList){
        if(item.logpath === '' || item.logtag === ''){
          erroList.push('日志信息未填写完整')
          break
        }
      }
    }

    if(erroList.length === 0){
      wyAxiosPost('Source/saveSource',{info},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          this.onClose()
          this.getSource()
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
  //删除
  delSource = ()=>{
    if(this.state.ids.length === 0){
      message.warning('请选择要删除的项')
    }else{
      wyAxiosPost('Source/delSource',{ids: this.state.ids},(result)=>{
        const responseData = result.data.msg
        if(responseData.status === 1){
          message.success(responseData.msg)
          if(this._isMounted){
            this.setState({
              ids: []
            },()=>{
              this.getSource()
            })
          }
        }else{
          message.warning(responseData.msg)
        }
      })
    }
  }
  tabsChange = (activeKey)=>{
    if(this._isMounted){
      this.setState({
        activeKey
      })
    }
  }
  lastStep = ()=>{
    let activeKey = this.state.activeKey
    let lastKey = parseInt(activeKey) - 1
    lastKey = lastKey.toString()
    if(this._isMounted){
      this.setState({
        activeKey: lastKey
      })
    }
  }
  nextStep = ()=>{
    let activeKey = this.state.activeKey
    let nextKey = parseInt(activeKey) + 1
    nextKey = nextKey.toString()
    if(this._isMounted){
      this.setState({
        activeKey: nextKey
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
    return(
      <div>
        <div>
          <Amodule>
              <Row>
                <Col>
                  <Button onClick={this.showDrawer} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加</span></Button>
                  <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delSource:()=>{}} okText="确定" cancelText="取消">
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
          <Row>
            <Col>
              <Tabs defaultActiveKey="1" activeKey={this.state.activeKey} onChange={this.tabsChange}>
                <TabPane tab="基本信息" key="1">
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>数据源名称：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}> <Input value={this.state.sourcename} onChange={(e)=>this.dataChange(e,'sourcename')} css={{width:"420px"}}/></div>
                  </div>
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>数据源描述：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}> <Input value={this.state.sourcedes} onChange={(e)=>this.dataChange(e,'sourcedes')} css={{width:"420px"}}/></div>
                  </div>
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>所属分组：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}>
                    <Select
                      mode="multiple"
                      placeholder="Please select"
                      style={{ width: '320px' }}
                      onChange={this.selgroupChange}
                      value={this.idToName(this.state.groupList,'id',this.state.selgroup,'g_name')}
                    >
                    {
                      this.state.groupList && this.state.groupList.length>0?
                      this.state.groupList.map(item=>{
                        return <Option key={item.id} value={item.g_name} title={item.g_name}>{item.g_name}</Option>
                      })
                      :
                      ''
                    }
                    </Select>
                    {
                      this.state.isNew?
                      ''
                      :
                      <Button onClick={this.addNewGroup} type="primary" size="small" css={{marginLeft:"10px"}}>
                        <span><i className="fa fa-plus" aria-hidden="true"></i></span> <span css={{marginLeft:"5px"}}>新增分组</span>
                      </Button>
                    }

                    </div>
                  </div>
                  {
                    this.state.isNew?
                    <div css={{marginLeft:"100px",width:"420px",padding:"20px",border:"rgba(255,255,255,0.2) solid 1px",borderRadius:"5px"}}>
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
                      <div css={{marginTop:"20px",textAlign:"right"}}>
                        <Button onClick={this.addCancel} size="small" css={{marginRight:"20px"}}>取消</Button>
                        <Button onClick={this.addOk}  size="small" type="primary">确定</Button>
                      </div>
                    </div>
                    :
                    ''
                  }

                </TabPane>
                <TabPane tab="主机" key="2">
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>主机名称：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}> <Input value={this.state.hostname} onChange={(e)=>this.dataChange(e,'hostname')} css={{width:"200px"}}/></div>
                  </div>
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>系统平台：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}>
                    <Select
                       style={{ width: '100%' }}
                       placeholder="不限"
                       value={this.state.sysplatform}
                       onChange={this.sysplatformChange}
                       style={{width:"200px"}}
                     >
                      <Option value='windows'><i className="fa fa-windows" aria-hidden="true"></i> Windows </Option>
                      <Option value='linux'><i className="fa fa-linux" aria-hidden="true"></i> Linux </Option>
                     </Select>
                    </div>
                  </div>
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>主机ip：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}> <Input value={this.state.hostip} onChange={(e)=>this.dataChange(e,'hostip')} css={{width:"200px"}}/></div>
                  </div>
                  {
                    this.state.sysplatform === 'linux'?
                    <div>
                      <div css={{display:"flex",lineHeight:"40px"}}>
                        <div css={{flex:"0 0 100px", textAlign:"right"}}>用户名：</div>
                        <div css={{flex:"1 1 auto", textAlign: "left"}}> <Input value={this.state.hostuser} onChange={(e)=>this.dataChange(e,'hostuser')} css={{width:"200px"}}/></div>
                      </div>
                      <div css={{display:"flex",lineHeight:"40px"}}>
                        <div css={{flex:"0 0 100px", textAlign:"right"}}>密码：</div>
                        <div css={{flex:"1 1 auto", textAlign: "left"}}> <Password type="password" value={this.state.hostpassword} onChange={(e)=>this.dataChange(e,'hostpassword')} css={{width:"200px"}}/></div>
                      </div>
                      <div css={{display:"flex",lineHeight:"40px"}}>
                        <div css={{flex:"0 0 100px", textAlign:"right"}}>SSH端口：</div>
                        <div css={{flex:"1 1 auto", textAlign: "left"}}> <Input placeholder='默认为22' value={this.state.hostport} onChange={(e)=>this.dataChange(e,'hostport')} css={{width:"200px"}}/></div>
                      </div>
                    </div>
                    :
                    ''
                  }
                </TabPane>
                <TabPane tab="日志" key="3">
                  <Row css={{textAlign:"center",lineHeight:"40px"}}>
                    <Col span={8} css={{background:"rgba(0,0,0,0.2)"}}>文件路径</Col>
                    <Col span={4} css={{background:"rgba(0,0,0,0.1)"}}>应用标识</Col>
                    <Col span={3} css={{background:"rgba(0,0,0,0.2)"}}>是否从头读起</Col>
                    <Col span={3} css={{background:"rgba(0,0,0,0.1)"}}>是否单行日志</Col>
                    <Col span={4} css={{background:"rgba(0,0,0,0.2)"}}>解析规则</Col>
                    <Col span={2} css={{background:"rgba(0,0,0,0.1)"}}>操作</Col>
                  </Row>

                  {
                    this.state.logList && this.state.logList.length>0?
                    this.state.logList.map(item=>{
                      return (
                        <LogSet doDeleteLog={this.doDeleteLog} updateLog={this.updateLog} key={item.id} data={item} />
                      )
                    })
                    :
                    ''
                  }
                  <AddLogSetDom>
                    <div onClick={this.doAddLog}>
                      <span><i className="fa fa-plus" aria-hidden="true"></i></span>
                    </div>
                  </AddLogSetDom>
                </TabPane>
                <TabPane tab="安装方式" key="4">
                  <div css={{display:"flex",lineHeight:"40px"}}>
                    <div css={{flex:"0 0 100px", textAlign:"right"}}>安装方式：</div>
                    <div css={{flex:"1 1 auto", textAlign: "left"}}>

                         {
                           this.state.sysplatform === 'windows'?
                           <Select
                              style={{ width: '100%' }}
                              placeholder="不限"
                              value={this.state.setype}
                              onChange={this.setypeChange}
                              style={{width:"200px"}}
                            >
                            <Option value='handset'><i className="fa fa-hand-pointer-o" aria-hidden="true"></i> 手动</Option>
                           </Select>
                           :
                           <Select
                              style={{ width: '100%' }}
                              placeholder="不限"
                              value={this.state.setype}
                              onChange={this.setypeChange}
                              style={{width:"200px"}}
                            >
                             <Option value='handset'><i className="fa fa-hand-pointer-o" aria-hidden="true"></i> 手动</Option>
                             <Option value='autoset'><i className="fa fa-tasks" aria-hidden="true"></i> 自动</Option>
                           </Select>
                         }

                    </div>
                  </div>
                </TabPane>
              </Tabs>
              <div css={{paddingTop:"40px"}}>
                <Button onClick={this.onClose}>取消</Button>
                {
                  this.state.activeKey === '1'?
                  ''
                  :
                  <Button css={{marginLeft:"10px"}} onClick={this.lastStep} >上一步</Button>
                }
                {
                  this.state.activeKey === '4'?
                  ''
                  :
                  <Button css={{marginLeft:"10px"}} onClick={this.nextStep} >下一步</Button>
                }
                {
                  this.state.activeKey === '4'?
                  <Button css={{marginLeft:"10px"}} onClick={this.doSave} type="primary" css={{marginLeft:"20px"}}>保存</Button>
                  :
                  ''
                }
              </div>
            </Col>
          </Row>
        </Drawer>
      </div>
    )
  }
}


export default AutoSet
