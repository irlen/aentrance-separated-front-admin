/** @jsx jsx */
import React from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { withTheme } from 'emotion-theming'
import { userAuth } from '../components/UserAuth'

import Authenticated from './Authenticated'
import VerticFail from './VerticFail'

import Login from '../Login'
import Layout from '../Layout'
//总览
import WholeView from '../WholeView'
//分组
import SystemGroup from '../SystemGroup'
//数据源
import SystemBase from '../SystemBase'
//规则解析
import SystemRule from '../SystemRule'
//发现日志
import LogStatistic from '../LogStatistic'
//仪表板自定义
import DashboardManage from '../DashboardManage'
//内置
import DashboardBuiltin from '../DashboardBuiltin'

//后台管理页面
import Admin from '../Admin'
const ARoute = (props)=>(
  <div css={{
    background: props.theme.bodyBg,
    color: props.theme.fontColor,
    fontSize: props.theme.fontSize,
    height: 'auto'
  }}
  >
    <Switch>
      <Route path='/login' exact component={  Login } />
      <Route path='/app' render={()=> <Layout />}/>
      <Route path='/admin' exact render={()=><Admin />}/>
      <Redirect from='/' to="/app" />
    </Switch>
  </div>
);
export const AppRoute = withTheme(ARoute)
export const SubRoute = () => (
    <div>
      {
       //总览
      }
      <Route path='/app' exact render={()=> <WholeView />} />
      {
        //仪表板
      }
      <Route path='/app/dashboard/dashboardmanage/:id' render={()=> <DashboardManage />} />
      <Route path='/app/dashboard/dashboardbuiltin' exact render={()=> <DashboardBuiltin />} />
      {
        //日志
      }
      <Route path='/app/log/logstatistic' exact render={()=> <LogStatistic />} />
      {
        //设置
      }
      <Route path='/app/system/systemgroup' exact render={()=> <SystemGroup />} />
      <Route path='/app/system/systembase' exact render={()=> <SystemBase />} />
      <Route path='/app/system/systemrule' exact render={()=> <SystemRule />} />

  </div>
)
