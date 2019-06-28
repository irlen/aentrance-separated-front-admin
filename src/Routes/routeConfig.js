

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


export { routeOne }
