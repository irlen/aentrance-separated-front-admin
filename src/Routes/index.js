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
import UserManage from '../UserManage'

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
      <Route path='/admin/forsearch/searchfor' exact render={()=> sessionStorage.isLogin?<SearchFor />:<VerticFail/> } />
      <Route path='/admin/takenote/datanote' exact render={()=> sessionStorage.isLogin?<DataNote />:<VerticFail/> } />
      <Route path='/admin/takenote/databuilding' exact render={()=> sessionStorage.isLogin?<DataBuilding />:<VerticFail/>} />
      <Route path='/admin/takenote/datacompany' exact render={()=> sessionStorage.isLogin?<DataCompany />:<VerticFail/>} />
      <Route path='/admin/takenote/datatech' exact render={()=> sessionStorage.isLogin?<DataTech />:<VerticFail/>} />
      <Route path='/admin/takenote/indusclassify' exact render={()=> sessionStorage.isLogin?<IndusClassify />:<VerticFail/>} />
      <Route path='/admin/user/usermanage' exact render={()=> sessionStorage.isLogin?<UserManage />:<VerticFail/>} />
  </div>
)
