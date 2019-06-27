import React from 'react'
import { Menu, Icon, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars'
import { NavLink } from 'react-router-dom'

import { routeOne } from '../../../Routes/routeConfig'
const SubMenu = Menu.SubMenu;
class Nav extends React.Component {
  state = {
    collapsed: true,
    selectedKeys: []
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
    this.props.laystate(this.state.collapsed)
  }
  componentDidMount(){
    this.setState({
      selectedKeys: [this.props.path]
    })
  }

  selectedKeysChange = (value)=>{
    const curKey = []
    curKey.push(value.key)

    this.setState({
      selectedKeys:[...curKey]
    })
  }
  openKeysChange = ()=>{
    console.log("haha")

  }
  render() {
    return (
      <Scrollbars
        autoHide
        autoHideTimeout={100}
        autoHideDuration={200}
        className="navContainer"
      >
        <Button type="primary" onClick={this.toggleCollapsed} style={{ margin: 5}}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <Menu
          selectedKeys={this.state.selectedKeys}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
        {
          routeOne && routeOne.length>0?
          routeOne.map(item=>{
            if(!item.routes){
              return (
                <SubMenu
                  key={ item.key }
                  title={
                    <span>
                      <Icon><i className={ item.icon } aria-hidden="true"></i></Icon>
                      <span>{ item.name }</span>
                    </span>
                  }
                >
                  <Menu.Item onClick={this.selectedKeysChange} key={ item.key }>
                    <NavLink to={ item.path }> { item.name } </NavLink>
                  </Menu.Item>
                </SubMenu>
              )
            }else if(item.routes){
              return(
                <SubMenu
                  key={ item.key }
                  title={
                    <span>
                      <Icon><i className={ item.icon } aria-hidden="true"></i></Icon>
                      <span>{ item.name }</span>
                    </span>
                  }
                >
                {
                  item.routes && item.routes.length>0?
                  item.routes.map(subItem=>{
                    return(
                      <Menu.Item onClick={this.selectedKeysChange} key={ subItem.path }>
                        <NavLink to={ subItem.path }> { subItem.name } </NavLink>
                      </Menu.Item>
                    )
                  })
                  :
                  ''
                }
                </SubMenu>
              )
            }
          })
          :
          ''
        }
        </Menu>
      </Scrollbars>
    );
  }
}


export default Nav
