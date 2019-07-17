/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, {Component} from 'react'
import {
  Row, Col, Input, Form,
  Icon, Button, Collapse,
  DatePicker, InputNumber, Select,
  Cascader, message
} from 'antd'
import moment from 'moment'
import _ from 'lodash'

import { FormModule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import { cityList } from '../components/constants'

const { Panel } = Collapse
const { TextArea } =  Input
const { Option, OptGroup } = Select
const { MonthPicker } = DatePicker
class FormDetail extends Component{
  state = {
    confirmDirty: false,
    adressList: [],
    id:'',
    curFields:{}
  }
  componentDidMount(){
    this._isMounted = true
    //园区地址
    this.getAdress()
    //取出原始值将时间转化
     if(this._isMounted){
       const { id,curFields } = this.props
       this.setState({
         id,
         curFields
       },()=>{
         this.props.form.resetFields()
         let formData = {}
         formData = _.cloneDeep(this.state.curFields)
         this.props.form.setFieldsValue(formData)
       })
     }
  }

  //获取地址
  getAdress = ()=>{
      const digui = (arr)=>{
        const cityList = []
        arr.map((item,index)=>{
          let curList = {}
          curList.value = item.n
          curList.label = item.n
          if(item.c){
            curList.children = digui(item.c)
          }
          cityList.push(curList)
        })
        return cityList
      }
      const adressList = digui(cityList)
      if(this._isMounted){
        this.setState({
          adressList
        })
      }
  }
  //提交
  handleSubmit = e => {
    e.preventDefault()
    if(this.state.id === ''){
      wyAxiosPost('Park/checkParkName',{name: this.props.form.getFieldValue('park_name')},(result)=>{
        const responseData = result.data.msg
        if(responseData.msg === 0){
          this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            //let fields = {}
            if (!err) {
              // const values = {
              //   ...fieldsValue,
              //   'development_time':fieldsValue['development_time']?fieldsValue['development_time'].format('YYYY-MM'):'',
              // }
              // fields = values
              wyAxiosPost('Park/savePark',{type:'add',info:fieldsValue},(result)=>{
                const responseData = result.data.msg
                if(responseData.status === 1){
                  this.props.getTotal()
                  this.props.closeDrawer()
                  message.success(responseData.msg)
                }else{
                  message.warning(responseData.msg)
                }
              })
            }else{
              const len = Object.keys(err).length
              message.warning('有'+len+'项必填项没有填写')
            }
            return
          })
        }else{
          message.warning('已存在同名产业园')
        }
      })
    }else{
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        let fields = {}
        if (!err) {
           const values = {
             ...fieldsValue,
          //   'development_time':fieldsValue['development_time']?fieldsValue['development_time'].format('YYYY-MM'):'',
          }
           fields = values
           fields.id = this.state.id
          wyAxiosPost('Park/savePark',{type:'edit',info:fields},(result)=>{
            const responseData = result.data.msg
            if(responseData.status === 1){
              this.props.getTotal()
              this.props.closeDrawer()
              message.success(responseData.msg)
            }else{
              message.warning(responseData.msg)
            }
          })
        }else{
          const len = Object.keys(err).length
          message.warning('有'+len+'项必填项没有填写')
        }

        return
      })
    }
  }

  //blur报错效果
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  calcAvg_land_value = ()=>{
    const cover_area = this.props.form.getFieldValue('cover_area')
    const park_output_value = this.props.form.getFieldValue('park_output_value')

    if(cover_area>0 && park_output_value){
      let avg_land_value = park_output_value/cover_area
      this.props.form.setFieldsValue({avg_land_value})
    }
  }
  calcRate = ()=>{
    const built_area = this.props.form.getFieldValue('built_area')
    if(built_area>0){
      let list = []
      const office_area = this.props.form.getFieldValue('office_area')
      list[0] = {}
      list[1] = {}
      list[2] = {}
      list[3] = {}
      list[4] = {}
      list[5] = {}
      list[0]["value"] = office_area
      list[0]["rate"] = "occupy_rate"
      const factory_area = this.props.form.getFieldValue('factory_area')
      list[1].value = factory_area
      list[1].rate = "factory_rate"
      const apartment_area = this.props.form.getFieldValue('apartment_area')
      list[2].value = apartment_area
      list[2].rate = "apartment_rate"
      const restaurant_area = this.props.form.getFieldValue('restaurant_area')
      list[3].value = restaurant_area
      list[3].rate = "restaurant_rate"
      const restaurant_rate = this.props.form.getFieldValue('restaurant_rate')
      list[4].value = restaurant_rate
      list[4].rate = "business_rate"
      const literary_area = this.props.form.getFieldValue('literary_area')
      list[5].value = literary_area
      list[5].rate = "literary_rate"
      list.map(item=>{
        if(item.value>0){
          const haha = 100*item.value/built_area
          const resu =haha.toFixed(2)
          this.props.form.setFieldsValue({[item.rate]:resu})
        }
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { getFieldDecorator, getFieldValue } = this.props.form
    return(
      <div css={{paddingBottom:"60px"}}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="基本信息" key="1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区名称">
                    {getFieldDecorator('park_name', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<Input placeholder="Please enter user name" />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区地址">
                    {getFieldDecorator('traffic_location', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<Cascader options={this.state.adressList} changeOnSelect  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="详细地址">
                    {getFieldDecorator('detailed_address', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="项目状况">
                    {getFieldDecorator('project_status', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="未入市" key="未入市">未入市</Option>
                      <Option value="招商中" key="招商中">招商中</Option>
                      <Option value="运营中" key="运营中">运营中</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区资质">
                    {getFieldDecorator('qualify', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区开发时间">
                    {getFieldDecorator('development_time', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<InputNumber min={1900} style={{width:"90%"}}/>)}
                  {'年'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区总投资额">
                    {getFieldDecorator('investment', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 亿元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="拿地方式">
                    {getFieldDecorator('take_place', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="面积属性" key="2">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区占地面积">
                    {getFieldDecorator('cover_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcAvg_land_value} css={{width:"80%"}} min={0} />)}
                  {' 平方公里'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区建筑面积">
                    {getFieldDecorator('built_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区容积率">
                    {getFieldDecorator('volume_ratio', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="户型面积">
                    {getFieldDecorator('family_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="标准层面积">
                    {getFieldDecorator('standard_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="层高">
                    {getFieldDecorator('storey_height', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="研发办公面积">
                    {getFieldDecorator('office_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="占总建筑面积比例（研发办公面积/总建筑面积）">
                    {getFieldDecorator('occupy_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                    disabled={true}
                    placeholder={'自动计算，无需填写'}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="厂房面积">
                    {getFieldDecorator('factory_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="占总建筑面积比例（厂房面积/总建筑面积）">
                    {getFieldDecorator('factory_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                    disabled={true}
                    placeholder={'自动计算，无需填写'}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="公寓面积">
                    {getFieldDecorator('apartment_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="占总建筑面积比例（公寓面积/总建筑面积）">
                    {getFieldDecorator('apartment_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                    disabled={true}
                    placeholder={'自动计算，无需填写'}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="餐饮配套面积">
                    {getFieldDecorator('restaurant_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="占总建筑面积比例（餐饮配套面积/总建筑面积）">
                    {getFieldDecorator('restaurant_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                    disabled={true}
                    placeholder={'自动计算，无需填写'}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="商业配套面积">
                    {getFieldDecorator('business_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="占总建筑面积比例（商业配套面积/总建筑面积）">
                    {getFieldDecorator('business_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                    disabled={true}
                    placeholder={'自动计算，无需填写'}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="文体设施配套面积">
                    {getFieldDecorator('literary_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcRate} css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="占总建筑面积比例（文体设施配套面积/总建筑面积）">
                    {getFieldDecorator('literary_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                    disabled={true}
                    placeholder={'自动计算，无需填写'}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="绿化覆盖率">
                    {getFieldDecorator('green_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      css={{width:"100%"}}
                    />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="出租面积">
                    {getFieldDecorator('rental_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="出售面积">
                    {getFieldDecorator('sale_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="商业属性" key="3">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区用地属性">
                    {getFieldDecorator('land_usage', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="产业用地" key="产业用地">产业用地</Option>
                      <Option value="工业用地" key="工业用地">工业用地</Option>
                      <Option value="物流仓储用地" key="物流仓储用地">物流仓储用地</Option>
                      <Option value="教育科研用地" key="教育科研用地">教育科研用地</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区主导产业">
                    {getFieldDecorator('prime_industry', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="新一代信息技术" key="新一代信息技术">新一代信息技术</Option>
                      <Option value="高端装备制造产业" key="高端装备制造产业">高端装备制造产业</Option>
                      <Option value="新材料产业" key="新材料产业">新材料产业</Option>
                      <Option value="生物产业" key="生物产业">生物产业</Option>
                      <Option value="新能源汽车产业" key="新能源汽车产业">新能源汽车产业</Option>
                      <Option value="新能源产业" key="新能源产业">新能源产业</Option>
                      <Option value="节能环保产业" key="节能环保产业">节能环保产业</Option>
                      <Option value="数字创意产业" key="数字创意产业">数字创意产业</Option>
                      <Option value="军民融合" key="军民融合">军民融合</Option>
                      <Option value="相关服务业" key="相关服务业">相关服务业</Option>
                      <Option value="科技创新" key="科技创新">科技创新</Option>
                      <Option value="各类联盟及组织" key="各类联盟及组织">各类联盟及组织</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区主要功能">
                    {getFieldDecorator('park_function', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="物流仓储" key="物流仓储">物流仓储</Option>
                      <Option value="办公" key="办公">办公</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区产值">
                    {getFieldDecorator('park_output_value', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber onBlur={this.calcAvg_land_value} css={{width:"80%"}} min={0} />)}
                  {' 亿元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="地均产值">
                    {getFieldDecorator('avg_land_value', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input disabled={true} placeholder={'自动计算，无需填写'} css={{width:"60%"}} min={0} />)}
                  {' 亿元/平方公里'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区就业人数">
                    {getFieldDecorator('employ_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="少于50人" key="少于50人">少于50人</Option>
                      <Option value="50-150人" key="50-150人">50-150人</Option>
                      <Option value="150-500人" key="150-500人">150-500人</Option>
                      <Option value="500-1000人" key="500-1000人">500-1000人</Option>
                      <Option value="1000-5000人" key="1000-5000人">1000-5000人</Option>
                      <Option value="5000-10000人" key="5000-10000人">5000-10000人</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区区位特征">
                    {getFieldDecorator('park_series', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="远郊型" key="远郊型">远郊型</Option>
                      <Option value="城郊结合型" key="城郊结合型">城郊结合型</Option>
                      <Option value="城市型" key="城市型">城市型</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区配套类型">
                    {getFieldDecorator('park_match', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="基本型配套" key="基本型配套">基本型配套</Option>
                      <Option value="改善型配套" key="改善型配套">改善型配套</Option>
                      <Option value="完善型配套" key="完善型配套">完善型配套</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区配套情况">
                    {getFieldDecorator('park_situation', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <OptGroup label="技术配套">
                        <Option value="公共研发中心">公共研发中心</Option>
                        <Option value="孵化中心">孵化中心</Option>
                        <Option value="检测认证中心">检测认证中心</Option>
                      </OptGroup>
                      <OptGroup label="商务配套">
                        <Option value="展示交易中心">展示交易中心</Option>
                        <Option value="教育培训中心">教育培训中心</Option>
                        <Option value="商务会议中心">商务会议中心</Option>
                      </OptGroup>
                      <OptGroup label="生活配套">
                        <Option value="居住">居住</Option>
                        <Option value="公共服务中心等">公共服务中心等</Option>
                      </OptGroup>
                      <Option value="物流仓储">物流仓储</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区建筑数量">
                    {getFieldDecorator('built_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区建筑层数">
                    {getFieldDecorator('layer_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="租金价格">
                    {getFieldDecorator('rent_price', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"70%"}} min={0} />)}
                  {' 元/m²/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="各期租金价格备注">
                    {getFieldDecorator('price_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="出售价格">
                    {getFieldDecorator('sale_price', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="各期出售价格备注">
                    {getFieldDecorator('sale_price_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="租售比">
                    {getFieldDecorator('rent_sale_ratio', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="物业费">
                    {getFieldDecorator('property', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/m²/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="水电费">
                    {getFieldDecorator('water_ele', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/m²/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区运营模式">
                    {getFieldDecorator('operate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="政府运营模式" key="政府运营模式">政府运营模式</Option>
                      <Option value="投资运营模式" key="投资运营模式">投资运营模式</Option>
                      <Option value="服务运营模式" key="服务运营模式">服务运营模式</Option>
                      <Option value="土地盈利模式" key="土地盈利模式">土地盈利模式</Option>
                      <Option value="产业运营模式" key="产业运营模式">产业运营模式</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区运营服务">
                    {getFieldDecorator('service', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="商务服务" key="商务服务">商务服务</Option>
                      <Option value="信息技术服务" key="信息技术服务">信息技术服务</Option>
                      <Option value="审批申报服务" key="审批申报服务">审批申报服务</Option>
                      <Option value="投融资服务" key="投融资服务">投融资服务</Option>
                      <Option value="基础服务" key="基础服务">基础服务</Option>
                      <Option value="联合党建服务" key="联合党建服务">联合党建服务</Option>
                      <Option value="公共检测服务" key="公共检测服务">公共检测服务</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区盈利模式">
                    {getFieldDecorator('profit', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="产业物业销售" key="产业物业销售">产业物业销售</Option>
                      <Option value="产业物业租赁" key="产业物业租赁">产业物业租赁</Option>
                      <Option value="土地一级开发" key="土地一级开发">土地一级开发</Option>
                      <Option value="住宅及配套物业销售" key="住宅及配套物业销售">住宅及配套物业销售</Option>
                      <Option value="产业发展服务" key="产业发展服务">产业发展服务</Option>
                      <Option value="轻资产输出服务" key="轻资产输出服务">轻资产输出服务</Option>
                      <Option value="产业投资" key="产业投资">产业投资</Option>
                      <Option value="政策性收益" key="政策性收益">政策性收益</Option>
                      <Option value="资产价值重估" key="资产价值重估">资产价值重估</Option>
                      <Option value="物业增值服务" key="物业增值服务">物业增值服务</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="2018年园区总收入（自身）">
                    {getFieldDecorator('park_income', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 亿元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="2018年园区盈利情况">
                    {getFieldDecorator('profit_status', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区运营主体(开业后)">
                    {getFieldDecorator('operation_subject', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="政府平台公司" key="政府平台公司">政府平台公司</Option>
                      <Option value="专业产业运营公司" key="专业产业运营公司">专业产业运营公司</Option>
                      <Option value="物业管理公司" key="物业管理公司">物业管理公司</Option>
                      <Option value="开发建设公司的运营部门" key="开发建设公司的运营部门">开发建设公司的运营部门</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区运营服务内容">
                    {getFieldDecorator('service_content', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="物业管理" key="物业管理">物业管理</Option>
                      <Option title="政府对接及代办服务（工商、环评、能评、消防、政策咨询等）" value="政府对接及代办服务（工商、环评、能评、消防、政策咨询等）" key="政府对接及代办服务（工商、环评、能评、消防、政策咨询等）">政府对接及代办服务（工商、环评、能评、消防、政策咨询等）</Option>
                      <Option title="降低企业综合成本服务（人才招聘、培训、会议、信息平台、线上采购、财务、采购、销售等）" value="降低企业综合成本服务（人才招聘、培训、会议、信息平台、线上采购、财务、采购、销售等）" key="降低企业综合成本服务（人才招聘、培训、会议、信息平台、线上采购、财务、采购、销售等）">降低企业综合成本服务（人才招聘、培训、会议、信息平台、线上采购、财务、采购、销售等）</Option>
                      <Option value="金融服务" key="金融服务">金融服务</Option>
                      <Option value="对外行业信息服务" key="对外行业信息服务">对外行业信息服务</Option>
                      <Option value="科技创新服务" key="科技创新服务">科技创新服务</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区物业增值服务（其他收入）">
                    {getFieldDecorator('increment', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="室外车位费" key="室外车位费">室外车位费</Option>
                      <Option value="室内车位阶梯收费" key="室内车位阶梯收费">室内车位阶梯收费</Option>
                      <Option value="广告资源" key="广告资源">广告资源</Option>
                      <Option value="园区商展地租赁" key="园区商展地租赁">园区商展地租赁</Option>
                      <Option value="车辆相关便利服务" key="车辆相关便利服务">车辆相关便利服务</Option>
                      <Option value="拓展增值业务" key="拓展增值业务">拓展增值业务</Option>
                      <Option value="机房空调维保业务" key="机房空调维保业务">机房空调维保业务</Option>
                      <Option value="二装服务" key="二装服务">二装服务</Option>
                      <Option value="退租房间原装回复服务" key="退租房间原装回复服务">退租房间原装回复服务</Option>
                      <Option value="搬家服务" key="搬家服务">搬家服务</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区产业投资资金来源">
                    {getFieldDecorator('investment_source', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="政府产业基金" key="政府产业基金">政府产业基金</Option>
                      <Option value="集团产业基因" key="集团产业基因">集团产业基因</Option>
                      <Option value="自己的产业基金" key="自己的产业基金">自己的产业基金</Option>
                      <Option value="投行产业基金" key="投行产业基金">投行产业基金</Option>
                      <Option value="其他合作形式的产业基金" key="其他合作形式的产业基金">其他合作形式的产业基金</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区产业投资基金规模">
                    {getFieldDecorator('fund_size', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 亿元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区产业投资基金模式">
                    {getFieldDecorator('fund_model', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option title="直接投资（物业入股、现金入股、担保贷款入股）等" value="直接投资（物业入股、现金入股、担保贷款入股）等" key="直接投资（物业入股、现金入股、担保贷款入股）等">直接投资（物业入股、现金入股、担保贷款入股）等</Option>
                      <Option value="参股基金投资" key="参股基金投资">参股基金投资</Option>
                      <Option value="管理基金投资" key="管理基金投资">管理基金投资</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区主要招商资源/渠道">
                    {getFieldDecorator('channel', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="企业自动上门" key="企业自动上门">企业自动上门</Option>
                      <Option value="政府招商局" key="政府招商局">政府招商局</Option>
                      <Option value="政府人才计划" key="政府人才计划">政府人才计划</Option>
                      <Option value="产业协会及同盟" key="产业协会及同盟">产业协会及同盟</Option>
                      <Option value="以商招商" key="以商招商">以商招商</Option>
                      <Option value="项目联动" key="项目联动">项目联动</Option>
                      <Option value="人脉介绍" key="人脉介绍">人脉介绍</Option>
                      <Option value="活动现场招商" key="活动现场招商">活动现场招商</Option>
                      <Option value="异业互动" key="异业互动">异业互动</Option>
                      <Option value="广告宣传" key="广告宣传">广告宣传</Option>
                      <Option value="互联网推广" key="互联网推广">互联网推广</Option>
                      <Option value="招商热线" key="招商热线">招商热线</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区主要招商资源">
                    {getFieldDecorator('resource', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="政府招商局" key="政府招商局">政府招商局</Option>
                      <Option value="政府人才计划" key="政府人才计划">政府人才计划</Option>
                      <Option value="以商招商" key="以商招商">以商招商</Option>
                      <Option value="项目联动" key="项目联动">项目联动</Option>
                      <Option value="人脉介绍" key="人脉介绍">人脉介绍</Option>
                      <Option value="现场招商" key="现场招商">现场招商</Option>
                      <Option value="异业互动" key="异业互动">异业互动</Option>
                      <Option value="广告宣传" key="广告宣传">广告宣传</Option>
                      <Option value="互联网推广" key="互联网推广">互联网推广</Option>
                      <Option value="招商热线" key="招商热线">招商热线</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区招商方式">
                    {getFieldDecorator('mode', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="产业链商局" key="产业链商局">产业链商局</Option>
                      <Option value="主导产业招商" key="主导产业招商">主导产业招商</Option>
                      <Option value="产业政策招商" key="产业政策招商">产业政策招商</Option>
                      <Option value="重点区域招商" key="重点区域招商">重点区域招商</Option>
                      <Option value="重点部门招商" key="重点部门招商">重点部门招商</Option>
                      <Option value="重点人物招商" key="重点人物招商">重点人物招商</Option>
                      <Option value="资本招商" key="资本招商">资本招商</Option>
                      <Option value="大数据招商" key="大数据招商">大数据招商</Option>
                      <Option value="创业大赛招商" key="创业大赛招商">创业大赛招商</Option>
                      <Option value="飞地招商" key="飞地招商">飞地招商</Option>
                      <Option value="前店后厂招商" key="前店后厂招商">前店后厂招商</Option>
                      <Option value="互联网社群招商" key="互联网社群招商">互联网社群招商</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区企业服务核心平台">
                    {getFieldDecorator('core', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="投融资平台" key="投融资平台">投融资平台</Option>
                      <Option value="孵化平台" key="孵化平台">孵化平台</Option>
                      <Option value="营销平台" key="营销平台">营销平台</Option>
                      <Option value="商务圈层平台" key="商务圈层平台">商务圈层平台</Option>
                      <Option value="客户全国选址" key="客户全国选址">客户全国选址</Option>
                      <Option value="公共服务平台" key="公共服务平台">公共服务平台</Option>
                      <Option value="人力资源平台" key="人力资源平台">人力资源平台</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="产业服务平台名称">
                    {getFieldDecorator('dddd', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="产业服务平台类型">
                    {getFieldDecorator('platform_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      style={{ width: '100%' }}
                    >
                    <Option value="市场交易平台" key="市场交易平台">市场交易平台</Option>
                    <Option value="行业自组织平台" key="行业自组织平台">行业自组织平台</Option>
                    <Option value="共性技术服务平台" key="共性技术服务平台">共性技术服务平台</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="产业服务平台商业模式">
                    {getFieldDecorator('business_model', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      style={{ width: '100%' }}
                    >
                    <Option value="政府主导型" key="政府主导型">政府主导型</Option>
                    <Option value="政府扶持" key="政府扶持">政府扶持</Option>
                    <Option value="企业开发管理" key="企业开发管理">企业开发管理</Option>
                    <Option value="民间资本独立投资运营" key="民间资本独立投资运营">民间资本独立投资运营</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业服务平台特色（优势）服务">
                    {getFieldDecorator('advantage', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业服务平台发展现状">
                    {getFieldDecorator('platform_status', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区发展基础设施需求">
                    {getFieldDecorator('basis', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="无" key="无">无</Option>
                      <Option value="选址装修信息服务" key="选址装修信息服务">选址装修信息服务</Option>
                      <Option value="智能垃圾处理系统" key="智能垃圾处理系统">智能垃圾处理系统</Option>
                      <Option value="智能安防" key="智能安防">智能安防</Option>
                      <Option value="环境监测与管理平台" key="环境监测与管理平台">环境监测与管理平台</Option>
                      <Option value="资产检测与分析" key="资产检测与分析">资产检测与分析</Option>
                      <Option value="线上物业咨询" key="线上物业咨询">线上物业咨询</Option>
                      <Option value="线上退租平台" key="线上退租平台">线上退租平台</Option>
                      <Option value="能源信息服务平台" key="能源信息服务平台">能源信息服务平台</Option>
                      <Option value="信息化服务" key="信息化服务">信息化服务</Option>
                      <Option value="信息查询" key="信息查询">信息查询</Option>
                      <Option value="信息化需求在线对接" key="信息化需求在线对接">信息化需求在线对接</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="基础设施情况说明">
                    {getFieldDecorator('basis_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="园区发展资金需求">
                    {getFieldDecorator('development_funds', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="资金要求情况说明">
                    {getFieldDecorator('funds_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区发展人才要求">
                    {getFieldDecorator('developing_talents', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="产学研人才对接服务" key="产学研人才对接服务">产学研人才对接服务</Option>
                      <Option value="专业猎头服务" key="专业猎头服务">专业猎头服务</Option>
                      <Option value="多渠道人才推荐" key="多渠道人才推荐">多渠道人才推荐</Option>
                      <Option value="团队建设" key="团队建设">团队建设</Option>
                      <Option value="人才培训服务" key="人才培训服务">人才培训服务</Option>
                      <Option value="人才引进" key="人才引进">人才引进</Option>
                      <Option value="人才专项政策" key="人才专项政策">人才专项政策</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="人才需求情况说明">
                    {getFieldDecorator('talents_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="园区招商资源诉求">
                    {getFieldDecorator('business_appeal ', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="园区发展专业平台需求">
                    {getFieldDecorator('platform_appeal ', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="园区发展政策需求">
                    {getFieldDecorator('policy_appeal ', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>




                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区发展配套需求">
                    {getFieldDecorator('developing_match', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <OptGroup label="技术配套">
                        <Option value="公共研发中心">公共研发中心</Option>
                        <Option value="孵化中心">孵化中心</Option>
                        <Option value="检测认证中心">检测认证中心</Option>
                      </OptGroup>
                      <OptGroup label="商务配套">
                        <Option value="展示交易中心">展示交易中心</Option>
                        <Option value="教育培训中心">教育培训中心</Option>
                        <Option value="商务会议中心">商务会议中心</Option>
                      </OptGroup>
                      <OptGroup label="生活配套">
                        <Option value="居住">居住</Option>
                        <Option value="公共服务中心等">公共服务中心等</Option>
                      </OptGroup>
                      <Option value="物流仓储">物流仓储</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="配套需求情况说明">
                    {getFieldDecorator('match_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/组织架构">
                    {getFieldDecorator('manage_architecture', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="管理机制/人事制度">
                    {getFieldDecorator('personnel_system', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="聘任制" key="聘任制">聘任制</Option>
                      <Option value="考任制" key="考任制">考任制</Option>
                      <Option value="选任制" key="选任制">选任制</Option>
                      <Option value="委任制" key="委任制">委任制</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/考核方式">
                    {getFieldDecorator('method_assessment', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/其他">
                    {getFieldDecorator('manage_other', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="政策落实情况">
                    {getFieldDecorator('platform_business_model', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="园区各行业企业数量" key="3.1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区企业数量">
                    {getFieldDecorator('enterprises_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区上市公司">
                    {getFieldDecorator('quoted_company', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="规以上企业数量">
                    {getFieldDecorator('ruleup_company', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区高新技术企业">
                    {getFieldDecorator('newtech_company', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="园区企业入驻率">
                    {getFieldDecorator('enterprise_rate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="新一代信息技术企业数量">
                    {getFieldDecorator('info_technology_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="高端装备制造业企业数量">
                    {getFieldDecorator('equipment_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="新材料企业数量">
                    {getFieldDecorator('material_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="数字创意企业数量">
                    {getFieldDecorator('originality_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="生物产业企业数量">
                    {getFieldDecorator('biology_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="新能源汽车企业数量">
                    {getFieldDecorator('automobile_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="新能源企业数量">
                    {getFieldDecorator('energy_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="节能环保企业数量">
                    {getFieldDecorator('protection_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="军民融合企业数量">
                    {getFieldDecorator('fuse_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="科技创新机构数量">
                    {getFieldDecorator('mechanism_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="500强企业数量">
                    {getFieldDecorator('top_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="园区企业抗风险力情况" key="3.2">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="初创期企业">
                    {getFieldDecorator('newly_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="孵化器企业">
                    {getFieldDecorator('hatch_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="成长期企业">
                    {getFieldDecorator('growth_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="成熟期企业">
                    {getFieldDecorator('mature_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="园区企业税收情况">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'亿元以上税收 '}
                          {getFieldDecorator('over_hmillion', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {' 千万以上税收 '}
                          {getFieldDecorator('over_tmillion', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {' 百万以上税收 '}
                          {getFieldDecorator('over_amillion', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {' 十万以上税收 '}
                          {getFieldDecorator('over_hthousand', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {' 万以上税收 '}
                          {getFieldDecorator('over_tenthousand', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {' 总体纳税企业 '}
                          {getFieldDecorator('all_tax', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家'}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {' 新增纳税情况 '}
                          {getFieldDecorator('new_tax', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 家'}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="园区科研情况">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'院士工作站 '}
                          {getFieldDecorator('academician_station', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 个 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'博士工作站 '}
                          {getFieldDecorator('doctor_station', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 个 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'国家级实验室 '}
                          {getFieldDecorator('country_station', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {' 个 '}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'省级重点实验室 '}
                          {getFieldDecorator('province_station', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"60px"}} min={0} />)}
                        {' 个 '}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="园区企业区域来源情况" key="3.3">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="本市">
                    {getFieldDecorator('city_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="本省中心城市及周边">
                    {getFieldDecorator('province_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="本省其他地区">
                    {getFieldDecorator('other_areas_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="外省">
                    {getFieldDecorator('other_provinces_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="港澳台">
                    {getFieldDecorator('hmt_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国外">
                    {getFieldDecorator('abroad_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>

              </Row>
            </Panel>
            <Panel header="园区企业家年龄情况" key="3.4">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="50后">
                    {getFieldDecorator('age50_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="60后">
                    {getFieldDecorator('age60_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="70后">
                    {getFieldDecorator('age70_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="80后">
                    {getFieldDecorator('age80_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="90后">
                    {getFieldDecorator('age90_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    css={{width:"100%"}}
                  />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="园区就业人员构成" key="3.5">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="院士">
                    {getFieldDecorator('academician_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士后">
                    {getFieldDecorator('post_doctoral_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士">
                    {getFieldDecorator('doctoral_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="硕士">
                    {getFieldDecorator('master_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="本科">
                    {getFieldDecorator('college_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="专科">
                    {getFieldDecorator('specialty_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="停车位个数" key="3.6">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="停车位个数">
                    {getFieldDecorator('parke_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="地上停车位">
                    {getFieldDecorator('parking_upper_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="地下停车位">
                    {getFieldDecorator('parking_lower_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="园区产业协会情况" key="3.7">
              <Row gutter={16}>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="园区产业协会1">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'协会名称 '}
                        {getFieldDecorator('name1_association', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'协会行业分类 '}
                        {getFieldDecorator('association1_classification', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'会员数量 '}
                        {getFieldDecorator('number1_members', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"100px"}} min={0} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'发展情况 '}
                        {getFieldDecorator('park1_development', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="园区产业协会2">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'协会名称 '}
                        {getFieldDecorator('name2_association', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'协会行业分类 '}
                        {getFieldDecorator('association2_classification', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'会员数量 '}
                        {getFieldDecorator('number2_members', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"100px"}} min={0} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"10px"}}>
                        {'发展情况 '}
                        {getFieldDecorator('park2_development', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="其他产业协会名称">
                    {getFieldDecorator('other_association', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="是否有军工方面合作">
                    {getFieldDecorator('is_military_cooperation', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="是" key="是">是</Option>
                      <Option value="否" key="否">否</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="军工合作对象全称">
                    {getFieldDecorator('military_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="军工方面的合作备注（合作内容）">
                    {getFieldDecorator('military_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="是否有合作院校">
                    {getFieldDecorator('is_school_cooperation', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="是" key="是">是</Option>
                      <Option value="否" key="否">否</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作院校全称（*学校*学院）">
                    {getFieldDecorator('school_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="合作院校备注（合作内容）">
                    {getFieldDecorator('school_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="是否有科研机构合作">
                    {getFieldDecorator('is_scientific_cooperation', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="是" key="是">是</Option>
                      <Option value="否" key="否">否</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作科研机构全称">
                    {getFieldDecorator('scientific_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="合作科研机构备注（合作内容）">
                    {getFieldDecorator('scientific_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="其他合作备注">
                    {getFieldDecorator('other_coporation_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="联系及地理" key="4" style={{borderBottom:"none"}}>
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="联系人">
                    {getFieldDecorator('contacts', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="联系方式">
                    {getFieldDecorator('contact_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input placeholder="手机号或座机号" css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="经度">
                    {getFieldDecorator('longitude', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<InputNumber css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="纬度">
                    {getFieldDecorator('latitude', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<InputNumber css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="产业园备注" key="5" style={{borderBottom:"none"}}>
              <Row gutter={16}>
                <Col>
                    {getFieldDecorator('description', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:4}} />)}
                </Col>
              </Row>
            </Panel>
          </Collapse>
          <div style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}>
              <Form.Item wrapperCol={{ span: 24}} css={{marginBottom:"0px",paddingBottom:"0px",textAlign:"right"}}>
                <Button css={{marginRight:"20px"}} onClick={()=>{this.props.closeDrawer()}}>取消</Button>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
          </div>
        </Form>
      </div>
    )
  }
}
const FormList = Form.create()(FormDetail)
export default FormList
