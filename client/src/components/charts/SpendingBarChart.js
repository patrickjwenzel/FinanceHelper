import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function SpendingBarChart(props) {
    const [dataset, setDataSet] = useState(null);

    const valueFormatter = (value) => {
        let str = value < 0 ? "-$" : "$";
        str += `${Math.round(value * 100) / 100}`;

        return str;
    };
    const chartSetting = {
        series: [{ dataKey: "amount", label: props.label, valueFormatter }],
        height: 400,
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
                {...chartSetting}
            />
        )
    );
}
