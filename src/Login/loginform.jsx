import React from 'react'
import { Form, Icon, Input, Button, Checkbox ,message} from 'antd'
import $ from 'jquery'

import { wyAxiosPost } from '../components/WyAxios'
const FormItem = Form.Item

class NormalLoginForm extends React.Component {
  //表单提交事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loginSubmit(values)
      }else{
        message.error(err)
      }
    });
  }
  componentDidMount(){
    // wyAxiosPost('User/checkUser',{},(result)=>{
    //   if(result.data.msg.username){
    //     const responseData = result.data.msg
    //     this.props.form.setFieldsValue({
    //       username: responseData.username,
    //       password: responseData.password,
    //       remember: responseData.remember
    //     })
    //   }else{
    //     this.props.form.setFieldsValue({
    //       username: '',
    //       password: '',
    //       remember: false
    //     })
    //   }
    // })
    this.inputRef.input.autofocus = true
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" style={{maxWidth:"300px"}}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input ref={(input) => { this.inputRef = input }} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox style={{color: "#ffffff"}}>记住我</Checkbox>
          )}
          {
            //<a className="login-form-forgot" style={{color: "#ffffff",float: "right"}} href="">忘记密码</a>
          }
          <Button type="primary" htmlType="submit" className="login-form-button" style={{color:"#ffffff",width:"100%",letterSpacing:"10px"}}>
            登  录
          </Button>
          {
            //<span style={{color:"#ffffff"}}>没有账号，</span> <a href="" style={{color: "#ffffff"}}>现在去注册!</a>
          }

        </FormItem>
      </Form>
    );
  }
}
const Loginform = Form.create()(NormalLoginForm)
export default Loginform
