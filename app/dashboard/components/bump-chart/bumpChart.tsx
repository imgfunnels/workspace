"use client";
import React, { useEffect, useRef, useState } from "react";

import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption
} from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LineSeriesOption
>;

var app: any = {};

var option: EChartsOption;

import { SeriesOption } from "echarts";

const names = [
  "Orange",
  "Tomato",
  "Apple",
  "Sakana",
  "Banana",
  "Iwashi",
  "Snappy Fish",
  "Lemon",
  "Pasta"
] as const;

const years = ["2001", "2002", "2003", "2004", "2005", "2006"];

const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length;
  let randomIndex = 0;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
  return array;
};

const generateRankingData = (): Map<string, number[]> => {
  const map: Map<string, number[]> = new Map();
  const defaultRanking: number[] = Array.from(
    { length: names.length },
    (_, i) => i + 1
  );

  for (const _ of years) {
    const shuffleArray = shuffle(defaultRanking);
    names.forEach((name, i) => {
      map.set(name, (map.get(name) || []).concat(shuffleArray[i]));
    });
  }
  return map;
};

const generateSeriesList = (): SeriesOption[] => {
  const seriesList: SeriesOption[] = [];
  const rankingMap = generateRankingData();

  rankingMap.forEach((data, name) => {
    const series: SeriesOption = {
      name,
      symbolSize: 20,
      type: "line",
      smooth: true,
      emphasis: {
        focus: "series"
      },
      endLabel: {
        show: true,
        formatter: "{a}",
        distance: 20
      },
      lineStyle: {
        width: 4
      },
      data
    };
    seriesList.push(series);
  });
  return seriesList;
};

option = {
  title: {
    text: "Bump Chart (Ranking)"
  },
  tooltip: {
    trigger: "item"
  },
  grid: {
    left: 30,
    right: 110,
    bottom: 30,
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: "category",
    splitLine: {
      show: true
    },
    axisLabel: {
      margin: 30,
      fontSize: 16
    },
    boundaryGap: false,
    data: years,
    position: "top"
  },
  yAxis: {
    type: "value",
    axisLabel: {
      margin: 30,
      fontSize: 16,
      formatter: "#{value}"
    },
    inverse: true,
    interval: 1,
    min: 1,
    max: names.length
  },
  visualMap: {
    type: "piecewise",
    show: false,
    dimension: 1,
    seriesIndex: 0,
    pieces: [
      {
        gt: 1,
        lt: 3,
        color: "rgba(0, 180, 0, 0.5)"
      },
      {
        gt: 5,
        lt: 7,
        color: "rgba(0, 180, 0, 0.5)"
      }
    ]
  },
  series: generateSeriesList() as any
};

const BumpChart = () => {
  const [eChart1, setEChart1] = useState<echarts.EChartsType | null>(null);

  const [option, setOption] = useState<any>({
    title: {
      text: "Bump Chart (Ranking)"
    },
    tooltip: {
      trigger: "item"
    },
    grid: {
      left: 30,
      right: 110,
      bottom: 30,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: "category",
      splitLine: {
        show: true
      },
      axisLabel: {
        margin: 30,
        fontSize: 16
      },
      boundaryGap: false,
      data: years
    },
    yAxis: {
      type: "value",
      axisLabel: {
        margin: 30,
        fontSize: 16,
        formatter: "#{value}"
      },
      inverse: true,
      interval: 1,
      min: 1,
      max: names.length
    },
    series: generateSeriesList() as any
  });

  function rotate(val: any) {
    console.log(val);
    const Angle = val;
    eChart1?.setOption({
      series: [
        {
          startAngle: Angle
        }
      ]
    });
  }

  const eChart = useRef(null);

  useEffect(() => {
    // var chartDom = document.getElementById("main")!;
    const chartDom = eChart.current;
    const eChart1 = echarts.init(chartDom);
    option && eChart1.setOption(option);
    setEChart1(eChart1);
    return () => {};
  }, [option]);

  return (
    <>
      <label className="block">Rotate</label>
      <input
        type="range"
        onChange={(e) => {
          rotate(e.target.value);
        }}
      />
      <div ref={eChart} id="echart-1" className="h-96"></div>
      {/* <ReactECharts option={option} /> */}
    </>
  );
};

export default BumpChart;
