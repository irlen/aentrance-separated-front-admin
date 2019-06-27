import axios from 'axios'
export const ChartData = (param={},callback)=>{
  axios.post('/Simplify/public/?s=Filter.getChartData',param)
  .then(result=>{
    callback(result)
  })
}
