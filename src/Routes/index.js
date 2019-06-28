/** @jsx jsx */
import React from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { userAuth } from '../components/UserAuth'

import Authenticated from './Authenticated'
import VerticFail from './VerticFail'

import Login from '../Login'
import Layout from '../Layout'
//总览
import WholeView from '../WholeView'


//后台管理页面
import Admin from '../Admin'
const ARoute = (props)=>(
  <div>
    <Switch>
      <Route path='/login' exact component={  Login } />
      <Route path='/app' render={()=> <Layout />}/>
      <Route path='/admin' render={()=><Admin />}/>
      <Redirect from='/' to="/app" />
    </Switch>
  </div>
);
export const AppRoute = ARoute
export const SubRoute = () => (
    <div>
      {
       //总览
      }
      <Route path='/app' exact render={()=> <WholeView />} />
    

  </div>
)
