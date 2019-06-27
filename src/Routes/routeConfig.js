

const routeOne = [
  {
    key:'/app',
    path:'/app',
    component:'',
    name:'总览',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app', path: '/app', component:'../WholeView', name:'总览'},
    ]
  },
  {
    key:'/app/dashboard',
    path:'/app/dashboard',
    component:'',
    name:'仪表板',
    icon: 'fa fa-tachometer',
    routes:[
      { key:'/app/dashboard/dashboardmanage', path: '/app/dashboard/dashboardmanage/null', component:'../DashboardManage', name:'自定义'},
      { key:'/app/dashboard/dashboardbuiltin', path: '/app/dashboard/dashboardbuiltin', component:'../DashboardBuiltin', name:'内置'},
    ]
  },
  {
    key:'/app/log',
    path:'/app/log',
    component:'',
    name:'日志',
    icon: 'fa fa-compass',
    routes:[
      { key:'/app/log/logstatistic', path: '/app/log/logstatistic', component:'../LogStatistic', name:'发现日志'},
    ]
  },
   {
      key: '/app/system',
      path: '/app/system',
      component: '',
      name: '系统配置',
      icon: 'fa fa-cog',
      routes:[
        { key: '/app/system/systemgroup',  path: '/app/system/systemgroup', component:'../SystemGroup', name:'分组'},
        { key: '/app/system/systembase',  path: '/app/system/systembase', component:'../SystemBase', name:'数据源'},
        { key: '/app/system/systemrule',  path: '/app/system/systemrule', component:'../SystemRule', name:'规则管理'},
      ]
    }
]


export { routeOne }
