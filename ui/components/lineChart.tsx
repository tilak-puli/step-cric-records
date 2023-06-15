import {CustomBox} from "./HigherOrder/CustomBox";
import {Heading} from "@chakra-ui/react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import _ from "underscore";
import {CurveType} from "recharts/types/shape/Curve";

function roundedMax(data: any[], dataKey: string) {
  return Math.ceil(_.max(data, (d) => d[dataKey])[dataKey] / 10) * 10;
}

export interface LineData {
  key: string;
  name: string;
}

const CHART_COLOR_SCHEME = [
  "#2161b4",
  "#2a9d8f",
  "#e9c46a",
  "#f4a261",
  "#e76f51",
];

const getChartColor = (n: number) => {
  return CHART_COLOR_SCHEME[
  (n % CHART_COLOR_SCHEME.length || CHART_COLOR_SCHEME.length) - 1
    ];
};

export function LineChartBox(props: {
  title: string;
  data: any[];
  lines: LineData[];
  xAxisKey: string;
  width?: number | string;
  xTicks?: number[];
  lineType?: CurveType;
  showDot?: boolean;
  CustomTooltip?: (prop: { active: any; payload: any }) => JSX.Element;
  yAxisMaxDataIndex?: number;
}) {
  return (
    <CustomBox w={["100%", props.width || 1000]} h={500}>
      <Heading m={4} size={"sm"}>
        {props.title}
      </Heading>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey={props.xAxisKey}
            tickCount={Math.min(15, props.data.length)}
            type="number"
            ticks={props.xTicks}
          />
          <YAxis
            type="number"
            dataKey={props.lines[props.yAxisMaxDataIndex || 0]?.key}
            domain={[
              0,
              roundedMax(
                props.data,
                props.lines[props.yAxisMaxDataIndex || 0]?.key
              ),
            ]}
          />
          {props.CustomTooltip ? (
            <Tooltip content={props.CustomTooltip}/>
          ) : (
            <Tooltip/>
          )}
          <Legend/>
          {props.lines.map((line, i) => (
            <Line
              key={i}
              type={props.lineType || "natural"}
              dataKey={line.key}
              name={line.name}
              stroke={getChartColor(i + 1)}
              strokeWidth={3}
              dot={props.showDot}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </CustomBox>
  );
}


export function ComposedChartGraph(props: {
  title: string;
  data: any[];
  lineName: string;
  barName: string;
  barKey: string;
  lineKey: string;
  xAxisKey: string;
  width?: number | string;
  xTicks?: number[];
  showDot?: boolean;
  CustomTooltip?: (prop: { active: any; payload: any }) => JSX.Element;
  yAxisMaxDataIndex?: number;
  onClick?: (data: any) => void;
}) {

  return (
    <CustomBox w={["100%", props.width || 1000]} h={500}>
      <Heading m={4} size={"sm"}>
        {props.title}
      </Heading>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey={props.xAxisKey}
            tickCount={Math.min(15, props.data.length)}
            type="number"
            ticks={props.xTicks}
          />
          <YAxis
            type="number"
            dataKey={props.barKey}
            domain={[
              0,
              roundedMax(
                props.data,
                props.barKey
              ),
            ]}
          />
          {props.CustomTooltip ? (
            <Tooltip content={props.CustomTooltip}/>
          ) : (
            <Tooltip />
          )}
          <Legend/>
          <Bar
            radius={[5, 5, 0, 0]}
            dataKey={props.barKey}
            fill="#E9C46AA1"
            legendType="rect"
            name={props.barName}
            onClick={(x) => props.onClick(x)}
          />
          <Line
            type={"natural"}
            dataKey={props.lineKey}
            name={props.lineName}
            strokeWidth={3}
            dot={props.showDot}
            connectNulls
            strokeLinecap="round"
            stroke="#3B7AD9"
            legendType="rect"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CustomBox>
  );
}
