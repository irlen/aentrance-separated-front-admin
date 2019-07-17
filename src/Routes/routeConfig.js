

const routeOne = [
  {
    key:'/app',
    path:'/app',
    component:'',
    name:'产业',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app', path: '/app', component:'../WholeView', name:'分布'},
      { key:'/app/industrydata', path: '/app/industrydata', component:'../IndustryData', name:'数据统计'}
    ]
  },{
    key:'/app/professional',
    path:'/app/professional',
    component:'',
    name:'专业视角',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app/professional', path: '/app/professional', component:'../Professional', name:'看到什么了'},

    ]
  },{
    key:'/app/report',
    path:'/app/report',
    component:'',
    name:'研究报告',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app/report', path: '/app/report', component:'../Report', name:'看到什么了'},

    ]
  },
  {
    key:'/app/news',
    path:'/app/news',
    component:'',
    name:'新闻',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app/news', path: '/app/news', component:'../News', name:'看到什么了'},

    ]
  },
  {
    key:'/app/commerce',
    path:'/app/commerce',
    component:'',
    name:'商业',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app/commerce', path: '/app/commerce', component:'../Commerce', name:'看到什么了'},

    ]
  },{
    key:'/app/us',
    path:'/app/us',
    component:'',
    name:'我们',
    icon: 'fa fa-pie-chart',
    routes:[
      { key:'/app/us', path: '/app/us', component:'../Us', name:'看到什么了'},
    ]
  }
]

const adminRoute = [
  // {
  //   key:'/admin/searchfor',
  //   path:'/admin/searchfor',
  //   component:'',
  //   name:'信息检索',
  //   icon: 'fa fa-search',
  //   routes:[
  //     { key:'/admin/searchfor', path: '/admin/searchfor', component:'../SearchFor', name:'地域和企业'},
  //   ]
  // },
  {
    key:'/admin/datanote',
    path:'/admin/datanote',
    component:'',
    name:'地域',
    icon: 'fa fa-database',
    routes:[
      { key:'/admin/datanote', path: '/admin/datanote', component:'../DataNote', name:'产业园'},
      { key:'/admin/databuilding', path: '/admin/databuilding', component:'../DataBuilding', name:'楼宇'},
      { key:'/admin/datacompany', path: '/admin/datacompany', component:'../DataCompany', name:'企业'},
      { key:'/admin/datatech', path: '/admin/datatech', component:'../DataTech', name:'科技创新'},
    ]
  }
  // ,{
  //   key:'/admin/indusclassify',
  //   path:'/admin/indusclassify',
  //   component:'',
  //   name:'产业',
  //   icon: 'fa fa-th-list',
  //   routes:[
  //     { key:'/admin/indusclassify', path: '/admin/indusclassify', component:'../IndusClassify', name:'管理'},
  //   ]
  // }
]
export { routeOne, adminRoute}
