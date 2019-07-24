

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
  //   key:'/admin/forsearch',
  //   path:'/admin/forsearch',
  //   component:'',
  //   name:'信息检索',
  //   icon: 'fa fa-search',
  //   routes:[
  //     { key:'/admin/forsearch/searchfor', path: '/admin/forsearch/searchfor', component:'../SearchFor', name:'地域和企业'},
  //   ]
  // },
  {
    key:'/admin/takenote',
    path:'/admin/takenote',
    component:'',
    name:'信息录入',
    icon: 'fa fa-database',
    routes:[
      { key:'/admin/takenote/datanote', path: '/admin/takenote/datanote', component:'../DataNote', name:'产业园'},
      { key:'/admin/takenote/databuilding', path: '/admin/takenote/databuilding', component:'../DataBuilding', name:'楼宇'},
      { key:'/admin/takenote/datacompany', path: '/admin/takenote/datacompany', component:'../DataCompany', name:'企业'},
      { key:'/admin/takenote/datatech', path: '/admin/takenote/datatech', component:'../DataTech', name:'科技创新'},
    ]
  },
  // ,{
  //   key:'/admin/indusclassify',
  //   path:'/admin/indusclassify',
  //   component:'',
  //   name:'产业',
  //   icon: 'fa fa-th-list',
  //   routes:[
  //     { key:'/admin/indusclassify', path: '/admin/indusclassify', component:'../IndusClassify', name:'管理'},
  //   ]
  // }，
  {
    key:'/admin/user',
    path:'/admin/user',
    component:'',
    name:'用户',
    icon: 'fa fa-user',
    routes:[
      { key:'/admin/user/usermanage', path: '/admin/user/usermanage', component:'../UserManage', name:'管理'},
    ]
  }
]
export { routeOne, adminRoute}
