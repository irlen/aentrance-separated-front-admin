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
import DataNote from '../DataNote'
import DataBuilding from '../DataBuilding'
import DataCompany from '../DataCompany'
import DataTech from '../DataTech'
import IndusClassify from '../IndusClassify'
import SearchFor from '../SearchFor'

const ARoute = (props)=>(
  <div>
    <Switch>
      <Route path='/login' exact render={()=> <Login />} />
      <Route path='/app' render={()=> <Layout />}/>
      <Route path='/admin' render={()=><Admin />}/>
      <Redirect from='/' to='/login' />
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
export const SubAdminRoute = () => (
    <div>
      {
       //管理
      }
      <Route path='/admin/searchfor' exact render={()=> sessionStorage.isLogin?<SearchFor />:<VerticFail/> } />
      <Route path='/admin/datanote' exact render={()=> sessionStorage.isLogin?<DataNote />:<VerticFail/> } />
      <Route path='/admin/databuilding' exact render={()=> sessionStorage.isLogin?<DataBuilding />:<VerticFail/>} />
      <Route path='/admin/datacompany' exact render={()=> sessionStorage.isLogin?<DataCompany />:<VerticFail/>} />
      <Route path='/admin/datatech' exact render={()=> sessionStorage.isLogin?<DataTech />:<VerticFail/>} />
      <Route path='/admin/indusclassify' exact render={()=> sessionStorage.isLogin?<IndusClassify />:<VerticFail/>} />
  </div>
)
