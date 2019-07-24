/** @jsx jsx */
import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Icon, Select, InputNumber } from 'antd'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

const { Option } = Select
const { TextArea } = Input
const c0 = {display:"flex"}
const c1 = {
  flex:"0 0 130px",lineHeight:"32px"
}
const c2 = {flex:"1 1 auto"}
class AchievementField extends Component{
  state = {
    achievement_field:[
        {
          achievement_name:"",
          achievement_model:[],
          achievement_product:"",
          achievement_brand:"",
          achievement_keytech:"",
          achievement_first_level:[],
          achievement_second_level:[],
          achievement_third_level:[],
          achievement_focus_link:[],
          achievement_industry_condition:[],
          achievement_condition_note:"",
          achievement_industry_diffcult:[],
          achievement_condition_note:"",
          achievement_industry_time:[],
          achievement_industry_note:"",
          achievement_upstream_link:[],
          achievement_downstream_link:[],
          achievement_market_advice:""
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      achievement_name:"",
      achievement_model:[],
      achievement_product:"",
      achievement_brand:"",
      achievement_keytech:"",
      achievement_first_level:[],
      achievement_second_level:[],
      achievement_third_level:[],
      achievement_focus_link:[],
      achievement_industry_condition:[],
      achievement_condition_note:"",
      achievement_industry_diffcult:[],
      achievement_diffcult_note:"",
      achievement_industry_time:[],
      achievement_industry_note:"",
      achievement_upstream_link:[],
      achievement_downstream_link:[],
      achievement_market_advice:""
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      achievement_field: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        achievement_field: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.achievement_field)
      cur.push({
        achievement_name:"",
        achievement_model:[],
        achievement_product:"",
        achievement_brand:"",
        achievement_keytech:"",
        achievement_first_level:[],
        achievement_second_level:[],
        achievement_third_level:[],
        achievement_focus_link:[],
        achievement_industry_condition:[],
        achievement_condition_note:"",
        achievement_industry_diffcult:[],
        achievement_condition_note:"",
        achievement_industry_time:[],
        achievement_industry_note:"",
        achievement_upstream_link:[],
        achievement_downstream_link:[],
        achievement_market_advice:""
      })
      this.setState({
        achievement_field: _.cloneDeep(cur)
      },()=>{
        this.props.setAchievement_field(this.state.achievement_field)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.achievement_field)
      cur.splice(index,1)
      this.setState({
        achievement_field: _.cloneDeep(cur)
      },()=>{
        this.props.setAchievement_field(this.state.achievement_field)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.achievement_field)
      cur[index][field] = value
      this.setState({
        achievement_field: _.cloneDeep(cur)
      },()=>{
        this.props.setAchievement_field(this.state.achievement_field)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const AchievementField = _.cloneDeep(this.state.achievement_field)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16}>
        {
          //<Col style={{fontWeight:"bold"}} ></Col>
        }
          {
            AchievementField && AchievementField.length>0?
            AchievementField.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px",lineHeight:"32px"}}>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0",height:"32px"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>成果名称</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.achievement_field[index]['achievement_name']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_name')}}
                            style={{width:"100%"}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>成果形式</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_model']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_model')}}
                          >
                            <Option title="学术论文、学术著作" value="学术论文、学术著作" key="学术论文、学术著作">学术论文、学术著作</Option>
                            <Option title="专利、专有知识、具有新产品特征的产品原型或具有新装置特征原始样机" value="专利、专有知识、具有新产品特征的产品原型或具有新装置特征原始样机" key="专利、专有知识、具有新产品特征的产品原型或具有新装置特征原始样机">专利、专有知识、具有新产品特征的产品原型或具有新装置特征原始样机</Option>
                            <Option title="小批量试制" value="小批量试制" key="小批量试制">小批量试制</Option>
                            <Option title="新产品研发" value="新产品研发" key="新产品研发">新产品研发</Option>
                            <Option title="新产品批量生产" value="新产品批量生产" key="新产品批量生产">新产品批量生产</Option>
                            <Option title="科学成果转化" value="科学成果转化" key="科学成果转化">科学成果转化</Option>
                            <Option title="孵化中小企业" value="孵化中小企业" key="孵化中小企业">孵化中小企业</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>对应产品</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.achievement_field[index]['achievement_product']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_product')}}
                            style={{width:"100%"}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>品牌项目</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.achievement_field[index]['achievement_brand']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_brand')}}
                            style={{width:"100%"}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0",height:"32px"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>所需关键技术</div>
                        <div style={{...c2}}>
                          <TextArea
                            value={this.state.achievement_field[index]['achievement_keytech']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_keytech')}}
                            style={{width:"100%"}}
                            autosize={{minRows:1, maxRows:2}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>所属一级产业类别</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_first_level']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_first_level')}}
                          >
                            <Option title="新一代信息技术" value="新一代信息技术" key="新一代信息技术">新一代信息技术</Option>
                            <Option title="高端装备制造产业" value="高端装备制造产业" key="高端装备制造产业">高端装备制造产业</Option>
                            <Option title="新材料产业" value="新材料产业" key="新材料产业">新材料产业</Option>
                            <Option title="生物产业" value="生物产业" key="生物产业">生物产业</Option>
                            <Option title="新能源汽车产业" value="新能源汽车产业" key="新能源汽车产业">新能源汽车产业</Option>
                            <Option title="新能源产业" value="新能源产业" key="新能源产业">新能源产业</Option>
                            <Option title="节能环保产业" value="节能环保产业" key="节能环保产业">节能环保产业</Option>
                            <Option title="数字创意产业" value="数字创意产业" key="数字创意产业">数字创意产业</Option>
                            <Option title="相关服务业" value="相关服务业" key="相关服务业">相关服务业</Option>
                            <Option title="科技创新" value="科技创新" key="科技创新">科技创新</Option>
                            <Option title="各类联盟及组织" value="各类联盟及组织" key="各类联盟及组织">各类联盟及组织</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>所属二级产业类别</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.achievement_field[index]['achievement_second_level']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_second_level')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>所属三级产业类别</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.achievement_field[index]['achievement_third_level']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_third_level')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>聚焦产业环节</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_focus_link']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_focus_link')}}
                          >
                            <Option title="设计" value="设计" key="设计">设计</Option>
                            <Option title="研发" value="研发" key="研发">研发</Option>
                            <Option title="生产" value="生产" key="生产">生产</Option>
                            <Option title="交易" value="交易" key="交易">交易</Option>
                            <Option title="流通" value="流通" key="流通">流通</Option>
                            <Option title="服务" value="服务" key="服务">服务</Option>
                            <Option title="融资" value="融资" key="融资">融资</Option>
                            <Option title="其他" value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>成果产业化条件</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_industry_condition']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_industry_condition')}}
                          >
                            <Option title="资金" value="资金" key="资金">资金</Option>
                            <Option title="市场" value="市场" key="市场">市场</Option>
                            <Option title="原材料及设备" value="原材料及设备" key="原材料及设备">原材料及设备产</Option>
                            <Option title="人才" value="人才" key="人才">人才</Option>
                            <Option title="观念" value="观念" key="观念">观念</Option>
                            <Option title="其他" value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0",height:"32px"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>产业化条件备注</div>
                        <div style={{...c2}}>
                          <TextArea
                            autosize={{minRows:1, maxRows:2}}
                            value={this.state.achievement_field[index]['achievement_condition_note']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_condition_note')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>产业化困境</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_industry_diffcult']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_industry_diffcult')}}
                          >
                            <Option title="科技创新存在技术资源配置过渡行政化" value="科技创新存在技术资源配置过渡行政化" key="科技创新存在技术资源配置过渡行政化">科技创新存在技术资源配置过渡行政化</Option>
                            <Option title="科技管理过于偏重具体项目的碎片化" value="科技管理过于偏重具体项目的碎片化" key="科技管理过于偏重具体项目的碎片化">科技管理过于偏重具体项目的碎片化</Option>
                            <Option title="科技服务提供主体单一" value="科技服务提供主体单一" key="科技服务提供主体单一">科技服务提供主体单一</Option>
                            <Option title="科技市场化的资本金融缺失" value="科技市场化的资本金融缺失" key="科技市场化的资本金融缺失">科技市场化的资本金融缺失</Option>
                            <Option title="科研成果产品技术太先进及没有市场" value="科研成果产品技术太先进及没有市场" key="科研成果产品技术太先进及没有市场">科研成果产品技术太先进及没有市场</Option>
                            <Option title="国内没有生产工艺和设备" value="国内没有生产工艺和设备" key="国内没有生产工艺和设备">国内没有生产工艺和设备</Option>
                            <Option title="金融及投行很少有人愿意投中试的项目" value="金融及投行很少有人愿意投中试的项目" key="金融及投行很少有人愿意投中试的项目">金融及投行很少有人愿意投中试的项目</Option>
                            <Option title="审批政策繁琐" value="审批政策繁琐" key="审批政策繁琐">审批政策繁琐</Option>
                            <Option title="缺乏人才支持" value="缺乏人才支持" key="缺乏人才支持">缺乏人才支持</Option>
                            <Option title="观念意识问题" value="观念意识问题" key="观念意识问题">观念意识问题</Option>
                            <Option title="其他" value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0",height:"32px"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>产业化困境备注</div>
                        <div style={{...c2}}>
                          <TextArea
                            autosize={{minRows:1, maxRows:2}}
                            value={this.state.achievement_field[index]['achievement_diffcult_note']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_diffcult_note')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>产业化时间</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_industry_time']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_industry_time')}}
                          >
                            <Option title="1-2年" value="1-2年" key="1-2年">1-2年</Option>
                            <Option title="3-5年" value="3-5年" key="3-5年">3-5年</Option>
                            <Option title="5-8年" value="5-8年" key="5-8年">5-8年</Option>
                            <Option title="8年以上" value="8年以上" key="8年以上">8年以上</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0",height:"32px"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>产业化备注</div>
                        <div style={{...c2}}>
                          <TextArea
                            autosize={{minRows:1, maxRows:2}}
                            value={this.state.achievement_field[index]['achievement_industry_note']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_industry_note')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>成果上游环节</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_upstream_link']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_upstream_link')}}
                          >
                            <Option title="国家项目" value="国家项目" key="国家项目">国家项目</Option>
                            <Option title="省级项目" value="省级项目" key="省级项目">省级项目</Option>
                            <Option title="院校项目" value="院校项目" key="院校项目">院校项目</Option>
                            <Option title="留学生创业项目" value="留学生创业项目" key="留学生创业项目">留学生创业项目</Option>
                            <Option title="国内高校创业项目" value="国内高校创业项目" key="国内高校创业项目">国内高校创业项目</Option>
                            <Option title="其他" value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>成果下游环节</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.achievement_field[index]['achievement_downstream_link']}
                            onChange={(value)=>{this.inputChange(value,index,'achievement_downstream_link')}}
                          >
                            <Option title="基础研究（高等院校、大科学装置、国家实验室、省级实验室）" value="基础研究（高等院校、大科学装置、国家实验室、省级实验室）" key="基础研究（高等院校、大科学装置、国家实验室、省级实验室）">基础研究（高等院校、大科学装置、国家实验室、省级实验室）</Option>
                            <Option title="应用研究" value="应用研究" key="应用研究">应用研究</Option>
                            <Option title="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）" value="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）" key="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）">成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）</Option>
                            <Option title="产业化" value="产业化" key="产业化">产业化</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0",height:"32px"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>成果市场化建议</div>
                        <div style={{...c2}}>
                          <TextArea
                            autosize={{minRows:1, maxRows:2}}
                            value={this.state.achievement_field[index]['achievement_market_advice']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'achievement_market_advice')}}
                          />
                        </div>
                        <div style={{flex:"0 0  30px",textAlign: "right"}}>
                          {
                            index === 0?
                            ''
                            :
                            <span title={'删除'} onClick={()=>{this.remove(index)}} css={{
                              fontSize:"22px",
                              lineHeight:"32px",
                              cursor:"pointer",
                              "&:hover":{color:"#01bd4c"}
                            }}><i className="fa fa-minus-square-o" aria-hidden="true"></i></span>
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              )
            })
            :
            ''
          }
          <Col style={{marginTop:"20px"}}>
            <Button type="dashed" onClick={this.add} style={{ width: '20%' }}>
              <Icon type="plus" /> 添加
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}


export default AchievementField
