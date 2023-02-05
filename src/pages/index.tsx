/*
 * @Author: kolf kolf@live.cn
 * @Date: 2023-02-04 16:00:08
 * @LastEditors: kolf kolf@live.cn
 * @LastEditTime: 2023-02-05 09:42:31
 * @FilePath: /gisApp/src/pages/index.tsx
 * @Description:
 */
import type { ChoroplethLayerProps, LarkMapProps } from "@antv/larkmap";
import {
  ChoroplethLayer,
  LarkMap,
  CustomControl,
  ZoomControl,
  LegendCategories,
} from "@antv/larkmap";
import * as React from "react";
import dayjs from "dayjs";
import { Menu, Slider } from "antd";
import { useRequest } from "ahooks";
import { getRainList } from "@/services/api";
import styles from "./index.module.less";

const config: LarkMapProps = {
  mapType: "Gaode",
  mapOptions: {
    style: "normal",
    center: [120.210792, 30.246026],
    zoom: 1,
  },
};

const menuList = [
  {
    key: "k1",
    label: "温度",
  },
  {
    key: "k2",
    label: "降水",
  },
  {
    key: "k3",
    label: "气压",
  },
  {
    key: "k4",
    label: "相对湿度",
  },
  {
    key: "k5",
    label: "风速",
  },
  {
    key: "k6",
    label: "卫星云图",
  },
];

const colors = [
  "rgba(164,245,140,0.6)",
  "rgba(58,164,2,0.6)",
  "rgba(113,180,232,0.6)",
  "rgba(3,0,255,0.6)",
];

const labels = ['小雨','中雨','大雨','暴雨']

const layerOptions: Omit<ChoroplethLayerProps, "source"> = {
  autoFit: true,
  fillColor: {
    field: "value",
    value: colors,
  },
  opacity: 0.6,
  label: {
    field: "name",
    visible: false,
    style: { fill: "black", fontSize: 12 },
    // value: ["小雨", "中雨", "大雨", "暴雨"],
  },
};

const formatter = (value) => {
  return value + ":00";
};

const makeData = (data) => {
  if (data.length === 0) {
    return {};
  }
  console.log(data, "data");
  return {
    type: "FeatureCollection",
    features: data.map((item, index) => ({
      type: "Feature",
      properties: {
        name: item.symbol,
        value: Number(item.symbol),
        color: item.color,
      },
      geometry: {
        type: "Polygon",
        coordinates: [item.latAndLong.map(([a, b]) => [b, a])],
      },
    })),
  };
};

const makeParams = (values) => {
  return Object.entries(values).reduce((result, [key, value]) => {
    if (key === "date" && value) {
      result["t"] = value.valueOf();
    }
    return result;
  }, Object.create(null));
};

const defaultValue = dayjs("2023-02-03");

export default () => {
  const [params, setParams] = React.useState({ date: defaultValue });
  const { data = [] } = useRequest(() => getRainList(makeParams(params)), {
    refreshDeps: [params],
  });

  const handleChange = (value) => {
    setParams({
      date: defaultValue.add(value, "hour"),
    });
    // params.t.add()
    console.log(value, "value");
  };

  console.log(makeData(data), "makeData(data)");

  return (
    <LarkMap {...config} className={styles["root"]} style={{ height: "100vh" }}>
      <CustomControl position="topleft">
        <LegendCategories
          geometryType="square"
          labels={labels}
          colors={colors}
        />
      </CustomControl>
      <CustomControl position="topright" className={styles["menu"]}>
        <Menu items={menuList} />
      </CustomControl>
      <CustomControl
        position="bottomcenter"
        style={{ width: "100%" }}
        className={styles["slider"]}
      >
        <Slider
          min={0}
          max={24}
          step={2}
          tooltip={{ formatter }}
          onChange={handleChange}
        />
      </CustomControl>
      <ZoomControl position="bottomleft" style={{ marginBottom: 72 }} />
      <ChoroplethLayer
        {...layerOptions}
        source={{
          data: makeData(data),
          parser: { type: "geojson" },
        }}
      />
    </LarkMap>
  );
};
