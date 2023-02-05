/*
 * @Author: kolf kolf@live.cn
 * @Date: 2023-02-04 19:13:34
 * @LastEditors: kolf kolf@live.cn
 * @LastEditTime: 2023-02-04 23:16:51
 * @FilePath: /gisApp/src/services/api.ts
 * @Description:
 */
import axios from "axios";
import jsonpAdapter from "axios-jsonp";

export const getRainList = (params) => {
  console.log(params.t)
  return axios({
    url: `https://typhoon.slt.zj.gov.cn/Api/LeastRain/24?_=${params.t}`,
    adapter: jsonpAdapter,
  }).then((res) => {
    console.log(res, 'res')
    return JSON.parse(res.data.contours)
  });
};
