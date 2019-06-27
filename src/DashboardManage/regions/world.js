const world = [
    {"name":"阿富汗","coordinate":[67.709953,33.93911]},
    {"name":"安哥拉","coordinate":[17.873887,-11.202692]},
    {"name":"阿尔巴尼亚","coordinate":[20.168331,41.153332]},
    {"name":"阿联酋","coordinate":[53.847818,23.424076]},
    {"name":"阿根廷","coordinate":[-63.61667199999999,-38.416097]},
    {"name":"亚美尼亚","coordinate":[45.038189,40.069099]},
    {"name":"法属南半球和南极领地","coordinate":[69.348557,-49.280366]},
    {"name":"澳大利亚","coordinate":[133.775136,-25.274398]},
    {"name":"奥地利","coordinate":[14.550072,47.516231]},
    {"name":"阿塞拜疆","coordinate":[47.576927,40.143105]},
    {"name":"布隆迪","coordinate":[29.918886,-3.373056]},
    {"name":"比利时","coordinate":[4.469936,50.503887]},
    {"name":"贝宁","coordinate":[2.315834,9.30769]},
    {"name":"布基纳法索","coordinate":[-1.561593,12.238333]},
    {"name":"孟加拉国","coordinate":[90.356331,23.684994]},
    {"name":"保加利亚","coordinate":[25.48583,42.733883]},
    {"name":"巴哈马","coordinate":[-77.39627999999999,25.03428]},
    {"name":"波斯尼亚和黑塞哥维那","coordinate":[17.679076,43.915886]},
    {"name":"白俄罗斯","coordinate":[27.953389,53.709807]},
    {"name":"伯利兹","coordinate":[-88.49765,17.189877]},
    {"name":"百慕大","coordinate":[-64.7505,32.3078]},
    {"name":"玻利维亚","coordinate":[-63.58865299999999,-16.290154]},
    {"name":"巴西","coordinate":[-51.92528,-14.235004]},
    {"name":"文莱","coordinate":[114.727669,4.535277]},
    {"name":"不丹","coordinate":[90.433601,27.514162]},
    {"name":"博茨瓦纳","coordinate":[24.684866,-22.328474]},
    {"name":"中非共和国","coordinate":[20.939444,6.611110999999999]},
    {"name":"加拿大","coordinate":[-106.346771,56.130366]},
    {"name":"瑞士","coordinate":[8.227511999999999,46.818188]},
    {"name":"智利","coordinate":[-71.542969,-35.675147]},
    {"name":"中国","coordinate":[104.195397,35.86166]},
    {"name":"象牙海岸","coordinate":[-5.547079999999999,7.539988999999999]},
    {"name":"喀麦隆","coordinate":[12.354722,7.369721999999999]},
    {"name":"刚果民主共和国","coordinate":[21.758664,-4.038333]},
    {"name":"刚果共和国","coordinate":[15.827659,-0.228021]},
    {"name":"哥伦比亚","coordinate":[-74.297333,4.570868]},
    {"name":"哥斯达黎加","coordinate":[-83.753428,9.748916999999999]},
    {"name":"古巴","coordinate":[-77.781167,21.521757]},
    {"name":"北塞浦路斯","coordinate":[33.429859,35.126413]},
    {"name":"塞浦路斯","coordinate":[33.429859,35.126413]},
    {"name":"捷克共和国","coordinate":[15.472962,49.81749199999999]},
    {"name":"德国","coordinate":[10.451526,51.165691]},
    {"name":"吉布提","coordinate":[42.590275,11.825138]},
    {"name":"丹麦","coordinate":[9.501785,56.26392]},
    {"name":"多明尼加共和国","coordinate":[-70.162651,18.735693]},
    {"name":"阿尔及利亚","coordinate":[1.659626,28.033886]},
    {"name":"厄瓜多尔","coordinate":[-78.18340599999999,-1.831239]},
    {"name":"埃及","coordinate":[30.802498,26.820553]},
    {"name":"厄立特里亚","coordinate":[39.782334,15.179384]},
    {"name":"西班牙","coordinate":[-3.74922,40.46366700000001]},
    {"name":"爱沙尼亚","coordinate":[25.013607,58.595272]},
    {"name":"埃塞俄比亚","coordinate":[40.489673,9.145000000000001]},
    {"name":"芬兰","coordinate":[25.748151,61.92410999999999]},
    {"name":"斐","coordinate":[178.065032,-17.713371]},
    {"name":"福克兰群岛","coordinate":[-59.523613,-51.796253]},
    {"name":"法国","coordinate":[2.213749,46.227638]},
    {"name":"加蓬","coordinate":[11.609444,-0.803689]},
    {"name":"英国","coordinate":[-3.435973,55.378051]},
    {"name":"格鲁吉亚","coordinate":[-82.9000751,32.1656221]},
    {"name":"加纳","coordinate":[-1.023194,7.946527]},
    {"name":"几内亚","coordinate":[-9.696645,9.945587]},
    {"name":"冈比亚","coordinate":[-15.310139,13.443182]},
    {"name":"几内亚比绍","coordinate":[-15.180413,11.803749]},
    {"name":"赤道几内亚","coordinate":[10.267895,1.650801]},
    {"name":"希腊","coordinate":[21.824312,39.074208]},
    {"name":"格陵兰","coordinate":[-42.604303,71.706936]},
    {"name":"危地马拉","coordinate":[-90.23075899999999,15.783471]},
    {"name":"法属圭亚那","coordinate":[-53.125782,3.933889]},
    {"name":"圭亚那","coordinate":[-58.93018,4.860416]},
    {"name":"洪都拉斯","coordinate":[-86.241905,15.199999]},
    {"name":"克罗地亚","coordinate":[15.2,45.1]},
    {"name":"海地","coordinate":[-72.285215,18.971187]},
    {"name":"匈牙利","coordinate":[19.503304,47.162494]},
    {"name":"印尼","coordinate":[113.921327,-0.789275]},
    {"name":"印度","coordinate":[78.96288,20.593684]},
    {"name":"爱尔兰","coordinate":[-8.24389,53.41291]},
    {"name":"伊朗","coordinate":[53.688046,32.427908]},
    {"name":"伊拉克","coordinate":[43.679291,33.223191]},
    {"name":"冰岛","coordinate":[-19.020835,64.963051]},
    {"name":"以色列","coordinate":[34.851612,31.046051]},
    {"name":"意大利","coordinate":[12.56738,41.87194]},
    {"name":"牙买加","coordinate":[-77.297508,18.109581]},
    {"name":"约旦","coordinate":[36.238414,30.585164]},
    {"name":"日本","coordinate":[138.252924,36.204824]},
    {"name":"哈萨克斯坦","coordinate":[66.923684,48.019573]},
    {"name":"肯尼亚","coordinate":[37.906193,-0.023559]},
    {"name":"吉尔吉斯斯坦","coordinate":[74.766098,41.20438]},
    {"name":"柬埔寨","coordinate":[104.990963,12.565679]},
    {"name":"韩国","coordinate":[127.766922,35.907757]},
    {"name":"科索沃","coordinate":[20.902977,42.6026359]},
    {"name":"科威特","coordinate":[47.481766,29.31166]},
    {"name":"老挝","coordinate":[102.495496,19.85627]},
    {"name":"黎巴嫩","coordinate":[35.862285,33.854721]},
    {"name":"利比里亚","coordinate":[-9.429499000000002,6.428055]},
    {"name":"利比亚","coordinate":[17.228331,26.3351]},
    {"name":"斯里兰卡","coordinate":[80.77179699999999,7.873053999999999]},
    {"name":"莱索托","coordinate":[28.233608,-29.609988]},
    {"name":"立陶宛","coordinate":[23.881275,55.169438]},
    {"name":"卢森堡","coordinate":[6.129582999999999,49.815273]},
    {"name":"拉脱维亚","coordinate":[24.603189,56.879635]},
    {"name":"摩洛哥","coordinate":[-7.092619999999999,31.791702]},
    {"name":"摩尔多瓦","coordinate":[28.369885,47.411631]},
    {"name":"马达加斯加","coordinate":[46.869107,-18.766947]},
    {"name":"墨西哥","coordinate":[-102.552784,23.634501]},
    {"name":"马其顿","coordinate":[21.745275,41.608635]},
    {"name":"马里","coordinate":[-3.996166,17.570692]},
    {"name":"缅甸","coordinate":[95.956223,21.913965]},
    {"name":"黑山","coordinate":[19.37439,42.708678]},
    {"name":"蒙古","coordinate":[103.846656,46.862496]},
    {"name":"莫桑比克","coordinate":[35.529562,-18.665695]},
    {"name":"毛里塔尼亚","coordinate":[-10.940835,21.00789]},
    {"name":"马拉维","coordinate":[34.301525,-13.254308]},
    {"name":"马来西亚","coordinate":[101.975766,4.210484]},
    {"name":"纳米比亚","coordinate":[18.49041,-22.95764]},
    {"name":"新喀里多尼亚","coordinate":[165.618042,-20.904305]},
    {"name":"尼日尔","coordinate":[8.081666,17.607789]},
    {"name":"尼日利亚","coordinate":[8.675277,9.081999]},
    {"name":"尼加拉瓜","coordinate":[-85.207229,12.865416]},
    {"name":"荷兰","coordinate":[5.291265999999999,52.132633]},
    {"name":"挪威","coordinate":[8.468945999999999,60.47202399999999]},
    {"name":"尼泊尔","coordinate":[84.12400799999999,28.394857]},
    {"name":"新西兰","coordinate":[174.885971,-40.900557]},
    {"name":"阿曼","coordinate":[55.923255,21.512583]},
    {"name":"巴基斯坦","coordinate":[69.34511599999999,30.375321]},
    {"name":"巴拿马","coordinate":[-80.782127,8.537981]},
    {"name":"秘鲁","coordinate":[-75.015152,-9.189967]},
    {"name":"菲律宾","coordinate":[121.774017,12.879721]},
    {"name":"巴布亚新几内亚","coordinate":[143.95555,-6.314992999999999]},
    {"name":"波兰","coordinate":[19.145136,51.919438]},
    {"name":"波多黎各","coordinate":[-66.590149,18.220833]},
    {"name":"北朝鲜","coordinate":[127.510093,40.339852]},
    {"name":"葡萄牙","coordinate":[-8.224454,39.39987199999999]},
    {"name":"巴拉圭","coordinate":[-58.443832,-23.442503]},
    {"name":"卡塔尔","coordinate":[51.183884,25.354826]},
    {"name":"罗马尼亚","coordinate":[24.96676,45.943161]},
    {"name":"俄罗斯","coordinate":[105.318756,61.52401]},
    {"name":"卢旺达","coordinate":[29.873888,-1.940278]},
    {"name":"西撒哈拉","coordinate":[-12.885834,24.215527]},
    {"name":"沙特阿拉伯","coordinate":[45.079162,23.885942]},
    {"name":"苏丹","coordinate":[30.217636,12.862807]},
    {"name":"南苏丹","coordinate":[31.3069788,6.876991899999999]},
    {"name":"塞内加尔","coordinate":[-14.452362,14.497401]},
    {"name":"所罗门群岛","coordinate":[160.156194,-9.64571]},
    {"name":"塞拉利昂","coordinate":[-11.779889,8.460555]},
    {"name":"萨尔瓦多","coordinate":[-88.89653,13.794185]},
    {"name":"索马里兰","coordinate":[46.8252838,9.411743399999999]},
    {"name":"索马里","coordinate":[46.199616,5.152149]},
    {"name":"塞尔维亚共和国","coordinate":[21.005859,44.016521]},
    {"name":"苏里南","coordinate":[-56.027783,3.919305]},
    {"name":"斯洛伐克","coordinate":[19.699024,48.669026]},
    {"name":"斯洛文尼亚","coordinate":[14.995463,46.151241]},
    {"name":"瑞典","coordinate":[18.643501,60.12816100000001]},
    {"name":"斯威士兰","coordinate":[31.465866,-26.522503]},
    {"name":"叙利亚","coordinate":[38.996815,34.80207499999999]},
    {"name":"乍得","coordinate":[18.732207,15.454166]},
    {"name":"多哥","coordinate":[0.824782,8.619543]},
    {"name":"泰国","coordinate":[100.992541,15.870032]},
    {"name":"塔吉克斯坦","coordinate":[71.276093,38.861034]},
    {"name":"土库曼斯坦","coordinate":[59.556278,38.969719]},
    {"name":"东帝汶","coordinate":[125.727539,-8.874217]},
    {"name":"特里尼达和多巴哥","coordinate":[-61.222503,10.691803]},
    {"name":"突尼斯","coordinate":[9.537499,33.886917]},
    {"name":"土耳其","coordinate":[35.243322,38.963745]},
    {"name":"坦桑尼亚联合共和国","coordinate":[34.888822,-6.369028]},
    {"name":"乌干达","coordinate":[32.290275,1.373333]},
    {"name":"乌克兰","coordinate":[31.16558,48.379433]},
    {"name":"乌拉圭","coordinate":[-55.765835,-32.522779]},
    {"name":"美国","coordinate":[-95.712891,37.09024]},
    {"name":"乌兹别克斯坦","coordinate":[64.585262,41.377491]},
    {"name":"委内瑞拉","coordinate":[-66.58973,6.42375]},
    {"name":"越南","coordinate":[108.277199,14.058324]},
    {"name":"瓦努阿图","coordinate":[166.959158,-15.376706]},
    {"name":"西岸","coordinate":[35.3027226,31.9465703]},
    {"name":"也门","coordinate":[48.516388,15.552727]},
    {"name":"南非","coordinate":[22.937506,-30.559482]},
    {"name":"赞比亚","coordinate":[27.849332,-13.133897]},
    {"name":"津巴布韦","coordinate":[29.154857,-19.015438]}
];

export default world