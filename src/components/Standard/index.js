
export const netStandard = [
    {
      name: "总流量",
      keyName:"bytes"
    },{
      name: "流入流量",
      keyName:"bytes_in"
    },{
      name:"流出流量",
      keyName:"bytes_out"
    },{
      name:"总数据包",
      keyName:"packets"
    },{
      name:"流入数据包",
      keyName:"packets_in"
    },{
      name:"流出数据包",
      keyName:"packets_out"
    },{
      name:"RTT_IN",
      keyName:"rtt_in"
    },{
      name:"RTT_OUT",
      keyName:"rtt_out"
    }
]

export const classNetStandard = {
  fatherItem:[
    {
      name: "流量类",
      keyName:"flow"
    },{
      name:"数据包类",
      keyName:"bag"
    },{
      name:"时间类",
      keyName:"time"
    }
  ],
  subItem:{
    flow:[
      {
        name: "总流量",
        keyName:"bytes"
      },{
        name: "流入流量",
        keyName:"bytes_in"
      },{
        name:"流出流量",
        keyName:"bytes_out"
      }
    ],
    bag:[
      {
        name:"总数据包",
        keyName:"packets"
      },{
        name:"流入数据包",
        keyName:"packets_in"
      },{
        name:"流出数据包",
        keyName:"packets_out"
      }
    ],
    time:[
      {
        name:"RTT_IN",
        keyName:"rtt_in"
      },{
        name:"RTT_OUT",
        keyName:"rtt_out"
      }
    ]
  }
}
