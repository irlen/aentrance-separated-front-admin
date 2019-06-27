import React,{Component} from 'react'
import { Button,Modal,Checkbox,Select} from 'antd'
import axios from 'axios'
// import moment from 'moment'
// const now1 = moment()
// const now2 = moment()
// const Now = now1.add(0,'h')
// const oneHourBefore = now2.subtract(1,'h')
// const RangePicker = DatePicker.RangePicker
const Option = Select.Option


export default class Filter extends Component{
  state = {
    loading: false,
    visible: false,
    netObject:[],//对象
    netPort:[],//端口
    netInterface:'',//网口
    netProtocol:'',//协议
    selectGroup:[],
    sourceNetObject:[],//对象
    sourceNetPort:[],//端口
    sourceNetInterface:[],//网口
    sourceNetProtocol:[],//协议
  }

  componentDidMount(){
    const _this = this
    function getData(){
      axios.get('/Simplify/public/?s=Filter.index')
      .then((result)=>{
        _this.setState({
          sourceNetObject: [ ...result.data.data.obj ],//对象
          sourceNetPort: [ ...result.data.data.port ],//端口
          sourceNetInterface: [ ...result.data.data.ifname ],//网口
          sourceNetProtocol: [ ...result.data.data.protocol ]//协议
        })
      })
      .catch((err)=>{
        console.log(err)
      })
    }
    getData()

  }
  showModal = () => {
    this.setState({
      visible: true,
      netObject:[],//对象
      netPort:[],//端口
      netInterface:'',//网口
      netProtocol:'',//协议
      selectGroup:[]
    });
  }

  handleOk = () => {
    if(this.state.selectGroup.length === 0){
      alert('你啥都没选')
    }else{
      let filterData = {}
      this.state.selectGroup.map((ele)=>{
        filterData[ele] = this.state[ele]
        return filterData
      })
      this.props.getFilterData(filterData)
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ loading: false, visible: false });
      }, 500);
    }
  }

  handleCancel = () => {
   this.setState({
     visible: false
   });
  }
  //多选状态控制
  checkChange = (e,value) => {
    if(e.target.checked){
      this.setState({
        selectGroup:[...this.state.selectGroup,value]
      })
    }else{
      this.setState({
        selectGroup: this.state.selectGroup.filter((element)=>{
          return element !== value
        })
      })
    }
  }
  //源对象状态控制
  netObjectChange = (value) => {
    this.setState({
      netObject:[...value]
    })
  }

  //端口状态控制
  netPortChange =(value) => {
    this.setState({
      netPort: [...value]
    })
  }

  //网口状态控制
  netInterfaceChange = (value) => {
    this.setState({
      netInterface:value
    })
  }

  //协议对象状态控制
  netProtocolChange = (value) => {
    this.setState({
      netProtocol: value
    })
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={this.showModal}>
          {this.props.filterActionName}
        </Button>
        <Modal
          width={900}
          visible={this.state.visible}
          title={this.props.filterListName}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={this.handleCancel}>返回</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              提交
            </Button>,
          ]}
        >
          <ul>

             {
            //<li style={{"lineHeight": "40px"}}>
            //   <Checkbox style={{"width":"94px"}} onChange={(e) => this.checkChange(e,'rangeTime')}>
            //     时    间：
            //   </Checkbox>
            //   <RangePicker
            //     defaultValue={[moment(oneHourBefore,'YYYY-MM-DD HH:mm'),moment(Now,'YYYY-MM-DD HH:mm')]}
            //     ranges={{
            //       '最近一小時':[moment().subtract(1,'h'),moment()],
            //       '最近三小時': [moment().subtract(3,'h'), moment()],
            //       '最近六小時': [moment().subtract(6,'h'), moment()],
            //       '最近一周': [moment().subtract(1,'w'), moment()]
            //     }}
            //     showTime
            //     format="YYYY-MM-DD HH:mm"
            //     onChange={this.timeChange}
            //   />

            //</li>
          }
            <li style={{"lineHeight": "40px"}}>
              <Checkbox style={{"width":"102px"}} onChange={(e)=>{this.checkChange(e,'netObject')}} >
                对象：
              </Checkbox>
              <Select
                mode="tags"
                style={{ width: '80%' }}
                tokenSeparators={[',']}
                onChange={this.netObjectChange}
              >
                { this.state.sourceNetObject.map( (item) => <Option key={item.id} value={item.id}> {item.name} </Option> )}
              </Select>
            </li>
            <li style={{"lineHeight": "40px"}}>
              <Checkbox style={{"width":"102px"}} onChange={(e)=>{this.checkChange(e,'netPort')}} >
                端口：
              </Checkbox>
              <Select
                mode="tags"
                style={{ width: '80%' }}
                tokenSeparators={[',']}
                onChange={this.netPortChange}
              >
                { this.state.sourceNetPort.map( (item) => <Option key={item} value={item}> {item} </Option> )}
              </Select>
            </li>

            <li style={{"lineHeight": "40px"}}>
              <Checkbox style={{"width":"102px"}} onChange={(e) => this.checkChange(e,'netInterface')} >
                网口：
              </Checkbox>
              <Select defaultValue="" style={{ width: 120 }} onChange={this.netInterfaceChange}>
                { this.state.sourceNetInterface.map( (item) => <Option key={item} value={item}> {item} </Option> )}
              </Select>
            </li>


            <li style={{"lineHeight": "40px"}}>
              <Checkbox style={{"width":"102px"}} onChange={(e) => this.checkChange(e,'netProtocol')} >
                协议：
              </Checkbox>
              <Select defaultValue="" style={{ width: 120 }} onChange={this.netProtocolChange}>
                { this.state.sourceNetProtocol.map( (item) => <Option key={item} value={item}> {item} </Option> )}
              </Select>
            </li>
          </ul>
        </Modal>
      </div>
    )
  }
}
