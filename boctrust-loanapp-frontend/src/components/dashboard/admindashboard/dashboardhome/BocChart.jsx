import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiClient from "../../../../lib/axios";
import PageLoader from "../../shared/PageLoader";
import { format, parse } from "date-fns";

const formatMonthYear = (monthString) => {
  const date = parse(monthString, "yyyy-M", new Date());
  return format(date, "MMM, yyyy");
};

const BocChart = ({}) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await apiClient.get(
          `/analytics/monthlyCollectionRepayment`
        );
        const formattedData = data.data.map((item) => ({
          ...item,
          month: formatMonthYear(item.month),
        }));
        console.log(formattedData, "formattedData")
        setData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);
  return data ? (
    <div className="ChartBar">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="collections"
            stroke="#ecaa00"
            fill="#ecaa11"
          />
          <Area
            type="monotone"
            dataKey="disbursement"
            stroke="#ecaa00"
            fill="#ecaa00"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div className="d-flex justify-content-center  py-4">
      <PageLoader width="80px" />
    </div>
  );
};

export default BocChart;
