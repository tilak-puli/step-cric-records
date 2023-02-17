import { CustomBox } from "./HigherOrder/CustomBox";
import { Heading } from "@chakra-ui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import _ from "underscore";
import { CurveType } from "recharts/types/shape/Curve";

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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={props.xAxisKey}
            tickCount={Math.min(15, props.data.length)}
            type="number"
            ticks={props.xTicks}
          />
          <YAxis
            type="number"
            dataKey={props.lines[props.yAxisMaxDataIndex]?.key}
            domain={[
              0,
              roundedMax(props.data, props.lines[props.yAxisMaxDataIndex]?.key),
            ]}
          />
          {props.CustomTooltip ? (
            <Tooltip content={props.CustomTooltip} />
          ) : (
            <Tooltip />
          )}
          <Legend />
          {props.lines.map((line, i) => (
            <Line
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
