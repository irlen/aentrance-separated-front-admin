//sorter: (a, b) => a.name.length - b.name.length
const tableSort = (a,b)=>{
  const regnum = new RegExp("^[0-9]*$");//纯数字类型
	const regunit = new RegExp("^[0-9]+(\.[0-9]+)?[^0-9]+$"); //数字加单位类型
  if(regnum.test(a)){
    //纯数字
    return (a-b)
  }else if(regunit.test(a)){
    //数字加单位
    const numpartA = a.match(/(^[0-9]+(\.[0-9]+)?)([^0-9]{1,})/)[1];
    const numpartB = b.match(/(^[0-9]+(\.[0-9]+)?)([^0-9]{1,})/)[1];
		const unitpartA = a.match(/(^[0-9]+(\.[0-9]+)?)([^0-9]{1,})/)[3].trim();
		const unitpartB = b.match(/(^[0-9]+(\.[0-9]+)?)([^0-9]{1,})/)[3].trim();
    let getValue = (numpart,unitpart)=>{
      let compareValue
      if(unitpart === 'GB' || unitpart === 'Gb'){
  			compareValue = parseFloat(numpart)*1024*1024*1024;
  		}else if(unitpart === 'MB' || unitpart === 'Mb'){
  			compareValue = parseFloat(numpart)*1024*1024;
  		}else if(unitpart === 'KB' || unitpart === 'Kb'){
  			compareValue = parseFloat(numpart)*1024;
  		}else if(unitpart === 'B' || unitpart === 'b'){
  			compareValue = parseFloat(numpart);
  		}else if(unitpart === 's'){
  			compareValue = parseFloat(numpart)*1000*1000;
  		}else if(unitpart === 'ms'){
  			compareValue = parseFloat(numpart)*1000;
  		}else if(unitpart === 'us'){
  			compareValue = parseFloat(numpart);
  		}else if(unitpart === '万'){
  			compareValue = parseFloat(numpart)*10000;
  		}else if(unitpart === '百万'){
  			compareValue = parseFloat(numpart)*1000000;
  		}else if(unitpart === '千万'){
  			compareValue = parseFloat(numpart)*10000000;
  		}else if(unitpart === '亿'){
  			compareValue = parseFloat(numpart)*100000000;
  		}else if(unitpart === '个'){
  			compareValue = parseFloat(numpart);
  		}else if(unitpart === '次'){
  			compareValue = parseFloat(numpart);
  		}
      return compareValue
    }
    const aValue = getValue(numpartA,unitpartA)
    const bValue = getValue(numpartB,unitpartB)
    return aValue - bValue
  }
}
const sortStandardList = [
  'bytes','bytes_max','bytes_avg','packets','packets_max','packets_avg','drops','bytes_in','bytes_in_max','bytes_in_avg','bytes_out','bytes_out_max','bytes_out_avg','packets_in','packets_in_max','packets_in_avg','packets_out','packets_out_max','packets_out_avg','app_bytes','app_bytes_max','app_bytes_avg','app_bytes_in','app_bytes_in_max','app_bytes_in_avg','app_bytes_out','app_bytes_out_max','app_bytes_out_avg','app_packets','app_packets_max','app_packets_avg','app_packets_in','app_packets_in_max','app_packets_in_avg','app_packets_out','app_packets_out_max','app_packets_out_avg','rst','rst_max','rst_avg','rst_in','rst_in_max','rst_in_avg','rst_out','rst_out_max','rst_out_avg','window0','window0_max','window0_avg','window0_in','window0_in_max','window0_in_avg','window0_out','window0_out_max','window0_out_avg','drops_max','drops_avg','drops_in','drops_in_max','drops_in_avg','drops_out','drops_out_max','drops_out_avg','ret_max','ret_avg','ret_in','ret_in_max','ret_in_avg','ret_out','ret_out_max','ret_out_avg','rtt_in','tcp_conn_num','rtt_in_max','tcp_conn_num_max','rtt_in_avg','tcp_conn_num_avg','rtt_out','udp_conn_num','rtt_out_max','udp_conn_num_max','rtt_out_avg','udp_conn_num_avg','ret','bytes_client','bytes_server','packets_client','packets_server','app_bytes_client','app_bytes_server','app_packets_client','app_packets_server','ret_client','ret_server','drop','drop_client','drop_server','rst_client','rst_server','zero_window','zero_window_client','zero_window_server','request_num','succeed_request','fail_request','tran_time','server_time','ret_time','ret_time_client','ret_time_server','drop_time','drop_time_client','drop_time_server','conn_time','server_conn_time','client_conn_time','lianjie_time','fin_time','data_time','http_bytes','http_bytes_client','http_bytes_server','rttin','rttout','pkt64_bytes','pkt64_bytes_max','pkt64_bytes_avg','pkt64_bytes_in','pkt64_bytes_in_max','pkt64_bytes_in_avg','pkt64_bytes_out','pkt64_bytes_out_max','pkt64_bytes_out_avg','pkt64_num','pkt64_num_max','pkt64_num_avg','pkt64_num_in','pkt64_num_in_max','pkt64_num_in_avg','pkt64_num_out','pkt64_num_out_max','pkt64_num_out_avg','pkt128_bytes','pkt128_bytes_max','pkt128_bytes_avg','pkt128_bytes_in','pkt128_bytes_in_max','pkt128_bytes_in_avg','pkt128_bytes_out','pkt128_bytes_out_max','pkt128_num','pkt128_bytes_out_avg','pkt128_num_max','pkt128_num_avg','pkt128_num_in_max','pkt128_num_in','pkt128_num_in_avg','pkt128_num_out_max','pkt128_num_out','pkt128_num_out_avg','pkt512_bytes','pkt512_bytes_max','pkt512_bytes_avg','pkt512_bytes_in','pkt512_bytes_in_max','pkt512_bytes_in_avg','pkt512_bytes_out','pkt512_bytes_out_max','pkt512_num','pkt512_bytes_out_avg','pkt512_num_max','pkt512_num_avg','pkt512_num_in','pkt512_num_in_avg','pkt512_num_in_max','pkt512_num_out','pkt512_num_out_max','pkt512_num_out_avg','pkt1517_bytes_max','pkt1517_bytes','pkt1517_bytes_avg','pkt1517_bytes_in','pkt1517_bytes_in_max','pkt1517_bytes_out','pkt1517_bytes_in_avg','pkt1517_bytes_out_max','pkt1517_bytes_out_avg','pkt1517_num','pkt1517_num_avg','pkt1517_num_max','pkt1517_num_in','pkt1517_num_in_max','pkt1517_num_in_avg','pkt1517_num_out','pkt1517_num_out_max','pkt1517_num_out_avg','pkt1518_bytes_max','pkt1518_bytes','pkt1518_bytes_avg','pkt1518_bytes_in','pkt1518_bytes_in_max','pkt1518_bytes_in_avg','pkt1518_bytes_out','pkt1518_bytes_out_avg','pkt1518_bytes_out_max','pkt1518_num','pkt1518_num_max','pkt1518_num_avg','pkt1518_num_in_max','pkt1518_num_in','pkt1518_num_in_avg','pkt1518_num_out','pkt1518_num_out_avg','pkt1518_num_out_max','SYN_bytes','SYN_bytes_max','SYN_bytes_avg','SYN_bytes_in','SYN_bytes_in_max','SYN_bytes_in_avg','SYN_bytes_out','SYN_bytes_out_max','SYN_bytes_out_avg','SYN_num','SYN_num_max','SYN_num_avg','SYN_num_in','SYN_num_in_max','SYN_num_in_avg','SYN_num_out','SYN_num_out_max','SYN_num_out_avg','SYN_ACK_bytes','SYN_ACK_bytes_max','SYN_ACK_bytes_avg','SYN_ACK_bytes_in','SYN_ACK_bytes_in_max','SYN_ACK_bytes_in_avg','SYN_ACK_bytes_out','SYN_ACK_bytes_out_max','SYN_ACK_bytes_out_avg','SYN_ACK_num','SYN_ACK_num_max','SYN_ACK_num_avg','SYN_ACK_num_in','SYN_ACK_num_in_max','SYN_ACK_num_in_avg','SYN_ACK_num_out','SYN_ACK_num_out_max','SYN_ACK_num_out_avg','ACK_bytes','ACK_bytes_max','ACK_bytes_avg','ACK_bytes_in','ACK_bytes_in_max','ACK_bytes_in_avg','ACK_bytes_out','ACK_bytes_out_max','ACK_bytes_out_avg','ACK_num','ACK_num_max','ACK_num_avg','ACK_num_in','ACK_num_in_max','ACK_num_in_avg','ACK_num_out','ACK_num_out_max','ACK_num_out_avg','FIN_bytes','FIN_bytes_max','FIN_bytes_avg','FIN_bytes_in','FIN_bytes_in_max','FIN_bytes_in_avg','FIN_bytes_out','FIN_bytes_out_max','FIN_bytes_out_avg','FIN_num','FIN_num_max','FIN_num_avg','FIN_num_in','FIN_num_in_max','FIN_num_in_avg','FIN_num_out','FIN_num_out_max','FIN_num_out_avg','RST_bytes','RST_bytes_max','RST_bytes_avg','RST_bytes_in','RST_bytes_in_max','RST_bytes_in_avg','RST_bytes_out','RST_bytes_out_max','RST_bytes_out_avg','RST_num','RST_num_max','RST_num_avg','RST_num_in','RST_num_in_max','RST_num_in_avg','RST_num_out','RST_num_out_max','RST_num_out_avg','num','tol_app','succeed_app','fail_app','slow_res_time','average_data_time','request','num_100','num_200','num_300','num_400','num_500'
]

const sortColumns = (xData)=>{
  let newColumns = []
  if(xData && xData.length>0){
    newColumns = xData.map(item=>{
      if(sortStandardList.indexOf(item.dataIndex) !== -1){
        item.sorter = (a,b) => tableSort(a[item.dataIndex],b[item.dataIndex])
      }
      return item
    })
  }
  return newColumns
}


export default sortColumns
