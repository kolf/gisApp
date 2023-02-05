/*
 * @Author: kolf kolf@live.cn
 * @Date: 2023-02-04 16:00:08
 * @LastEditors: kolf kolf@live.cn
 * @LastEditTime: 2023-02-05 09:47:19
 * @FilePath: /gisApp/.umirc.ts
 * @Description:
 */
import { defineConfig } from "umi";

export default defineConfig({
  title: "中国天气",
  routes: [{ path: "/", component: "index" }],
  npmClient: "yarn",
  plugins: ["@umijs/plugins/dist/antd"],
  antd: {},
});
