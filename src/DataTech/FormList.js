/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, {Component} from 'react'
import { message, Cascader, Row, Col, Input, Form, Icon, Button, Collapse, DatePicker, InputNumber, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import { FormModule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import { cityList } from '../components/constants'
import AgencyList from './AgencyList' //分支机构
import InnerAgency from './InnerAgency' //国内分支机构
import OuterAgency from './OuterAgency' //国内分支机构
import CooperPartner from  './CooperPartner' //国内合作对象
import CooperPartnerOuter from  './CooperPartnerOuter' //国外合作对象
import CooperShenha from  './CooperShenha' //深哈合作
import AchievementField from  './AchievementField' // 产业成果
import FloorField from './FloorField'  //非独立占地的物业层
import EdificeField from './EdificeField'  //非独立占地的建筑

const { Panel } = Collapse
const { TextArea } =  Input
const { Option, OptGroup } = Select
const { MonthPicker } = DatePicker

class FormDetail extends Component{
  state = {
    formData: {
      number:'123'
    },
    confirmDirty: false,
    adressList: [],
    parkNameList:[],
    initParkNameList:[],
    buildList:[],
    initBuildList:[],
    isSubmiting: false,
    agencys_shenha:[], //深圳哈尔滨分支机构
    inner_agency:[],//国内分支机构
    outer_agency:[],//国外分支机构
    cooper_list:[], //合作对象
    cooper_outer_list:[], //国外合作对象
    cooper_shenha:[], //深圳哈尔冰合作情况
    achievement_field:[], //产业成果
    floor_field:[], //非独立占地物业层
    edifice_field:[], //非独立占地物业建筑
  }
  componentDidMount(){
    this._isMounted = true
    this.getAdress()
    //取出原始值将时间转化
     if(this._isMounted){
       const { id,curFields } = this.props
       const { agencys_shenha, inner_agency, outer_agency, cooper_list, cooper_outer_list, cooper_shenha, achievement_field, floor_field, edifice_field } = curFields
       this.setState({
         id,
         curFields,
         agencys_shenha,
         inner_agency,
         outer_agency,
         cooper_list,
         cooper_outer_list,
         cooper_shenha,
         achievement_field,
         floor_field,
         edifice_field
       },()=>{
         this.props.form.resetFields()
         let formData = {}
         if(this.state.curFields.build_time){
           formData = Object.assign({},this.state.curFields,{build_time: moment(this.state.curFields.build_time,'YYYY-MM')})
         }else{
           formData = _.cloneDeep(this.state.curFields)
         }
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
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      let fields = {}
      if (!err) {
        const values = {
          ...fieldsValue,
          'build_time':fieldsValue['build_time']?fieldsValue['build_time'].format('YYYY-MM'):'',
          'agencys_shenha':  _.cloneDeep(this.state.agencys_shenha),
          'inner_agency':  _.cloneDeep(this.state.inner_agency),
          'outer_agency':  _.cloneDeep(this.state.outer_agency),
          'cooper_list':  _.cloneDeep(this.state.cooper_list),
          'cooper_outer_list':  _.cloneDeep(this.state.cooper_outer_list),
          'cooper_shenha':  _.cloneDeep(this.state.cooper_shenha),
          'achievement_field':  _.cloneDeep(this.state.achievement_field),
          'floor_field': _.cloneDeep(this.state.floor_field),
          'edifice_field': _.cloneDeep(this.state.edifice_field),
        }
        fields = values
        if(this._isMounted){
          this.setState({
            isSubmiting: true
          })
        }
        wyAxiosPost('Technology/saveTechnology',{id:this.state.id,info:fields},(result)=>{
          const responseData = result.data.msg
          if(responseData.status === 1){
            this.props.getTotal()
            this.props.closeDrawer()
            message.success(responseData.msg)
            if(this._isMounted){
              this.setState({
                isSubmiting: false
              })
            }
          }else{
            if(this._isMounted){
              this.setState({
                isSubmiting: false
              })
            }
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

  //blur报错效果
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  setAgencys_shenha = (value)=>{
    if(this._isMounted){
      this.setState({
        agencys_shenha: value
      })
    }
  }
  setInner_agency = (value)=>{
    if(this._isMounted){
      this.setState({
        inner_agency: value
      })
    }
  }
  setOuter_agency = (value)=>{
    if(this._isMounted){
      this.setState({
        outer_agency: value
      })
    }
  }
  setCooper_list = (value)=>{
    if(this._isMounted){
      this.setState({
        cooper_list: value
      })
    }
  }
  setCooper_outer_list = (value)=>{
    if(this._isMounted){
      this.setState({
        cooper_outer_list: value
      })
    }
  }
  setCooper_shenha = (value)=>{
    if(this._isMounted){
      this.setState({
        cooper_shenha: value
      })
    }
  }
  setAchievement_field = (value)=>{
    if(this._isMounted){
      this.setState({
        achievement_field: value
      })
    }
  }
  setFloor_field = (value)=>{
    if(this._isMounted){
      this.setState({
        floor_field: value
      })
    }
  }
  setEdifice_field = (value)=>{
    if(this._isMounted){
      this.setState({
        edifice_field: value
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
                  <Form.Item label="名称">
                    {getFieldDecorator('technology_name', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<Input placeholder="Please enter user name" />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="属性">
                    {getFieldDecorator('attr', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="高等院校" key="高等院校">高等院校</Option>
                      <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                      <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                      <Option value="省级实验室" key="省级实验室">省级实验室</Option>
                      <Option value="科研院所" key="科研院所">科研院所</Option>
                      <Option value="工程中心" key="工程中心">工程中心</Option>
                      <Option value="企业研发中心" key="企业研发中心">企业研发中心</Option>
                      <Option value="众创空间" key="众创空间">众创空间</Option>
                      <Option value="孵化器" key="孵化器">孵化器</Option>
                      <Option value="小试基地" key="小试基地">小试基地</Option>
                      <Option value="联合研发中心" key="联合研发中心">联合研发中心</Option>
                      <Option value="中试基地" key="中试基地">中试基地</Option>
                      <Option value="加速器" key="加速器">加速器</Option>
                      <Option value="科技服务中心" key="科技服务中心">科技服务中心</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="级别">
                    {getFieldDecorator('tech_order', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="国家" key="国家">国家</Option>
                      <Option value="省部" key="省部">省部</Option>
                      <Option value="市级" key="市级">市级</Option>
                      <Option value="区级" key="区级">区级</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="成立时间">
                    {getFieldDecorator('build_time', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<MonthPicker css={{width:"100%"}} format="YYYY-MM" />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="地址">
                    {getFieldDecorator('address', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="主要研究方向">
                    {getFieldDecorator('content', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="新型科技属性" key="3">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="人员数量">
                    {getFieldDecorator('person_number', {
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
                  <Form.Item label="本科生工资">
                    {getFieldDecorator('qiundergraduate_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="研究生工资">
                    {getFieldDecorator('qigraduatestudent_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士生工资">
                    {getFieldDecorator('qidoctor_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士后工资">
                    {getFieldDecorator('post_doctoral_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
              {
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构">
                //     {getFieldDecorator('branch_number', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<InputNumber css={{width:"90%"}} min={0} />)}
                //   {' 个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构1所在地">
                //     {getFieldDecorator('branch1_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="国内分支机构1所在城市备注">
                //     {getFieldDecorator('branch1_province_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构2所在地">
                //     {getFieldDecorator('branch2_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="国内分支机构2所在城市备注">
                //     {getFieldDecorator('branch2_province_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构3所在地">
                //     {getFieldDecorator('branch3_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="国内分支机构3所在城市备注">
                //     {getFieldDecorator('branch3_province_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构4所在地">
                //     {getFieldDecorator('branch4_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="国内分支机构4所在城市备注">
                //     {getFieldDecorator('branch4_province_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构5所在地">
                //     {getFieldDecorator('branch5_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="国内分支机构5所在城市备注">
                //     {getFieldDecorator('branch5_province_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={24} lg={24}>
                //   <Form.Item label="在哈尔滨分支机构公司">
                //     <Row gutter={16}>
                //       <Col sm={24} md={6} lg={6}>
                //           {'公司全称 '}
                //           {getFieldDecorator('ha_fen_company_name', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={6} lg={6}>
                //           {'联系人 '}
                //           {getFieldDecorator('ha_fen_contact_person', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={6} lg={6}>
                //           {'联系方式 '}
                //           {getFieldDecorator('ha_fen_phonenumber', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={6} lg={6}>
                //           {"分支机构承担功能（内容）"}
                //           {getFieldDecorator('ha_headquarter_func', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Select
                //             mode="multiple"
                //             style={{ width: '100%' }}
                //             maxTagCount={2}
                //             maxTagPlaceholder="...等"
                //           >
                //             <Option value="生产" key="生产">生产</Option>
                //             <Option value="研发" key="研发">研发</Option>
                //             <Option value="服务" key="服务">服务</Option>
                //             <Option value="市场" key="市场">市场</Option>
                //           </Select>)}
                //       </Col>
                //     </Row>
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={24} lg={24}>
                //   <Form.Item label="在深圳分支机构公司">
                //     <Row gutter={16}>
                //       <Col sm={24} md={6} lg={6}>
                //           {'公司全称 '}
                //           {getFieldDecorator('shen_fen_company_name', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={6} lg={6}>
                //           {'联系人 '}
                //           {getFieldDecorator('shen_fen_contact_person', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={6} lg={6}>
                //           {'联系方式 '}
                //           {getFieldDecorator('shen_fen_phonenumber', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={6} lg={6}>
                //           {"分支机构承担功能（内容）"}
                //           {getFieldDecorator('shen_headquarter_func', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Select
                //             mode="multiple"
                //             style={{ width: '100%' }}
                //             maxTagCount={2}
                //             maxTagPlaceholder="...等"
                //           >
                //             <Option value="生产" key="生产">生产</Option>
                //             <Option value="研发" key="研发">研发</Option>
                //             <Option value="服务" key="服务">服务</Option>
                //             <Option value="市场" key="市场">市场</Option>
                //           </Select>)}
                //       </Col>
                //     </Row>
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="其他分支机构1">
                //     {getFieldDecorator('other1_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"40%"}} />)}
                //   {' 省'}
                //   {getFieldDecorator('other1_city', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                //   })(<Input  style={{width:"40%"}} />)}
                //   {' 市'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="其他分支机构2">
                //     {getFieldDecorator('other2_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"40%"}} />)}
                //   {' 省'}
                //   {getFieldDecorator('other2_city', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                //   })(<Input  style={{width:"40%"}} />)}
                //   {' 市'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="其他分支机构3">
                //     {getFieldDecorator('other3_province', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"40%"}} />)}
                //   {' 省'}
                //   {getFieldDecorator('other3_city', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                //   })(<Input  style={{width:"40%"}} />)}
                //   {' 市'}
                //   </Form.Item>
                // </Col>
              }
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总院/所/中心名称">
                    {getFieldDecorator('research_school_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总院/所/中心位置">
                    {getFieldDecorator('all_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 省'}
                  {getFieldDecorator('all_city', {
                    rules: [
                      { required: false, message: '' }
                  ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总院/所/中心环节">
                    {getFieldDecorator('research_school_link', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option title="基础研究（高等院校、大科学装置、国家实验室、省级实验室）" value="基础研究（高等院校、大科学装置、国家实验室、省级实验室）" key="基础研究（高等院校、大科学装置、国家实验室、省级实验室）">基础研究（高等院校、大科学装置、国家实验室、省级实验室）</Option>
                      <Option title="应用研究" value="应用研究" key="应用研究">应用研究</Option>
                      <Option title="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）" value="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）" key="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）">成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）</Option>
                      <Option title="产业化" value="产业化" key="产业化">产业化</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总院/所/中心环节支持情况">
                    {getFieldDecorator('research_school_link_support', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option title="人才" value="人才" key="人才">人才</Option>
                      <Option title="资金" value="资金" key="资金">资金</Option>
                      <Option title="市场" value="市场" key="市场">市场</Option>
                      <Option title="技术" value="技术" key="技术">技术</Option>
                      <Option title="物业" value="物业" key="物业">物业</Option>
                      <Option title="其他" value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="总院/所/中心环节支持情况备注">
                    {getFieldDecorator('research_school_support_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>



              {
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象数量">
                //     {getFieldDecorator('object_number', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<InputNumber css={{width:"90%"}} min={0} />)}
                //   {' 个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象1名称">
                //     {getFieldDecorator('object_name1', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象1属性">
                //     {getFieldDecorator('object_attr1', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select
                //       mode="multiple"
                //       style={{ width: '100%' }}
                //       maxTagCount={2}
                //       maxTagPlaceholder="...等"
                //     >
                //       <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                //       <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                //       <Option value="研究所" key="研究所">研究所</Option>
                //       <Option value="研究中心" key="研究中心">研究中心</Option>
                //       <Option value="孵化器" key="孵化器">孵化器</Option>
                //       <Option value="企业" key="企业">企业</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="合作对象1合作内容">
                //     {getFieldDecorator('object_content1', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象2名称">
                //     {getFieldDecorator('object_name2', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象2属性">
                //     {getFieldDecorator('object_attr2', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select
                //       mode="multiple"
                //       style={{ width: '100%' }}
                //       maxTagCount={2}
                //       maxTagPlaceholder="...等"
                //     >
                //       <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                //       <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                //       <Option value="研究所" key="研究所">研究所</Option>
                //       <Option value="研究中心" key="研究中心">研究中心</Option>
                //       <Option value="孵化器" key="孵化器">孵化器</Option>
                //       <Option value="企业" key="企业">企业</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="合作对象2合作内容">
                //     {getFieldDecorator('object_content2', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象3名称">
                //     {getFieldDecorator('object_name3', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象3属性">
                //     {getFieldDecorator('object_attr3', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select
                //       mode="multiple"
                //       style={{ width: '100%' }}
                //       maxTagCount={2}
                //       maxTagPlaceholder="...等"
                //     >
                //       <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                //       <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                //       <Option value="研究所" key="研究所">研究所</Option>
                //       <Option value="研究中心" key="研究中心">研究中心</Option>
                //       <Option value="孵化器" key="孵化器">孵化器</Option>
                //       <Option value="企业" key="企业">企业</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="合作对象3合作内容">
                //     {getFieldDecorator('object_content3', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象4名称">
                //     {getFieldDecorator('object_name4', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作对象4属性">
                //     {getFieldDecorator('object_attr4', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select
                //       mode="multiple"
                //       style={{ width: '100%' }}
                //       maxTagCount={2}
                //       maxTagPlaceholder="...等"
                //     >
                //       <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                //       <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                //       <Option value="研究所" key="研究所">研究所</Option>
                //       <Option value="研究中心" key="研究中心">研究中心</Option>
                //       <Option value="孵化器" key="孵化器">孵化器</Option>
                //       <Option value="企业" key="企业">企业</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="合作对象4合作内容">
                //     {getFieldDecorator('object_content4', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={24} lg={24}>
                //   <Form.Item label="深圳合作/哈尔滨对象">
                //     <Row gutter={16}>
                //       <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                //           {'全称 '}
                //           {getFieldDecorator('shenha_company_name', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                //           {'联系人 '}
                //           {getFieldDecorator('shenha_contact_person', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                //           {'联系电话 '}
                //           {getFieldDecorator('shenha_phonenumber', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                //         <Form.Item label="合作功能">
                //           {getFieldDecorator('shenha_func', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Select
                //             mode="multiple"
                //             style={{ width: '100%' }}
                //             maxTagCount={2}
                //             maxTagPlaceholder="...等"
                //           >
                //             <Option value="生产" key="生产">生产</Option>
                //             <Option value="研发" key="研发">研发</Option>
                //             <Option value="服务" key="服务">服务</Option>
                //             <Option value="市场" key="市场">市场</Option>
                //           </Select>)}
                //         </Form.Item>
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px",marginTop:"20px"}}>
                //         <Form.Item label="其他合作对象">
                //           {getFieldDecorator('other_cooperation_object', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //     </Row>
                //   </Form.Item>
                // </Col>
              }
                {
                // <Col sm={24} md={24} lg={24}>
                //   <Form.Item label="哈尔滨/深圳合作">
                //     <Row gutter={16}>
                //       <Col sm={24} md={8} lg={8}>
                //           {'合作1 '}
                //           {getFieldDecorator('hashen1_cooperation', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8}>
                //           {'联系人 '}
                //           {getFieldDecorator('hashen1_contact_person', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8}>
                //           {'联系方式 '}
                //           {getFieldDecorator('hashen1_phonenumber', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //         <Form.Item label="合作原因">
                //           {getFieldDecorator('hashen1_reason', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //         <Form.Item label="合作内容">
                //           {getFieldDecorator('hashen1_content', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //         <Form.Item label="哈深合作1备注">
                //           {getFieldDecorator('hashen1_note', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //     </Row>
                //     <Row gutter={16}>
                //       <Col sm={24} md={8} lg={8}>
                //           {'合作2 '}
                //           {getFieldDecorator('hashen2_cooperation', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8}>
                //           {'联系人 '}
                //           {getFieldDecorator('hashen2_contact_person', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8}>
                //           {'联系方式 '}
                //           {getFieldDecorator('hashen2_phonenumber', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //         <Form.Item label="合作原因">
                //           {getFieldDecorator('hashen2_reason', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //         <Form.Item label="合作内容">
                //           {getFieldDecorator('hashen2_content', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //       <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //         <Form.Item label="哈深合作2备注">
                //           {getFieldDecorator('hashen2_note', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //         </Form.Item>
                //       </Col>
                //     </Row>
                //   </Form.Item>
                // </Col>
              }
              </Row>
            </Panel>
            <Panel header="物业相关" key="3.1">
              <Row gutter={16}>
              <Col sm={24} md={12} lg={8}>
                <Form.Item label="独立占地土地性质">
                  {getFieldDecorator('land_character', {
                    rules: [
                      { required: false, message: '' }
                  ],
                })(<Select style={{ width: "100%" }}>
                    <Option value="产业用地" key="产业用地">产业用地</Option>
                    <Option value="工业用地" key="工业用地">工业用地</Option>
                    <Option value="物流仓储用地" key="物流仓储用地">物流仓储用地</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col sm={24} md={12} lg={8}>
                <Form.Item label="独立占地的占地面积">
                  {getFieldDecorator('enterprise_coverage', {
                    rules: [
                      { required: false, message: '' }
                  ],
                })(<InputNumber css={{width:"90%"}} min={0} />)}
                {' m²'}
                </Form.Item>
              </Col>
              <Col sm={24} md={12} lg={8}>
                <Form.Item label="独立占地的建筑面积">
                  {getFieldDecorator('zhandi_zong_area', {
                    rules: [
                      { required: false, message: '' }
                  ],
                })(<InputNumber css={{width:"90%"}} min={0} />)}
                {' m²'}
                </Form.Item>
              </Col>

              <Col sm={24} md={12} lg={8}>
                <Form.Item label="独立占地的建筑数量">
                  {getFieldDecorator('jianzhu_number', {
                    rules: [
                      { required: false, message: '' }
                  ],
                })(<InputNumber css={{width:"90%"}} min={0} />)}
                {' 栋'}
                </Form.Item>
              </Col>
                <Col span={24}>
                  <FloorField
                    setFloor_field={(value)=>{this.setFloor_field(value)}}
                    data={_.cloneDeep(this.state.floor_field) || []}
                  />
                </Col>
                <Col span={24}>
                  <EdificeField
                    setEdifice_field={(value)=>{this.setEdifice_field(value)}}
                    data={_.cloneDeep(this.state.edifice_field) || []}
                  />
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="停车位数量">
                    {getFieldDecorator('parking_space', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="配套设施现状">
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
                      <Option value="住宅" key="住宅">住宅</Option>
                      <Option value="食堂" key="食堂">食堂</Option>
                      <Option value="餐饮店" key="餐饮店">餐饮店</Option>
                      <Option value="银行" key="银行">银行</Option>
                      <Option value="便利店" key="便利店">便利店</Option>
                      <Option value="超市" key="超市">超市</Option>
                      <Option value="咖啡厅" key="咖啡厅">咖啡厅</Option>
                      <Option value="清吧" key="清吧">清吧</Option>
                      <Option value="民间金融" key="民间金融">民间金融</Option>
                      <Option value="篮球场" key="篮球场">篮球场</Option>
                      <Option value="足球场" key="足球场">足球场</Option>
                      <Option value="健身房" key="健身房">健身房</Option>
                      <Option value="会议中心" key="会议中心">会议中心</Option>
                      <Option value="商务酒店" key="商务酒店">商务酒店</Option>
                      <Option value="医疗" key="医疗">医疗</Option>
                      <Option value="学校" key="学校">学校</Option>
                      <Option value="电影院" key="电影院">电影院</Option>
                      <Option value="购物中心" key="购物中心">购物中心</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="发展诉求相关" key="3.2">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位发展基本需求">
                    {getFieldDecorator('company_base_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="工商注册等基础服务" key="工商注册等基础服务">工商注册等基础服务</Option>
                      <Option value="政策咨询及解读" key="政策咨询及解读">政策咨询及解读</Option>
                      <Option value="环评、能评、消防等政府对接及代办业务" key="环评、能评、消防等政府对接及代办业务">环评、能评、消防等政府对接及代办业务</Option>
                      <Option value="专业企管公司" key="专业企管公司">专业企管公司</Option>
                      <Option value="专业财务公司" key="专业财务公司">专业财务公司</Option>
                      <Option value="孵化器服务" key="孵化器服务">孵化器服务</Option>
                      <Option value="律所" key="律所">律所</Option>
                      <Option value="品牌策划公司" key="品牌策划公司">品牌策划公司</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="基本需求情况说明">
                    {getFieldDecorator('company_base_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于功能硬件配套的需求">
                    {getFieldDecorator('func_hardware_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <OptGroup label="技术配套" key="技术配套">
                        <Option value="公共研发中心" key="公共研发中心">公共研发中心</Option>
                        <Option value="孵化中心" key="孵化中心">孵化中心</Option>
                        <Option value="检测认证中心" key="检测认证中心">检测认证中心</Option>
                      </OptGroup>
                      <OptGroup label="商务配套" key="商务配套">
                        <Option value="展示交易中心" key="展示交易中心">展示交易中心</Option>
                        <Option value="教育培训中心" key="教育培训中心">教育培训中心</Option>
                        <Option value="商务会议中心" key="商务会议中心">商务会议中心</Option>
                      </OptGroup>
                      <OptGroup label="生活配套" key="生活配套">
                        <Option value="居住" key="居住">居住</Option>
                        <Option value="公寓" key="公寓">公寓</Option>
                        <Option value="商业等" key="商业等">商业等</Option>
                      </OptGroup>
                      <Option value="精装修（拎包入住）" key="精装修（拎包入住）">精装修（拎包入住）</Option>
                      <Option value="物流及仓储空间" key="物流及仓储空间">物流及仓储空间</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="单位对于功能硬件配套的需求情况说明">
                    {getFieldDecorator('func_hardware_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="物业层高需求（建筑）">
                    {getFieldDecorator('layer_height_requirement', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="3.6m" key="3.6m">3.6m</Option>
                      <Option value="3.9-4.2m" key="3.9-4.2m">3.9-4.2m</Option>
                      <Option value="4.5m" key="4.5m">4.5m</Option>
                      <Option value="5.5-6m" key="5.5-6m">5.5-6m</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="物业面积需求（建筑）">
                    {getFieldDecorator('layer_squae_requirement', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="100-200m²" key="100-200m²">100-200m²</Option>
                      <Option value="300-500m²" key="300-500m²">300-500m²</Option>
                      <Option value="500-1000m²" key="500-1000m²">500-1000m²</Option>
                      <Option value="1000-3000m²" key="1000-3000m²">1000-3000m²</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="其他硬件需求">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'电梯 '}
                        {getFieldDecorator('lift_require', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'承重 '}
                        {getFieldDecorator('bearing_require', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'温度 '}
                        {getFieldDecorator('temperature_require', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"100px"}} min={0} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'仓储 '}
                        {getFieldDecorator('store_require', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'设备 '}
                        {getFieldDecorator('device_require', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'其他 '}
                        {getFieldDecorator('other_require', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"100px"}} />)}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总成本">
                    {getFieldDecorator('total_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 万元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="成本构成">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'用工成本 '}
                        {getFieldDecorator('yonggong_cost',{
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('yonggong_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'原材料成本 '}
                        {getFieldDecorator('source_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('source_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'设备 '}
                        {getFieldDecorator('device_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {getFieldDecorator('device_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'管理成本 '}
                        {getFieldDecorator('manage_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('manage_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'场地租金 '}
                        {getFieldDecorator('rent_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('rent_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'其他固定开支 '}
                        {getFieldDecorator('other_must_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('other_must_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'增值税 '}
                        {getFieldDecorator('zengzhi_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('zengzhi_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'企业所得税 '}
                        {getFieldDecorator('company_should_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('company_should_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'个人所得税 '}
                        {getFieldDecorator('person_should_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('person_should_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'财产税及行为税 '}
                        {getFieldDecorator('property_should_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('property_should_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'利息成本 '}
                        {getFieldDecorator('interest_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('interest_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'库存成本 '}
                        {getFieldDecorator('stock_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('stock_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'违约罚款 '}
                        {getFieldDecorator('punish_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('punish_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'罚款罚金 '}
                        {getFieldDecorator('punish_formaney_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('punish_formaney_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'其他 '}
                        {getFieldDecorator('other_all_cost', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('other_all_cost_unit', { initialValue: '元'},
                        {
                          rules: [
                            { required: false, message: '' }
                        ],
                      })(<Select style={{ width: "60px" }}>
                          <Option value="元" key="元">元</Option>
                          <Option value="%" key="%">%</Option>
                        </Select>)}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总收入">
                    {getFieldDecorator('total_profit', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 万元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="收入构成">
                    {getFieldDecorator('profit_composition', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="产业投资方式">
                    {getFieldDecorator('park_series', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="直接投资" key="直接投资">直接投资</Option>
                      <Option value="间接投资（管理基金或参股基金）" key="间接投资（管理基金或参股基金）">间接投资（管理基金或参股基金）</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} style={{height:"30px"}}>
                  <Form.Item label="产业基金规模">
                    {getFieldDecorator('industrial_fund_scale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"50%"}} min={0} />)}
                  {getFieldDecorator('industrial_fund_scale_money_type',
                  { initialValue: '万元（人民币）'},
                  {
                    rules: [
                      { required: false, message: '' }
                  ],
                })(<Select style={{ width: "50%" }}>
                      <Option value="万元（人民币）" key="万元（人民币）">万元（人民币）</Option>
                      <Option value="万元（美元）" key="万元（美元）">万元（美元）</Option>
                      <Option value="万元（港币）" key="万元（港币）">万元（港币）</Option>
                      <Option value="万元（欧元）" key="万元（欧元）">万元（欧元）</Option>
                      <Option value="万元（新台币）" key="万元（新台币）">万元（新台币）</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业基金投资模式">
                    {getFieldDecorator('fund_investment_mode', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业基金投资筛选标准">
                    {getFieldDecorator('fund_investment_filter', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业基金投资退出机制">
                    {getFieldDecorator('fund_investment_exit', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="其他服务">
                    {getFieldDecorator('other_service', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>














                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位降低内部综合管理成本的需求">
                    {getFieldDecorator('reduce_cost_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="在线培训" key="在线培训">在线培训</Option>
                      <Option value="智能会议系统" key="智能会议系统">智能会议系统</Option>
                      <Option value="差旅信息服务平台" key="差旅信息服务平台">差旅信息服务平台</Option>
                      <Option value="活动信息发布与管理" key="活动信息发布与管理">活动信息发布与管理</Option>
                      <Option value="线上采购平台" key="线上采购平台">线上采购平台</Option>
                      <Option value="合同信息管理系统" key="合同信息管理系统">合同信息管理系统</Option>
                      <Option value="财会服务" key="财会服务">财会服务</Option>
                      <Option value="仓储物流信息服务" key="仓储物流信息服务">仓储物流信息服务</Option>
                      <Option value="内控与造价在线咨询" key="内控与造价在线咨询">内控与造价在线咨询</Option>
                      <Option value="在线法律服务" key="在线法律服务">在线法律服务</Option>
                      <Option value="知识管理平台（及相关法律服务）" key="知识管理平台（及相关法律服务）">知识管理平台（及相关法律服务）</Option>
                      <Option value="其他" key="其他">其他</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="单位降低内部综合管理成本的需求情况说明">
                    {getFieldDecorator('reduce_cost_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于生产性服务的需求">
                    {getFieldDecorator('product_service_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="科技成果转化平台" key="科技成果转化平台">科技成果转化平台</Option>
                      <Option value="检验检测认证标准计量服务" key="检验检测认证标准计量服务">检验检测认证标准计量服务</Option>
                      <Option value="货物运输" key="货物运输">货物运输</Option>
                      <Option value="商务服务" key="商务服务">商务服务</Option>
                      <Option value="需求调研" key="需求调研">需求调研</Option>
                      <Option value="设计和研发" key="设计和研发">设计和研发</Option>
                      <Option value="技术服务（产学研合作信息共享等）" key="技术服务（产学研合作信息共享等）">技术服务（产学研合作信息共享等）</Option>
                      <Option value="其他" key="其他">其他</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="单位对于生产性服务的需求情况说明">
                    {getFieldDecorator('product_service_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于金融的需求">
                    {getFieldDecorator('finance_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="天使投资VC/PE " key="天使投资VC/PE ">天使投资VC/PE </Option>
                      <Option value="IPO" key="IPO">IPO</Option>
                      <Option value="M&A服务（兼并与收购）" key="M&A服务（兼并与收购）">M&A服务（兼并与收购）</Option>
                      <Option value="政府基金" key="政府基金">政府基金</Option>
                      <Option value="商业银行信用贷款" key="商业银行信用贷款">商业银行信用贷款</Option>
                      <Option value="商业银行抵押贷款" key="商业银行抵押贷款">商业银行抵押贷款</Option>
                      <Option value="担保贷款（包括集群企业联保融资等）" key="担保贷款（包括集群企业联保融资等）">担保贷款（包括集群企业联保融资等）</Option>
                      <Option value="债券融资（包括ABS）" key="债券融资（包括ABS）">债券融资（包括ABS）</Option>
                      <Option value="夹层融资" key="夹层融资">夹层融资</Option>
                      <Option value="REITS（信托投资基金）" key="REITS（信托投资基金）">REITS（信托投资基金）</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="金融及资金需求情况说明">
                    {getFieldDecorator('finance_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于非金融资金的需求">
                    {getFieldDecorator('no_finance_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="物业入股/PE " key="物业入股/PE ">物业入股/PE </Option>
                      <Option value="政府专项奖励政策资金" key="政府专项奖励政策资金">政府专项奖励政策资金</Option>
                      <Option value="集群企业联保服务" key="集群企业联保服务">集群企业联保服务</Option>
                      <Option value="科创板奖励政策" key="科创板奖励政策">科创板奖励政策</Option>
                      <Option value="租金补贴" key="租金补贴">租金补贴</Option>
                      <Option value="电费、网费等减免或补贴" key="电费、网费等减免或补贴">电费、网费等减免或补贴</Option>
                      <Option value="其他费用补贴" key="其他费用补贴">其他费用补贴</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="非金融资金需求情况说明">
                    {getFieldDecorator('no_finance_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>


                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于人才的需求">
                    {getFieldDecorator('tech_person_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="产学研人才对接服务" key="产学研人才对接服务">产学研人才对接服务</Option>
                      <Option value="专业猎头服务" key="专业猎头服务">专业猎头服务</Option>
                      <Option value="多渠道人才推荐" key="多渠道人才推荐">多渠道人才推荐</Option>
                      <Option value="团队建设服务" key="团队建设服务">团队建设服务</Option>
                      <Option value="人才培训服务" key="人才培训服务">人才培训服务</Option>
                      <Option value="人才引进" key="人才引进">人才引进</Option>
                      <Option value="人才专项政策（人才补贴）" key="人才专项政策（人才补贴）">人才专项政策（人才补贴）</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="人才需求情况说明">
                    {getFieldDecorator('tech_person_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于税收方面的需求">
                    {getFieldDecorator('tax_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="税收分成或返还" key="税收分成或返还">税收分成或返还</Option>
                      <Option value="企业其他税种减免" key="企业其他税种减免">企业其他税种减免</Option>
                      <Option value="个人税收减免" key="个人税收减免">个人税收减免</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="税收需求情况说明">
                    {getFieldDecorator('tax_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位对于科技创新服务的需求">
                    {getFieldDecorator('technology_services_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="产品设计" key="产品设计">产品设计</Option>
                      <Option value="工业设计" key="工业设计">工业设计</Option>
                      <Option value="知识产权相关工作" key="知识产权相关工作">知识产权相关工作</Option>
                      <Option value="认证认可机构" key="认证认可机构">认证认可机构</Option>
                      <Option value="技术评估交易" key="技术评估交易">技术评估交易</Option>
                      <Option value="科技体验与展示" key="科技体验与展示">科技体验与展示</Option>
                      <Option value="路演中心" key="路演中心">路演中心</Option>
                      <Option value="科研人员技术攻关" key="科研人员技术攻关">科研人员技术攻关</Option>
                      <Option value="产学研初期对接" key="产学研初期对接">产学研初期对接</Option>
                      <Option value="产业链资源优化整合服务" key="产业链资源优化整合服务">产业链资源优化整合服务</Option>
                      <Option value="高校需求" key="高校需求">高校需求</Option>
                      <Option value="实验室需求" key="实验室需求">实验室需求</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="科技创新服务需求情况说明">
                    {getFieldDecorator('technology_services_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="信息服务需求">
                    {getFieldDecorator('information_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="国内外产业技术信息" key="国内外产业技术信息">国内外产业技术信息</Option>
                      <Option value="行业竞争程度" key="行业竞争程度">行业竞争程度</Option>
                      <Option value="消费倾向" key="消费倾向">消费倾向</Option>
                      <Option value="行业政策" key="行业政策">行业政策</Option>
                      <Option value="建立机构与企业间的信息对接平台" key="建立机构与企业间的信息对接平台">建立机构与企业间的信息对接平台</Option>
                      <Option value="信息宣传" key="信息宣传">信息宣传</Option>
                      <Option value="信息监测" key="信息监测">信息监测</Option>
                      <Option value="信息管理" key="信息管理">信息管理</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="信息服务需求情况说明">
                    {getFieldDecorator('information_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之市场销售">
                    {getFieldDecorator('develop_for_marketing', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="市场信息分析与展示" key="市场信息分析与展示">市场信息分析与展示</Option>
                      <Option value="资信信息服务" key="资信信息服务">资信信息服务</Option>
                      <Option value="供求信息在线对接" key="供求信息在线对接">供求信息在线对接</Option>
                      <Option value="样品投入市场的专业调研服务" key="样品投入市场的专业调研服务">样品投入市场的专业调研服务</Option>
                      <Option value="品牌策划服务" key="品牌策划服务">品牌策划服务</Option>
                      <Option value="网络搭建服务" key="网络搭建服务">网络搭建服务</Option>
                      <Option value="品牌整合推广" key="品牌整合推广">品牌整合推广</Option>
                      <Option value="品牌运营检测" key="品牌运营检测">品牌运营检测</Option>
                      <Option value="市场开拓服务" key="市场开拓服务">市场开拓服务</Option>
                      <Option value="在线宣传服务" key="在线宣传服务">在线宣传服务</Option>
                      <Option value="在线营销管理" key="在线营销管理">在线营销管理</Option>
                      <Option value="客户信息管理" key="客户信息管理">客户信息管理</Option>
                      <Option value="线上投诉与建议管理" key="线上投诉与建议管理">线上投诉与建议管理</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之市场销售/情况说明">
                    {getFieldDecorator('develop_note_marketing', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="城市公共配套需求">
                    {getFieldDecorator('public_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="城市交通" key="城市交通">城市交通</Option>
                      <Option value="学校" key="学校">学校</Option>
                      <Option value="医院" key="医院">医院</Option>
                      <Option value="市政" key="市政">市政</Option>
                      <Option value="公园" key="公园">公园</Option>
                      <Option value="其他" key="其他">其他</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="城市公共配套需求情况说明">
                    {getFieldDecorator('public_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="技术需求说明">
                    {getFieldDecorator('tech_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="单位现代化管理诉求">
                    {getFieldDecorator('modern_manage_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="人力资源管理制度" key="人力资源管理制度">人力资源管理制度</Option>
                      <Option value="财务管理制度" key="财务管理制度">财务管理制度</Option>
                      <Option value="审计制度" key="审计制度">审计制度</Option>
                      <Option value="运营管理制度" key="运营管理制度">运营管理制度</Option>
                      <Option value="危机管理制度" key="危机管理制度">危机管理制度</Option>
                      <Option value="企业发展战略制度" key="企业发展战略制度">企业发展战略制度</Option>
                      <Option value="办公室管理制度" key="办公室管理制度">办公室管理制度</Option>
                    </Select>)}
                  </Form.Item>
                </Col>




                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="其他需求">
                    {getFieldDecorator('other_require_needs', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="其他需求情况说明">
                    {getFieldDecorator('other_require_note', {
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
                      <Option value="公务员系统" key="公务员系统">公务员系统</Option>
                      <Option value="聘任制" key="聘任制">聘任制</Option>
                      <Option value="考任制" key="考任制">考任制</Option>
                      <Option value="选任制" key="选任制">选任制</Option>
                      <Option value="委任制" key="委任制">委任制</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/考核激励方式">
                    {getFieldDecorator('method_assessment', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/考核方式">
                    {getFieldDecorator('examination_methods', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/其他">
                    {getFieldDecorator('examination_other', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="分支机构及合作对象" key="3.1.1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构">
                    {getFieldDecorator('domestic_branch', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国外分支机构">
                    {getFieldDecorator('outer_branch_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内合作对象">
                    {getFieldDecorator('inner_cooper_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国外合作对象">
                    {getFieldDecorator('outer_cooper_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
              </Row>
              <Row guttet={16} style={{marginTop:"20px"}}>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="深圳合作/哈尔滨对象">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                          {'全称 '}
                          {getFieldDecorator('shenha_company_name', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                          {'联系人 '}
                          {getFieldDecorator('shenha_contact_person', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                          {'联系电话 '}
                          {getFieldDecorator('shenha_phonenumber', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8} style={{marginTop:"20px"}}>
                        <Form.Item label="合作功能">
                          {getFieldDecorator('shenha_func', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={2}
                            maxTagPlaceholder="...等"
                          >
                            <Option value="生产" key="生产">生产</Option>
                            <Option value="研发" key="研发">研发</Option>
                            <Option value="服务" key="服务">服务</Option>
                            <Option value="市场" key="市场">市场</Option>
                          </Select>)}
                        </Form.Item>
                      </Col>
              {
              //         <Col sm={24} md={12} lg={8} css={{height:"93px",marginTop:"20px"}}>
              //           <Form.Item label="其他合作对象">
              //             {getFieldDecorator('other_cooperation_object', {
              //               rules: [
              //                 { required: false, message: '' }
              //             ],
              //           })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
              //           </Form.Item>
              //         </Col>
             }
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <AgencyList
                    setAgencys_shenha={(value)=>{this.setAgencys_shenha(value)}}
                    data={_.cloneDeep(this.state.agencys_shenha) || []}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <InnerAgency
                    setInner_agency={(value)=>{this.setInner_agency(value)}}
                    data={_.cloneDeep(this.state.inner_agency) || []}
                  />
                </Col>
                <Col>
                  <OuterAgency
                    setOuter_agency={(value)=>{this.setOuter_agency(value)}}
                    data={_.cloneDeep(this.state.outer_agency) || []}
                  />
                </Col>
                <Col>
                  <div style={{padding: "0 20px 0 20px"}}>
                    <Row gutter={16}>
                      <Col sm={24} md={18} lg={18} css={{height:"32px",marginTop:"20px"}}>
                          <div css={{display:"flex"}}>
                            <div css={{flex:"0 0 120px"}}>
                              {'其他国内分支机构'}
                            </div>
                            <div css={{flex:"1 1 auto"}}>
                              {getFieldDecorator('other_inner_agency', {
                                rules: [
                                    { required: false, message: '' }
                                ],
                              })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                            </div>
                          </div>
                      </Col>
                      <Col sm={24} md={6} lg={6} css={{marginTop:"20px"}}>
                        <div>
                          {getFieldDecorator('other_inner_count', {
                            rules: [
                              { required: false, message: '' }
                            ],
                          })(<InputNumber css={{width:"80%"}} min={0} />)}
                          {' 个'}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <CooperShenha
                    setCooper_shenha={(value)=>{this.setCooper_shenha(value)}}
                    data={_.cloneDeep(this.state.cooper_shenha) || []}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <CooperPartner
                    setCooper_list={(value)=>{this.setCooper_list(value)}}
                    data={_.cloneDeep(this.state.cooper_list) || []}
                  />
                </Col>
                <Col>
                  <CooperPartnerOuter
                    setCooper_outer_list={(value)=>{this.setCooper_outer_list(value)}}
                    data={_.cloneDeep(this.state.cooper_outer_list) || []}
                  />
                </Col>
              </Row>
            </Panel>
            <Panel header="成果相关" key="3.1.2">
              <Row gutter={16}>
                <Col>
                  <AchievementField
                    setAchievement_field={(value)=>{this.setAchievement_field(value)}}
                    data={_.cloneDeep(this.state.achievement_field) || []}
                  />
                </Col>
              </Row>
            </Panel>
            <Panel header="联系及地理" key="4" >
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
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="纬度">
                    {getFieldDecorator('latitude', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="哈深产业园区引入条件">
                    {getFieldDecorator('condition', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="对产业园建议">
                    {getFieldDecorator('suggest', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="科技创新备注" key="5" style={{borderBottom:"none"}}>
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

                {
                  this.state.isSubmiting ?
                  <Button type="primary" loading={this.state.isSubmiting}>
                    Loading
                  </Button>
                  :
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                }
              </Form.Item>
          </div>
        </Form>
      </div>
    )
  }
}
const FormList = Form.create()(FormDetail)
export default FormList
