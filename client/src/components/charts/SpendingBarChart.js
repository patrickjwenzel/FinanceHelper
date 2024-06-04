import { useState, useEffect } from "react";
import moment from "moment";
import { BarChart } from "@mui/x-charts/BarChart";

const _ = require("lodash");

export default function SpendingBarChart(props) {
    const [dataset, setDataSet] = useState(null);

    const chartSetting = {
        series: [{ dataKey: "amount", label: props.label }],
        height: 400,
    };

    const createDate = (d) => {
        let date = d;
        date = d.split("/");
        date = `${date[1]}-${date[0]}-01`;
        return date;
    };

    useEffect(() => {
        setDataSet(props.data || null);
    }, [props.data]);

    return (
        dataset && (
            <BarChart
                dataset={dataset}
                xAxis={[
                    {
                        scaleType: "band",
                        dataKey: "date",
                        tickPlacement: "middle",
                        tickLabelPlacement: "middle",
                    },
                ]}
                series={[
                    {
                        dataKey: "amount",
                    },
                ]}
                {...chartSetting}
            />
        )
    );
}
