import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function SpendingBarChart(props) {
    const [dataset, setDataSet] = useState(null);

    const chartSetting = {
        series: [{ dataKey: "amount", label: props.label }],
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
