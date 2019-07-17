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
    isSubmiting: false
  }
  componentDidMount(){
    this._isMounted = true
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="成果形式">
                    {getFieldDecorator('achievements', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="学术论文" key="学术论文">学术论文</Option>
                      <Option value="学术著作" key="学术著作">学术著作</Option>
                      <Option value="专利" key="专利">专利</Option>
                      <Option value="专有知识" key="专有知识">专有知识</Option>
                      <Option value="具有新产品特征的产品原型或具有新装置特征原始样机" key="具有新产品特征的产品原型或具有新装置特征原始样机">具有新产品特征的产品原型或具有新装置特征原始样机</Option>
                      <Option value="小批量试制" key="小批量试制">小批量试制</Option>
                      <Option value="新产品研发" key="新产品研发">新产品研发</Option>
                      <Option value="新产品批量生产" key="新产品批量生产">新产品批量生产</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="典型产品/对应产品">
                    {getFieldDecorator('product', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="品牌项目">
                    {getFieldDecorator('brand', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="所需关键技术">
                    {getFieldDecorator('keyword', {
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
                  <Form.Item label="研究成果产业化时间">
                    {getFieldDecorator('industrialization', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="1-2年" key="1-2年">1-2年</Option>
                      <Option value="3-5年" key="3-5年">3-5年</Option>
                      <Option value="5-8年" key="5-8年">5-8年</Option>
                      <Option value="8年以上" key="8年以上">8年以上</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="研究成果产业化条件">
                    {getFieldDecorator('industrialization_condition', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="研究成果产业化困难">
                    {getFieldDecorator('industrialization_difficult', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="创新链环节">
                    {getFieldDecorator('innovation', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="基础研究（高等院校、大科学装置、国家实验室、省级实验室）" key="基础研究（高等院校、大科学装置、国家实验室、省级实验室）">基础研究（高等院校、大科学装置、国家实验室、省级实验室）</Option>
                      <Option value="应用研究" key="应用研究">应用研究</Option>
                      <Option value="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）" key="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）">成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）</Option>
                      <Option value="产业化" key="产业化">产业化</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="上游环节">
                    {getFieldDecorator('upstream', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="下游环节">
                    {getFieldDecorator('downstream', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="所属一级产业类别">
                    {getFieldDecorator('level1', {
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
                  <Form.Item label="所属二级产业类别">
                    {getFieldDecorator('level2', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="所属三级产业类别">
                    {getFieldDecorator('level3', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
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
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构">
                    {getFieldDecorator('branch_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构1所在地">
                    {getFieldDecorator('branch1_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"90%"}} />)}
                  {' 省'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国内分支机构1所在城市备注">
                    {getFieldDecorator('branch1_province_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构2所在地">
                    {getFieldDecorator('branch2_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"90%"}} />)}
                  {' 省'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国内分支机构2所在城市备注">
                    {getFieldDecorator('branch2_province_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构3所在地">
                    {getFieldDecorator('branch3_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"90%"}} />)}
                  {' 省'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国内分支机构3所在城市备注">
                    {getFieldDecorator('branch3_province_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构4所在地">
                    {getFieldDecorator('branch4_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"90%"}} />)}
                  {' 省'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国内分支机构4所在城市备注">
                    {getFieldDecorator('branch4_province_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内分支机构5所在地">
                    {getFieldDecorator('branch5_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"90%"}} />)}
                  {' 省'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国内分支机构5所在城市备注">
                    {getFieldDecorator('branch5_province_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="在哈尔滨分支机构公司">
                    <Row gutter={16}>
                      <Col sm={24} md={6} lg={6}>
                          {'公司全称 '}
                          {getFieldDecorator('ha_fen_company_name', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={6} lg={6}>
                          {'联系人 '}
                          {getFieldDecorator('ha_fen_contact_person', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={6} lg={6}>
                          {'联系方式 '}
                          {getFieldDecorator('ha_fen_phonenumber', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={6} lg={6}>
                          {"分支机构承担功能"}
                          {getFieldDecorator('ha_headquarter_func', {
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
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="在深圳分支机构公司">
                    <Row gutter={16}>
                      <Col sm={24} md={6} lg={6}>
                          {'公司全称 '}
                          {getFieldDecorator('shen_fen_company_name', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={6} lg={6}>
                          {'联系人 '}
                          {getFieldDecorator('shen_fen_contact_person', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={6} lg={6}>
                          {'联系方式 '}
                          {getFieldDecorator('shen_fen_phonenumber', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={6} lg={6}>
                          {"分支机构承担功能"}
                          {getFieldDecorator('shen_headquarter_func', {
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
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="其他分支机构1">
                    {getFieldDecorator('other1_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 省'}
                  {getFieldDecorator('other1_city', {
                    rules: [
                      { required: false, message: '' }
                  ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="其他分支机构2">
                    {getFieldDecorator('other2_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 省'}
                  {getFieldDecorator('other2_city', {
                    rules: [
                      { required: false, message: '' }
                  ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="其他分支机构3">
                    {getFieldDecorator('other3_province', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 省'}
                  {getFieldDecorator('other3_city', {
                    rules: [
                      { required: false, message: '' }
                  ],
                  })(<Input  style={{width:"40%"}} />)}
                  {' 市'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="总院/所/中心所在地">
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
                  <Form.Item label="合作对象">
                    {getFieldDecorator('object_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 个'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象1名称">
                    {getFieldDecorator('object_name1', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象1属性">
                    {getFieldDecorator('object_attr1', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                      <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                      <Option value="研究所" key="研究所">研究所</Option>
                      <Option value="研究中心" key="研究中心">研究中心</Option>
                      <Option value="孵化器" key="孵化器">孵化器</Option>
                      <Option value="企业" key="企业">企业</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="合作对象1合作内容">
                    {getFieldDecorator('object_content1', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象2名称">
                    {getFieldDecorator('object_name2', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象2属性">
                    {getFieldDecorator('object_attr2', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                      <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                      <Option value="研究所" key="研究所">研究所</Option>
                      <Option value="研究中心" key="研究中心">研究中心</Option>
                      <Option value="孵化器" key="孵化器">孵化器</Option>
                      <Option value="企业" key="企业">企业</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="合作对象2合作内容">
                    {getFieldDecorator('object_content2', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象3名称">
                    {getFieldDecorator('object_name3', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象3属性">
                    {getFieldDecorator('object_attr3', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                      <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                      <Option value="研究所" key="研究所">研究所</Option>
                      <Option value="研究中心" key="研究中心">研究中心</Option>
                      <Option value="孵化器" key="孵化器">孵化器</Option>
                      <Option value="企业" key="企业">企业</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="合作对象3合作内容">
                    {getFieldDecorator('object_content3', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象4名称">
                    {getFieldDecorator('object_name4', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Input  />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="合作对象4属性">
                    {getFieldDecorator('object_attr4', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                      <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                      <Option value="研究所" key="研究所">研究所</Option>
                      <Option value="研究中心" key="研究中心">研究中心</Option>
                      <Option value="孵化器" key="孵化器">孵化器</Option>
                      <Option value="企业" key="企业">企业</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="合作对象4合作内容">
                    {getFieldDecorator('object_content4', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="深圳合作/哈尔滨对象">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={8}>
                          {'全称 '}
                          {getFieldDecorator('shenha_company_name', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
                          {'联系人 '}
                          {getFieldDecorator('shenha_contact_person', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
                          {'联系电话 '}
                          {getFieldDecorator('shenha_phonenumber', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
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
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="其他合作对象">
                          {getFieldDecorator('other_cooperation_object', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业资源1">
                    {getFieldDecorator('resources1', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业资源2">
                    {getFieldDecorator('resources2', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业资源3">
                    {getFieldDecorator('resources3', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="产业资源/其他">
                    {getFieldDecorator('resources4', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国内交流">
                    {getFieldDecorator('isinnerexchange', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="是" key="是">是</Option>
                      <Option value="否" key="否">否</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国内交流（国内活动等）">
                    {getFieldDecorator('innerexchange', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="国际交流">
                    {getFieldDecorator('isexchange', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select style={{ width: "100%" }}>
                      <Option value="是" key="是">是</Option>
                      <Option value="否" key="否">否</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="国际交流（国际活动等）">
                    {getFieldDecorator('exchange', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={24} lg={24}>
                  <Form.Item label="哈尔滨/深圳合作">
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={8}>
                          {'合作1 '}
                          {getFieldDecorator('hashen1_cooperation', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
                          {'联系人 '}
                          {getFieldDecorator('hashen1_contact_person', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
                          {'联系方式 '}
                          {getFieldDecorator('hashen1_phonenumber', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="合作原因">
                          {getFieldDecorator('hashen1_reason', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="合作内容">
                          {getFieldDecorator('hashen1_content', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="哈深合作1备注">
                          {getFieldDecorator('hashen1_note', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col sm={24} md={8} lg={8}>
                          {'合作2 '}
                          {getFieldDecorator('hashen2_cooperation', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
                          {'联系人 '}
                          {getFieldDecorator('hashen2_contact_person', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={8} lg={8}>
                          {'联系方式 '}
                          {getFieldDecorator('hashen2_phonenumber', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<Input  />)}
                      </Col>
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="合作原因">
                          {getFieldDecorator('hashen2_reason', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="合作内容">
                          {getFieldDecorator('hashen2_content', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                        <Form.Item label="哈深合作2备注">
                          {getFieldDecorator('hashen2_note', {
                            rules: [
                              { required: false, message: '' }
                          ],
                        })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="物业相关" key="3.1">
              <Row gutter={16}>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="非独立占地的物业层数">
                    {getFieldDecorator('property_floor', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 层'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="非独立占地的物业面积">
                    {getFieldDecorator('property_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="非独立占地物业功能">
                    {getFieldDecorator('property_function', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="办公" key="办公">办公</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="独立占地土地性质">
                    {getFieldDecorator('nature_land', {
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
                  <Form.Item label="独立占地的面积">
                    {getFieldDecorator('independent_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="独立占地的建筑面积">
                    {getFieldDecorator('architecture_area', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' m²'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="独立占地的建筑高度">
                    {getFieldDecorator('architecture_number', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 层'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="独立占地的建筑数量">
                    {getFieldDecorator('architecture_count', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<InputNumber css={{width:"90%"}} min={0} />)}
                  {' 栋'}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="独立占地的物业功能">
                    {getFieldDecorator('independent_function', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="研发" key="研发">研发</Option>
                      <Option value="生产" key="生产">生产</Option>
                      <Option value="办公" key="办公">办公</Option>
                    </Select>)}
                  </Form.Item>
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
                  <Form.Item label="企业发展基本需求">
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
                      <Option value="环评" key="环评">环评</Option>
                      <Option value="能评" key="能评">能评</Option>
                      <Option value="消防等政府对接及代办业务" key="消防等政府对接及代办业务">消防等政府对接及代办业务</Option>
                      <Option value="专业企管公司" key="专业企管公司">专业企管公司</Option>
                      <Option value="专业财务公司" key="专业财务公司">专业财务公司</Option>
                      <Option value="孵化器服务" key="孵化器服务">孵化器服务</Option>
                      <Option value="律所" key="律所">律所</Option>
                      <Option value="品牌策划公司" key="品牌策划公司">品牌策划公司</Option>
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
                  <Form.Item label="功能硬件配套的需求">
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
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="功能硬件配套的需求情况说明">
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
                  <Form.Item label="生产性服务的需求">
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

                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="生产性服务的需求情况说明">
                    {getFieldDecorator('product_service_require_note', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="金融的需求">
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
                  <Form.Item label="非金融的需求">
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
                  <Form.Item label="人才的需求">
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
                  <Form.Item label="税收方面的需求">
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
                  <Form.Item label="科技创新服务的需求">
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
                  <Form.Item label="发展诉求之基础设施">
                    {getFieldDecorator('infrastructure', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
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
                  <Form.Item label="发展诉求之基础设施/情况说明">
                    {getFieldDecorator('Infrastructure_needs', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之人才">
                    {getFieldDecorator('development_personnel', {
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
                  <Form.Item label="发展诉求之人才/情况说明">
                    {getFieldDecorator('personnel_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之配套">
                    {getFieldDecorator('appeal_matching', {
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
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之配套/情况说明">
                    {getFieldDecorator('appeal_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之税收">
                    {getFieldDecorator('revenue', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="税收分成" key="税收分成">税收分成</Option>
                      <Option value="税收减免" key="税收减免">税收减免</Option>
                      <Option value="财政扶持" key="财政扶持">财政扶持</Option>
                      <Option value="团队建设" key="团队建设">团队建设</Option>
                      <Option value="租金补贴" key="租金补贴">租金补贴</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之税收/情况说明">
                    {getFieldDecorator('revenue_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之生产性服务">
                    {getFieldDecorator('production', {
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
                      <Option value="知识产权及相关法律服务" key="知识产权及相关法律服务">知识产权及相关法律服务</Option>
                      <Option value="检验检测认证标准计量服务" key="检验检测认证标准计量服务">检验检测认证标准计量服务</Option>
                      <Option value="货物运输" key="货物运输">货物运输</Option>
                      <Option value="仓储和邮政快递服务" key="仓储和邮政快递服务">仓储和邮政快递服务</Option>
                      <Option value="人力资源及培训服务" key="人力资源及培训服务">人力资源及培训服务</Option>
                      <Option value="商务服务" key="商务服务">商务服务</Option>
                      <Option value="科技金融服务" key="科技金融服务">科技金融服务</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之生产性服务/情况说明">
                    {getFieldDecorator('production_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之生产研发">
                    {getFieldDecorator('research_development', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="线上调研" key="线上调研">线上调研</Option>
                      <Option value="需求信息分析与展示" key="需求信息分析与展示">需求信息分析与展示</Option>
                      <Option value="研发设计平台" key="研发设计平台">研发设计平台</Option>
                      <Option value="质量标准信息检索" key="质量标准信息检索">质量标准信息检索</Option>
                      <Option value="在线质量检测与质量管理" key="在线质量检测与质量管理">在线质量检测与质量管理</Option>
                      <Option value="产学研合作信息共享" key="产学研合作信息共享">产学研合作信息共享</Option>
                      <Option value="技术交流平台" key="技术交流平台">技术交流平台</Option>
                      <Option value="线上技术支持" key="线上技术支持">线上技术支持</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之生产研发/情况说明">
                    {getFieldDecorator('development_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之科技服务">
                    {getFieldDecorator('technology_services', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="检测检验" key="检测检验">检测检验</Option>
                      <Option value="工业设计" key="工业设计">工业设计</Option>
                      <Option value="知识产权中介" key="知识产权中介">知识产权中介</Option>
                      <Option value="认证认可机构" key="认证认可机构">认证认可机构</Option>
                      <Option value="技术评估交易" key="技术评估交易">技术评估交易</Option>
                      <Option value="科技体验与展示" key="科技体验与展示">科技体验与展示</Option>
                      <Option value="路演中心" key="路演中心">路演中心</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之科技服务/情况说明">
                    {getFieldDecorator('technology_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之创新需求">
                    {getFieldDecorator('innovation_needs', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="科研人员的技术攻关" key="科研人员的技术攻关">科研人员的技术攻关</Option>
                      <Option value="产学研初期对接" key="产学研初期对接">产学研初期对接</Option>
                      <Option value="产业链资源优化整合服务" key="产业链资源优化整合服务">产业链资源优化整合服务</Option>
                      <Option value="产品设计" key="产品设计">产品设计</Option>
                      <Option value="工业设计" key="工业设计">工业设计</Option>
                      <Option value="知识产权保护服务" key="知识产权保护服务">知识产权保护服务</Option>
                      <Option value="高校需求" key="高校需求">高校需求</Option>
                      <Option value="实验室需求" key="实验室需求">实验室需求</Option>
                      <Option value="科技成果转化" key="科技成果转化">科技成果转化</Option>
                      <Option value="其他" key="其他">其他</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之创新需求/情况说明">
                    {getFieldDecorator('innovation_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之信息需求">
                    {getFieldDecorator('message_needs', {
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
                  <Form.Item label="发展诉求之信息需求/情况说明">
                    {getFieldDecorator('message_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <Form.Item label="发展诉求之外部对接">
                    {getFieldDecorator('external_docking', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      maxTagCount={2}
                      maxTagPlaceholder="...等"
                    >
                      <Option value="一站式行政代办服务平台" key="一站式行政代办服务平台">一站式行政代办服务平台</Option>
                      <Option value="认证信息服务" key="认证信息服务">认证信息服务</Option>
                      <Option value="在线申报" key="在线申报">在线申报</Option>
                      <Option value="政策信息查询与在线咨询平台" key="政策信息查询与在线咨询平台">政策信息查询与在线咨询平台</Option>
                      <Option value="知识产权信息查询" key="知识产权信息查询">知识产权信息查询</Option>
                      <Option value="线上知识产权培训" key="线上知识产权培训">线上知识产权培训</Option>
                      <Option value="公共关系管理平台" key="公共关系管理平台">公共关系管理平台</Option>
                      <Option value="合作伙伴信息管理平台" key="合作伙伴信息管理平台">合作伙伴信息管理平台</Option>
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之外部对接/情况说明">
                    {getFieldDecorator('external_info', {
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
                  <Form.Item label="发展诉求之其他">
                    {getFieldDecorator('other_bindexternal', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="发展诉求之其他/情况说明">
                    {getFieldDecorator('other_info', {
                      rules: [
                        { required: false, message: '' }
                    ],
                  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={8} css={{height:"93px"}}>
                  <Form.Item label="管理机制/组织架构">
                    {getFieldDecorator('management_mechanism', {
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
