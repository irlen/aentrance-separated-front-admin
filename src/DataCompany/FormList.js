/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, {Component} from 'react'
import { Cascader, Row, Col, Input, Form, Icon, Button, Collapse,
  DatePicker, InputNumber, Select ,
  AutoComplete, message
} from 'antd'
import _ from 'lodash'
import moment from 'moment'

import { FormModule } from '../components/Amodule'
import { wyAxiosPost } from '../components/WyAxios'
import { cityList } from '../components/constants'
import AgencyList from './AgencyList' //深圳哈尔滨分支机构
import InnerAgency from './InnerAgency' //国内分支机构
import OuterAgency from './OuterAgency' //国外分支机构
import AbroadInvestment from './AbroadInvestment' //对外投资
import CooperField from './CooperField'  //合作对象
import FloorField from './FloorField'  //非独立占地的物业层
import EdificeField from './EdificeField'  //非独立占地的建筑


const { Panel } = Collapse
const { TextArea } =  Input
const { Option } = Select
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
    province:[],
    agencys_shenha:[], //深圳哈尔滨分支机构
    inner_agency:[],//国内分支机构
    outer_agency:[],//国外分支机构
    abroad_investment:[],//对外投资
    cooper_field:[], //合作对象
    floor_field:[], //非独立占地物业层
    edifice_field:[], //非独立占地物业建筑
  }
  componentDidMount(){
    this._isMounted = true
    this.getAdress()
    this.getProvince()
    this.getParkNameList().then(()=>{
      if(this._isMounted){
        const { id,curFields } = this.props
        const {agencys_shenha, inner_agency, outer_agency, abroad_investment, cooper_field, floor_field, edifice_field } = curFields
        this.setState({
          id,
          curFields,
          agencys_shenha,
          inner_agency,
          outer_agency,
          abroad_investment,
          cooper_field,
          floor_field,
          edifice_field
        },()=>{
          this.props.form.resetFields()
          let formData = {}
          formData = _.cloneDeep(this.state.curFields)
          if(this.state.curFields.built_time){
            formData = Object.assign({},formData,{built_time: moment(this.state.curFields.built_time,'YYYY-MM')})
          }
          if(this.state.curFields.park_name && this.state.curFields.park_id){
            const new_park_name = {}
            new_park_name["park_id"] = this.state.curFields.park_id
            new_park_name["park_name"] = this.state.curFields.park_name
            const park_name = JSON.stringify(new_park_name)
            formData = Object.assign({},formData,{"park_name":park_name})
          }
          if(this.state.curFields.building_name && this.state.curFields.building_id){
            const new_building_name = {}
            new_building_name["building_id"] = this.state.curFields.building_id
            new_building_name["building_name"] = this.state.curFields.building_name
            const building_name = JSON.stringify(new_building_name)
            formData = Object.assign({},formData,{"building_name":building_name})
          }
          wyAxiosPost('Build/getBuildNameList',{park_id:this.state.curFields.park_id || ''},(result)=>{
            const responseData = result.data.msg
            if(this._isMounted){
              this.setState({
                buildList: _.cloneDeep(responseData.msg),
                initBuildList:_.cloneDeep(responseData.msg)
              },()=>{
                this.props.form.setFieldsValue(formData)
              })
            }
          })
        })
      }
    })
  }

  //获取地址
  getAdress = ()=>{
      const digui = (arr)=>{
        const cityList = []
        const zhixiashi = ['北京市','天津市','重庆市','上海市','香港','澳门']
        arr.map((item,index)=>{
          let curList = {}
          curList.value = item.n
          curList.label = item.n
          if(zhixiashi.indexOf(item.n) === -1 && item.c){
            let subCityList = []
            item.c.map(subItem=>{
              let subCurList = {}
              subCurList.value = subItem.n
              subCurList.label = subItem.n
              subCityList.push(subCurList)
            })
            curList.children = subCityList
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

  //获取园区名称列表
  getParkNameList = ()=>{
    return new Promise((resolve,reject)=>{
      wyAxiosPost('Park/getParkNameList',{},(result)=>{
        const responseData = result.data.msg
        if(this._isMounted){
          this.setState({
            parkNameList: _.cloneDeep(responseData.msg),
            initParkNameList: _.cloneDeep(responseData.msg)
          },()=>{
            resolve()
          })
        }
      })
    })
  }
  //提交
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {

      if (!err) {
        let fields = {}
        let park_name = ''
        let park_id = ''
        let building_name = ''
        let building_id = ''
        if(fieldsValue.park_name){
          const uncompile_park_name = JSON.parse(fieldsValue.park_name)
          park_name = uncompile_park_name.park_name
          park_id = uncompile_park_name.park_id
        }
        if(fieldsValue.building_name){
          const uncompile_building_name = JSON.parse(fieldsValue.building_name)
          building_name = uncompile_building_name.building_name
          building_id = uncompile_building_name.building_id
        }
        const values = {
          ...fieldsValue,
          'built_time':fieldsValue['built_time']?fieldsValue['built_time'].format('YYYY-MM'):'',
          'park_name': park_name,
          'park_id': park_id,
          'building_name': building_name,
          'building_id': building_id,
          'agencys_shenha': _.cloneDeep(this.state.agencys_shenha),
          'inner_agency': _.cloneDeep(this.state.inner_agency),
          'outer_agency': _.cloneDeep(this.state.outer_agency),
          'abroad_investment': _.cloneDeep(this.state.abroad_investment),
          'cooper_field': _.cloneDeep(this.state.cooper_field),
          'floor_field': _.cloneDeep(this.state.floor_field),
          'edifice_field': _.cloneDeep(this.state.edifice_field),
        }
        fields = values
        if(this._isMounted){
          this.setState({
            isSubmiting: true
          })
        }
        wyAxiosPost('Enterprise/saveEnterprise',{id:this.state.id,info:fields},(result)=>{
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
  //获取省
  getProvince = ()=>{
    wyAxiosPost('Park/getProvince',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          province: responseData.msg
        })
      }
    })
  }
  //根据产业园取楼宇
  parkChange = (value)=>{
    let park_id = ''
    if(value){
       park_id = JSON.parse(value).park_id
    }
    wyAxiosPost('Build/getBuildNameList',{park_id},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          buildList: _.cloneDeep(responseData.msg),
          initBuildList:_.cloneDeep(responseData.msg)
        },()=>{
          this.props.form.setFieldsValue({"building_name":""})
        })
      }
    })
  }
  //楼宇变更时同步经纬度到企业经纬度
  buildChange = (value)=>{
    let id = ''
    if(value){
      id = JSON.parse(value).building_id
    }
    wyAxiosPost('Build/getLongAndLat',{id},(result)=>{
      const responseData = result.data.msg
      const { longitude, latitude } = responseData.msg
      if(longitude && latitude){
        this.props.form.setFieldsValue({longitude,latitude})
      }
     })
  }
  //blur报错效果
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  parkSearch =(value)=>{
    let newList = this.state.initParkNameList.filter(o=> o.indexOf(value) !== -1 )
    if(this._isMounted){
      this.setState({
        parkNameList: newList
      })
    }
  }
  buildSearch =(value)=>{
    let newList = this.state.initBuildList.filter(o=> o.indexOf(value) !== -1 )
    if(this._isMounted){
      this.setState({
        buildList: newList
      })
    }
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
  setAbroad_investment = (value)=>{
    if(this._isMounted){
      this.setState({
        abroad_investment: value
      })
    }
  }
  setCooper_field = (value)=>{
    if(this._isMounted){
      this.setState({
        cooper_field: value
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
                <Col sm={24} md={12} lg={8} style={{height:"30px"}}>
                  <Form.Item label="产业园名称">
                    {getFieldDecorator('park_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(
                    <Select
                      showSearch
                      showArrow={false}
                      notFoundContent={'未匹配到任何对象'}
                      style={{width:"100%"}}
                      defaultActiveFirstOption={true}
                      optionFilterProp="name"
                      onChange={this.parkChange}
                    >
                      <Option value="" key='mykey' name="无">无</Option>
                    {
                      this.state.parkNameList && this.state.parkNameList.length>0?
                      this.state.parkNameList.map(item=>{
                        return <Option value={`{"park_id":"${item.park_id}","park_name":"${item.park_name}"}`} key={item.park_id} name={item.park_name}>{item.park_name}</Option>
                      })
                      :
                      ''
                    }
                    </Select>
                )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} style={{height:"30px"}}>
                  <Form.Item label="楼宇名称">
                    {getFieldDecorator('building_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(
                    <Select
                      showSearch
                      showArrow={false}
                      notFoundContent={'未匹配到任何对象'}
                      style={{width:"100%"}}
                      defaultActiveFirstOption={true}
                      optionFilterProp="name"
                      onChange={this.buildChange}
                    >
                      <Option value="" key='mykey' name="无">无</Option>
                    {
                      this.state.buildList && this.state.buildList.length>0?
                      this.state.buildList.map(item=>{
                        return <Option value={`{"building_id":"${item.building_id}","building_name":"${item.building_name}"}`} key={item.building_id} name={item.building_name}>{item.building_name}</Option>
                      })
                      :
                      ''
                    }
                    </Select>
                )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业名称">
                    {getFieldDecorator('enterprise_name', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<Input placeholder="Please enter user name" />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="成立时间">
                    {getFieldDecorator('built_time', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<MonthPicker css={{width:"100%"}} format="YYYY-MM" />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} style={{height:"30px"}}>
                  <Form.Item label="注册资本">
                    {getFieldDecorator('registered_capital', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"50%"}} min={0} />)}
                  {getFieldDecorator('money_type',
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业所在城市">
                    {getFieldDecorator('enterprise_address', {
                      rules: [
                        { required: true, message: '' }
                    ],
                  })(<Cascader
                      showSearch
                      options={this.state.adressList}
                      changeOnSelect
                    />)}
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
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                 <Form.Item label="办公地址">
                   {getFieldDecorator('office_address', {
                     rules: [
                       { required: false, message: '' }
                   ],
                 })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                 </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="启动资本构成">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={6} style={{marginBottom:"20px"}}>
                        {'政府参股 '}
                        {getFieldDecorator('government_share',{
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('government_share_unit', { initialValue: '元'},
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
                        {'集团或总院 '}
                        {getFieldDecorator('group_share', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('group_share_unit', { initialValue: '元'},
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
                        {'投行 '}
                        {getFieldDecorator('investmentbank_share', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<InputNumber css={{width:"80px"}} min={0} />)}
                        {getFieldDecorator('investmentbank_share_unit', { initialValue: '元'},
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
                        {'研发技术 '}
                        {getFieldDecorator('tech_share', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('tech_share_unit', { initialValue: '元'},
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
                        {'个人现金 '}
                        {getFieldDecorator('personal_cash', {
                          rules: [
                            { required: false, message: '' }
                          ],
                        })(<Input css={{width:"80px"}} />)}
                        {getFieldDecorator('personal_cash_unit', { initialValue: '元'},
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
                  <Form.Item label="经营状态">
                    {getFieldDecorator('business_status', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="存续" key="存续">存续</Option>
                      <Option value="在业" key="在业">在业</Option>
                      <Option value="吊销" key="吊销">吊销</Option>
                      <Option value="注销" key="注销">注销</Option>
                      <Option value="停业" key="停业">停业</Option>
                      <Option value="清算" key="清算">清算</Option>
                      <Option value="迁入" key="迁入">迁入</Option>
                      <Option value="迁出" key="迁出">迁出</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业类型">
                    {getFieldDecorator('enterprise_type', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="国有企业" key="国有企业">国有企业</Option>
                      <Option value="集体企业" key="集体企业">集体企业</Option>
                      <Option value="股份合作企业" key="股份合作企业">股份合作企业</Option>
                      <Option value="联营企业" key="联营企业">联营企业</Option>
                      <Option value="有限责任公司" key="有限责任公司">有限责任公司</Option>
                      <Option value="股份有限公司" key="股份有限公司">股份有限公司</Option>
                      <Option value="私营企业" key="私营企业">私营企业</Option>
                      <Option value="合资经营企业" key="合资经营企业">合资经营企业</Option>
                      <Option value="合作经营企业（港澳台资）" key="合作经营企业（港澳台资">合作经营企业（港澳台资）</Option>
                      <Option value="港、澳、 台商独资经营企业" key="港、澳、 台商独资经营企业">港、澳、 台商独资经营企业</Option>
                      <Option value="港、澳、 台商投资股份有限公司" key="港、澳、 台商投资股份有限公司">港、澳、 台商投资股份有限公司</Option>
                      <Option value="中外合资经营企业" key="中外合资经营企业">中外合资经营企业</Option>
                      <Option value="中外合作经营企业" key="中外合作经营企业">中外合作经营企业</Option>
                      <Option value="外资企业" key="外资企业">外资企业</Option>
                      <Option value="外商投资股份有限公司" key="外商投资股份有限公司">外商投资股份有限公司</Option>
                      <Option value="其他企业" key="其他企业">其他企业</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国际体系认证/行业资质认证">
                    {getFieldDecorator('international_certification', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="营业收入">
                    {getFieldDecorator('income', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 万元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="所属集团公司">
                    {getFieldDecorator('affiliated', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总部所在省（国内）">
                    {getFieldDecorator('headquarters', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      style={{ width: "100%" }}
                      showSearch

                    >
                    {
                      this.state.province && this.state.province.length>0?
                      this.state.province.map(item=>{
                        return <Option value={item} key={item}>{item}</Option>
                      })
                      :
                      ''
                    }
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总部所在城市">
                    {getFieldDecorator('affiliated_city', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总部所在省份（海外）">
                    {getFieldDecorator('outer_headquarter', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总部承担功能">
                    {getFieldDecorator('headquarter_func', {
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="是否为高新技术企业">
                    {getFieldDecorator('high_technology', {
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
                  <Form.Item label="是否为上市企业">
                    {getFieldDecorator('listed_company', {
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
                  <Form.Item label="上市">
                    {getFieldDecorator('mark_type', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="主板" key="主板">主板</Option>
                      <Option value="中小板" key="中小板">中小板</Option>
                      <Option value="科创板" key="科创板">科创板</Option>
                      <Option value="新三板" key="新三板">新三板</Option>
                      <Option value="地方柜台交易（OTC）" key="地方柜台交易（OTC）">地方柜台交易（OTC）</Option>
                      <Option value="产权交易所" key="产权交易所">产权交易所</Option>
                    </Select>)}
                  </Form.Item>
                </Col>


              {
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="是否有军工方面的合作">
                //     {getFieldDecorator('military_cooperation', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select style={{ width: "100%" }}>
                //       <Option value="是" key="是">是</Option>
                //       <Option value="否" key="否">否</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="军工方面的合作对象备注">
                //     {getFieldDecorator('remarks_military', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="是否有合作院校">
                //     {getFieldDecorator('cooperative_institutions', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select style={{ width: "100%" }}>
                //       <Option value="是" key="是">是</Option>
                //       <Option value="否" key="否">否</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作院校全称（*学校*学院）">
                //     {getFieldDecorator('school_name', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="合作院校备注（合作内容）">
                //     {getFieldDecorator('academic_remarks', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="是否有科研机构合作">
                //     {getFieldDecorator('is_scientific_cooperation', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select style={{ width: "100%" }}>
                //       <Option value="是" key="是">是</Option>
                //       <Option value="否" key="否">否</Option>
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="合作科研机构全称">
                //     {getFieldDecorator('scientific_name', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="合作科研机构备注（合作内容）">
                //     {getFieldDecorator('scientific_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="其他合作备注">
                //     {getFieldDecorator('notesother_cooperation', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
              }
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="2018年研发费用支出">
                    {getFieldDecorator('research_expenditure', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 万元'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="研发成本占总成本比重">
                    {getFieldDecorator('research_proportion', {
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

            {
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="对外投资">
                //     {getFieldDecorator('outbound_investment', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<InputNumber css={{width:"90%"}} min={0} />)}
                //   {' 个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="对外投资1所在地">
                //     {getFieldDecorator('sheng1', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="对外投资1所在地备注">
                //     {getFieldDecorator('invest1_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="对外投资1承担功能">
                //     {getFieldDecorator('invest1_func', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Select
                //       mode="multiple"
                //       style={{ width: '100%' }}
                //       maxTagCount={2}
                //       maxTagPlaceholder="...等"
                //     >
                //       <Option value="生产" key="生产">生产</Option>
                //       <Option value="研发" key="研发">研发</Option>
                //       <Option value="服务" key="服务">服务</Option>
                //       <Option value="市场" key="市场">市场</Option>
                //
                //     </Select>)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="对外投资2所在地">
                //     {getFieldDecorator('sheng2', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="对外投资2所在地备注">
                //     {getFieldDecorator('invest2_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="对外投资3所在地">
                //     {getFieldDecorator('sheng3', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"90%"}} />)}
                //   {' 省'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="对外投资3所在地备注">
                //     {getFieldDecorator('invest3_note', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="其他对外投资所在省">
                //     {getFieldDecorator('other_locations', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={24} lg={24}>
                //   <Form.Item label="在哈尔滨对外投资公司">
                //     <Row gutter={16}>
                //       <Col sm={24} md={8} lg={8}>
                //           {'公司全称 '}
                //           {getFieldDecorator('ha_company_name', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8}>
                //           {'联系人 '}
                //           {getFieldDecorator('ha_contact_person', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //       <Col sm={24} md={8} lg={8}>
                //           {'联系方式 '}
                //           {getFieldDecorator('ha_phonenumber', {
                //             rules: [
                //               { required: false, message: '' }
                //           ],
                //         })(<Input  />)}
                //       </Col>
                //     </Row>
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
                //           {"分支机构承担功能"}
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
                //           {"分支机构承担功能"}
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
                //   <Form.Item label="分支机构">
                //     {getFieldDecorator('branch', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<InputNumber css={{width:"90%"}} min={0} />)}
                //   {' 个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构">
                //     {getFieldDecorator('domestic_branch', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<InputNumber css={{width:"90%"}} min={0} />)}
                //   {' 个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国内分支机构1所在地">
                //     {getFieldDecorator('domestic_sheng1', {
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
                //     {getFieldDecorator('domestic_sheng2', {
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
                //     {getFieldDecorator('domestic_sheng3', {
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
                //     {getFieldDecorator('domestic_sheng4', {
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
                //     {getFieldDecorator('domestic_sheng5', {
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
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国外分支机构">
                //     {getFieldDecorator('abroad', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<InputNumber css={{width:"90%"}} min={0} />)}
                //   {' 个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国外分支机构1所在地">
                //     {getFieldDecorator('abroad_guo1', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"20%"}} />)}
                //   {' 国家'}
                //   {getFieldDecorator('abroad_shi1', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                // })(<Input  style={{width:"20%"}} />)}
                //   {' 城市,共'}
                //   {getFieldDecorator('abroad_count1', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                // })(<InputNumber css={{width:"20%"}} min={0} />)}
                // {'个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8}>
                //   <Form.Item label="国外分支机构2所在地">
                //     {getFieldDecorator('abroad_guo2', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<Input  style={{width:"20%"}} />)}
                //   {' 国家'}
                //   {getFieldDecorator('abroad_shi2', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                // })(<Input  style={{width:"20%"}} />)}
                //   {' 城市,共'}
                //   {getFieldDecorator('abroad_count2', {
                //     rules: [
                //       { required: false, message: '' }
                //   ],
                // })(<InputNumber css={{width:"20%"}} min={0} />)}
                // {'个'}
                //   </Form.Item>
                // </Col>
                // <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                //   <Form.Item label="其他分支机构所在地">
                //     {getFieldDecorator('other_location_branches', {
                //       rules: [
                //         { required: false, message: '' }
                //     ],
                //   })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                //   </Form.Item>
                // </Col>

            }

                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="员工数量">
                    {getFieldDecorator('staff_number', {
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
                    {getFieldDecorator('post_academician', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士后">
                    {getFieldDecorator('post_doctoral', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士">
                    {getFieldDecorator('doctor', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="硕士">
                    {getFieldDecorator('master', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="本科">
                    {getFieldDecorator('undergraduate', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="技工">
                    {getFieldDecorator('techpeople_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="研发人员">
                    {getFieldDecorator('researchpeople_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="管理人员">
                    {getFieldDecorator('managepeople_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 人'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="技工工资">
                    {getFieldDecorator('techpeople_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="本科生工资">
                    {getFieldDecorator('undergraduate_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="研究生工资">
                    {getFieldDecorator('graduatestudent_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="博士生工资">
                    {getFieldDecorator('doctor_sale', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 元/月'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业总成本">
                    {getFieldDecorator('totalenterprise_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"80%"}} min={0} />)}
                  {' 万元'}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="企业各项费用占企业总成本的比重" key="2">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="用工成本">
                    {getFieldDecorator('employment_cost',{
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('employment_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="原材料成本">
                    {getFieldDecorator('source_material_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('source_material_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="设备">
                    {getFieldDecorator('device_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('device_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="管理成本">
                    {getFieldDecorator('administration_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('administration_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>

                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="场地租金">
                    {getFieldDecorator('site_rent', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('site_rent_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="其他固定开支">
                    {getFieldDecorator('otherfixed_expenses', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('otherfixed_expenses_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="增值税">
                    {getFieldDecorator('value_addedtax', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('value_addedtax_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业所得税">
                    {getFieldDecorator('corporate_incometax', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('corporate_incometax_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="个人所得税">
                    {getFieldDecorator('individual_incometax', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('individual_incometax_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="财产税及行为税">
                    {getFieldDecorator('property_behaviotax', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('property_behaviotax_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="利息成本">
                    {getFieldDecorator('interest_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('interest_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="库存成本">
                    {getFieldDecorator('inventory_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('inventory_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="违约罚款">
                    {getFieldDecorator('penalty_contract', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('penalty_contract_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="罚款罚金">
                    {getFieldDecorator('fines_fines', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('fines_fines_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="其他">
                    {getFieldDecorator('other_cost', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input style={{width:"80%"}}/>)}
                  {getFieldDecorator('other_cost_unit',
                  {initialValue:"元"},
                  {
                    rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "20%" }}>
                        <Option value="%" key="%">%</Option>
                        <Option value="元" key="元">元</Option>
                      </Select>
                      )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="物业相关" key="3">
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="停车位个数">
                    {getFieldDecorator('park_position', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
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
              </Row>
            </Panel>
            <Panel header="产业相关" key="3.1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="企业主营业务">
                    {getFieldDecorator('main_business', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="企业其他业务">
                    {getFieldDecorator('other_business', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="所属一级细分产业">
                    {getFieldDecorator('subdividing_industries', {
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
                      <Option value="相关服务业" key="相关服务业">相关服务业</Option>
                      <Option value="科技创新" key="科技创新">科技创新</Option>
                      <Option value="各类联盟及组织" key="各类联盟及组织">各类联盟及组织</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="所属二级细分产业">
                    {getFieldDecorator('secondary_subdivision', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="所属三级细分产业">
                    {getFieldDecorator('three_subdivision', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="所属四级细分产业">
                    {getFieldDecorator('four_subdivision', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="所属五级细分产业">
                    {getFieldDecorator('five_subdivision', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="企业产品">
                    {getFieldDecorator('chanpin', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="所属一级产业环节">
                    {getFieldDecorator('primary_industry', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="设计" key="设计">设计</Option>
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="交易" key="交易">交易</Option>
                      <Option value="流通" key="流通">流通</Option>
                      <Option value="生产性服务" key="生产性服务">生产性服务</Option>
                      <Option value="科技服务（包括金融）" key="科技服务（包括金融）">科技服务（包括金融）</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="所属二级产业环节">
                    {getFieldDecorator('secondary_industry', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="产业基金" key="3.1.1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="产业投资方式">
                    {getFieldDecorator('investment_mode', {
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
              </Row>
            </Panel>
            <Panel header="发展相关" key="3.2">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业自身定位">
                    {getFieldDecorator('self_orientation', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="一类企业：本地主导战略新兴产业等上下游科技型企业" key="一类企业：本地主导战略新兴产业等上下游科技型企业">一类企业：本地主导战略新兴产业等上下游科技型企业</Option>
                      <Option value="二类企业：本地先进制造业等高新技术企业及高端服务业和其他新兴产业企业" key="二类企业：本地先进制造业等高新技术企业及高端服务业和其他新兴产业企业">二类企业：本地先进制造业等高新技术企业及高端服务业和其他新兴产业企业</Option>
                      <Option value="三类企业：项目城市发展、产业升级带来的企业" key="三类企业：项目城市发展、产业升级带来的企业">三类企业：项目城市发展、产业升级带来的企业</Option>
                      <Option value="三类企业：项目周边城市外溢企业" key="三类企业：项目周边城市外溢企业">三类企业：项目周边城市外溢企业</Option>
                      <Option value="三类企业：外地企业驻项目城市分公司" key="三类企业：外地企业驻项目城市分公司">三类企业：外地企业驻项目城市分公司</Option>
                      <Option value="四类企业：本地或外地纯投资客" key="四类企业：本地或外地纯投资客">四类企业：本地或外地纯投资客</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业发展驱动力类型">
                    {getFieldDecorator('driving_force', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="市场驱动" key="市场驱动">市场驱动</Option>
                      <Option value="成本驱动" key="成本驱动">成本驱动</Option>
                      <Option value="人才驱动" key="人才驱动">人才驱动</Option>
                      <Option value="资金及金融驱动" key="资金及金融驱动">资金及金融驱动</Option>
                      <Option value="营商环境驱动" key="营商环境驱动">营商环境驱动</Option>
                      <Option value="上下游企业配套" key="上下游企业配套">上下游企业配套</Option>
                      <Option value="其他" key="其他">其他</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业发展基本需求">
                    {getFieldDecorator('basic_needs', {
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业对于功能硬件配套的需求">
                    {getFieldDecorator('func_hardware', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="技术配套（公共研发中心、孵化中心、检测认证中心）" key="技术配套（公共研发中心、孵化中心、检测认证中心）">技术配套（公共研发中心、孵化中心、检测认证中心）</Option>
                      <Option value="商务配套（展示交易中心、教育培训中心、商务会议中心）" key="商务配套（展示交易中心、教育培训中心、商务会议中心）">商务配套（展示交易中心、教育培训中心、商务会议中心）</Option>
                      <Option value="生活配套（居住、公寓、商业等）" key="生活配套（居住、公寓、商业等）">生活配套（居住、公寓、商业等）</Option>
                      <Option value="精装修（拎包入驻）" key="精装修（拎包入驻）">精装修（拎包入驻）</Option>
                      <Option value="物流及仓储空间" key="物流及仓储空间">物流及仓储空间</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="企业对于功能硬件配套的需求情况说明">
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
                      mode="multiple"
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
                      mode="multiple"
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
                  <Form.Item label="企业降低内部综合管理成本的需求">
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
                  <Form.Item label="企业降低内部综合管理成本的需求情况说明">
                    {getFieldDecorator('reduce_cost_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业对于生产性服务的需求">
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
                  <Form.Item label="企业对于生产性服务的需求情况说明">
                    {getFieldDecorator('product_service_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="基本需求情况说明">
                    {getFieldDecorator('statement_basicneeds', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业对于金融的需求">
                    {getFieldDecorator('financialfunds', {
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
                    {getFieldDecorator('financialfunds_needs', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业对于非金融资金的需求">
                    {getFieldDecorator('non_financial_require', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="物业入股" key="物业入股">物业入股</Option>
                      <Option value="政府专项奖励政策资金" key="政府专项奖励政策资金">政府专项奖励政策资金</Option>
                      <Option value="集群企业联保服务" key="集群企业联保服务">集群企业联保服务</Option>
                      <Option value="科创板奖励政策" key="科创板奖励政策">科创板奖励政策</Option>
                      <Option value="租金补贴" key="租金补贴">租金补贴</Option>
                      <Option value="电费、网费等减免或补贴" key="电费、网费等减免或补贴">电费、网费等减免或补贴</Option>
                      <Option value="其他费用补贴" key="其他费用补贴">其他费用补贴</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="非金融资金需求情况说明">
                    {getFieldDecorator('non_financial_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业对于人才的需求">
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
                  <Form.Item label="企业对于税收方面的需求">
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
                  <Form.Item label="企业对于科技创新服务的需求">
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
                    {getFieldDecorator('marketing', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
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
                    {getFieldDecorator('marketing_needs', {
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
                  <Form.Item label="上游（企业企业采购端）产业环节">
                    {getFieldDecorator('upstream_industryLink', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="原材料" key="原材料">原材料</Option>
                      <Option value="生产设备" key="生产设备">生产设备</Option>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="设计" key="设计">设计</Option>
                      <Option value="服务" key="服务">服务</Option>
                      <Option value="流通" key="流通">流通</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="上游（企业企业采购端）产业环节产品名称">
                    {getFieldDecorator('upstream_product_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游（企业采购端）的主体属性">
                    {getFieldDecorator('upstream_bodyattr', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="政府" key="政府">政府</Option>
                      <Option value="国企" key="国企">国企</Option>
                      <Option value="事业单位" key="事业单位">事业单位</Option>
                      <Option value="外企" key="外企">外企</Option>
                      <Option value="国内民企" key="国内民企">国内民企</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游（企业采购端）国内区域">
                    {getFieldDecorator('upstream_inner_province', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'省 '}
                    {getFieldDecorator('upstream_inner_market', {
                        rules: [
                          { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游（企业采购端）国内企业名单">
                    {getFieldDecorator('upstream_inner_company_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>

                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游（企业采购端）国外区域">

                    {getFieldDecorator('upstream_outer_province', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'国 '}
                    {getFieldDecorator('upstream_outer_market', {
                        rules: [
                          { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游（企业采购端）国外企业名单">
                    {getFieldDecorator('upstream_outer_company_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游（企业采购端）备注">
                    {getFieldDecorator('upstream_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）产业环节">
                    {getFieldDecorator('downstream_link', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="使用终端主体" key="使用终端主体">使用终端主体</Option>
                      <Option value="原材料" key="原材料">原材料</Option>
                      <Option value="生产设备" key="生产设备">生产设备</Option>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="设计" key="设计">设计</Option>
                      <Option value="服务" key="服务">服务</Option>
                      <Option value="流通" key="流通">流通</Option>
                      <Option value="其他" key="其他">其他</Option>

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）产业环节产品名称">
                    {getFieldDecorator('downstream_product_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）的主体属性">
                    {getFieldDecorator('downstream_bodyattr', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="政府" key="政府">政府</Option>
                      <Option value="国企" key="国企">国企</Option>
                      <Option value="事业单位" key="事业单位">事业单位</Option>
                      <Option value="外企" key="外企">外企</Option>
                      <Option value="国内民企" key="国内民企">国内民企</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）国内区域">
                    {getFieldDecorator('downstream_inner_province', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'省 '}
                    {getFieldDecorator('downstream_inner_market', {
                        rules: [
                          { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）国内企业名单">
                    {getFieldDecorator('downstream_inner_company_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）国外区域">
                    {getFieldDecorator('downstream_outer_province', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'国 '}
                    {getFieldDecorator('downstream_outer_market', {
                        rules: [
                          { required: false, message: '' }
                      ],
                    })(<Input css={{width:"40%"}} />)}
                    {'市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）国外企业名单">
                    {getFieldDecorator('downstream_outer_company_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游（企业客户端）备注">
                    {getFieldDecorator('downstream_note', {
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
                  <Form.Item label="管理机制/其他">
                    {getFieldDecorator('manage_other', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="是否迁移">
                    {getFieldDecorator('migration_ornot', {
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
                  <Form.Item label="迁移类型">
                    {getFieldDecorator('migration_type', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="市内迁移" key="市内迁移">市内迁移</Option>
                      <Option value="同省跨市迁移" key="同省跨市迁移">同省跨市迁移</Option>
                      <Option value="跨省迁移" key="跨省迁移">跨省迁移</Option>
                      <Option value="跨国迁移" key="跨国迁移">跨国迁移</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="企业迁移具体情况">
                    {getFieldDecorator('enterprise_sheng1', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input  style={{width:"10%"}} />)}
                    {' 省'}
                    {getFieldDecorator('enterprise_shi1', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input  style={{width:"10%"}} />)}
                    {' 市'}
                    {' 迁移至'}
                    {getFieldDecorator('enterprise_sheng2', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input  style={{width:"10%"}} />)}
                    {' 省'}
                    {getFieldDecorator('enterprise_shi2', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input  style={{width:"10%"}} />)}
                    {' 市 或'}
                    {getFieldDecorator('enterprise_guo', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input  style={{width:"10%"}} />)}
                    {' 国家'}
                    {getFieldDecorator('enterprise_shi3', {
                      rules: [
                        { required: false, message: '' }
                      ],
                    })(<Input  style={{width:"10%"}} />)}
                    {' 城市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="企业迁移原因">
                    {getFieldDecorator('move_reason', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="原材料驱动" key="原材料驱动">原材料驱动</Option>
                      <Option value="市场驱动" key="市场驱动">市场驱动</Option>
                      <Option value="成本驱动" key="成本驱动">成本驱动</Option>
                      <Option value="人才驱动" key="人才驱动">人才驱动</Option>
                      <Option value="资金及金融驱动" key="资金及金融驱动">资金及金融驱动</Option>
                      <Option value="营商环境驱动" key="营商环境驱动">营商环境驱动</Option>
                      <Option value="上下游企业配套" key="上下游企业配套">上下游企业配套</Option>
                      <Option value="形象驱动" key="形象驱动">形象驱动</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="迁移具体情况说明">
                    {getFieldDecorator('move_note', {
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
                  <Form.Item label="企业现代化管理诉求">
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="配套设施现状">
                    {getFieldDecorator('support_situation', {
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
            <Panel header="对外投资及分支机构" key="3.2.1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="分支机构">
                    {getFieldDecorator('branch', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
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
                    {getFieldDecorator('abroad', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="对外投资">
                    {getFieldDecorator('outbound_investment', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="深圳/哈尔滨分支机构名称">
                    {getFieldDecorator('shenha_branch_name', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="深圳/哈尔滨分公司产业环节">
                    {getFieldDecorator('shenha_branch_industry_sector', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="服务（营销、合理避税、采购等）" key="服务（营销、合理避税、采购等）">服务（营销、合理避税、采购等）</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="分公司设置原因">
                    {getFieldDecorator('shenha_branch_reason', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="原材料驱动" key="原材料驱动">原材料驱动</Option>
                      <Option value="市场驱动" key="市场驱动">市场驱动</Option>
                      <Option value="成本驱动" key="成本驱动">成本驱动</Option>
                      <Option value="人才驱动" key="人才驱动">人才驱动</Option>
                      <Option value="资金及金融驱动" key="资金及金融驱动">资金及金融驱动</Option>
                      <Option value="营商环境驱动" key="营商环境驱动">营商环境驱动</Option>
                      <Option value="上下游企业配套" key="上下游企业配套">上下游企业配套</Option>
                      <Option value="形象驱动" key="形象驱动">形象驱动</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="联系人">
                    {getFieldDecorator('shenha_branch_contacts', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input css={{width:"100%"}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="联系方式">
                    {getFieldDecorator('shenha_branch_contact_information', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input placeholder="手机号或座机号" css={{width:"100%"}} />)}
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
                              {'其他国外分支机构'}
                            </div>
                            <div css={{flex:"1 1 auto"}}>
                              {getFieldDecorator('other_outer_agency', {
                                rules: [
                                    { required: false, message: '' }
                                ],
                              })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                            </div>
                          </div>
                      </Col>
                      <Col sm={24} md={6} lg={6} css={{marginTop:"20px"}}>
                        <div>
                          {getFieldDecorator('other_outer_count', {
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
                  <AbroadInvestment
                    setAbroad_investment={(value)=>{this.setAbroad_investment(value)}}
                    data={_.cloneDeep(this.state.abroad_investment) || []}
                  />
                </Col>
                <Col>
                  <div style={{padding: "0 20px 0 20px"}}>
                    <Row gutter={16}>
                      <Col sm={24} md={18} lg={18} css={{height:"32px",marginTop:"20px"}}>
                          <div css={{display:"flex"}}>
                            <div css={{flex:"0 0 120px"}}>
                              {'其他对外投资'}
                            </div>
                            <div css={{flex:"1 1 auto"}}>
                              {getFieldDecorator('other_abroad_investment', {
                                rules: [
                                    { required: false, message: '' }
                                ],
                              })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                            </div>
                          </div>
                      </Col>
                      <Col sm={24} md={6} lg={6} css={{marginTop:"20px"}}>
                        <div>
                          {getFieldDecorator('other_abroad_count', {
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
            </Panel>
            <Panel header="合作对象" key="3.1.2">
              <Row gutter={16}>
                <Col>
                  <CooperField
                    setCooper_field={(value)=>{this.setCooper_field(value)}}
                    data={_.cloneDeep(this.state.cooper_field) || []}
                  />
                </Col>
                <Col>
                  <div style={{padding: "0 20px 0 20px"}}>
                    <Row gutter={16}>
                      <Col css={{height:"32px",marginTop:"20px"}}>
                          <div css={{display:"flex"}}>
                            <div css={{flex:"0 0 80px",lineHeight:"32px"}}>
                              {'其他备注'}
                            </div>
                            <div css={{flex:"1 1 auto"}}>
                              {getFieldDecorator('other_cooper_field_note', {
                                rules: [
                                    { required: false, message: '' }
                                ],
                              })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                            </div>
                          </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Panel>
            <Panel header="联系及地理" key="4">
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
                    {getFieldDecorator('contact_information', {
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
              </Row>
            </Panel>
            <Panel header="企业备注" key="5" style={{borderBottom:"none"}}>
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
