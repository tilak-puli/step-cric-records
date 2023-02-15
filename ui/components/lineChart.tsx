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

export function LineChartBox(props: {
  title: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  width?: number | string;
}) {
  console.log(
    Math.ceil(_.max(props.data, (d) => d[props.dataKey])[props.dataKey]) / 10
  );
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
          <XAxis dataKey={props.xAxisKey} tickCount={15} type="number" />
          <YAxis
            type="number"
            dataKey={props.dataKey}
            domain={[
              0,
              Math.ceil(
                _.max(props.data, (d) => d[props.dataKey])[props.dataKey] / 10
              ) * 10,
            ]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="natural"
            dataKey={props.dataKey}
            stroke="#8884d8"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CustomBox>
  );
}
