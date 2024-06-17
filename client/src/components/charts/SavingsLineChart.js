import { LineChart } from "@mui/x-charts/LineChart";
import moment from "moment";

const _ = require("lodash");

export default function SavingsLineChart(props) {
    const valueFormatter = (value) => {
        return moment(value).format("YYYY-MM-DD");
    };

    return (
        props.data && (
            <LineChart
                height={400}
                xAxis={[
                    {
                        id: props.data.xAxis[0].id,
                        scaleType: props.data.xAxis[0].scaleType,
                        data: _.map(props.data.xAxis[0].data, (date) =>
                            moment(date)
                        ),
                        valueFormatter,
                    },
                ]}
                series={props.data.series}
            />
        )
    );
}
