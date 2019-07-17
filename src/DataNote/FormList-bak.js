/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, {Component} from 'react'
import { Row, Col, Input, Form, Icon, Button } from 'antd'

import { FormModule } from '../components/Amodule'
let id = 0
class FormDetail extends Component{
  state = {
    formData: {
      number:'123'
    },
    confirmDirty: false,

  }
  componentDidMount(){
    this._isMounted = true
    this.props.form.setFieldsValue({
      number:"1234"
    })
  }
  //提交
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    })
  }

  //blur报错效果
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }












  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    console.log(form.getFieldValue('names'))
  };


  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { getFieldDecorator, getFieldValue } = this.props.form
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <Col sm={24} md={12} lg={8}>
        <Form.Item
          required={false}
          key={k}
          label="名称"
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field.",
              },
            ],
          })(<Input placeholder="passenger name" style={{ width: '80%'}} />)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      </Col>
    ))
    return(
      <div css={{paddingBottom:"20px"}}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col sm={24} md={12} lg={8}>
              <Form.Item label="编号">
                {getFieldDecorator('number', {
                  rules: [
                    { required: true, message: '' }
                ],
              })(<Input placeholder="Please enter user name" />)}
              </Form.Item>
            </Col>
            {formItems}
            <Col sm={24} md={12} lg={8}>
              <Form.Item>
                <div css={{height:"29px"}}></div>
                <Button type="dashed" onClick={this.add} css={{width:"100%"}}>
                  <Icon type="plus" />动态添加项目
                </Button>
              </Form.Item>
            </Col>

















          </Row>
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
