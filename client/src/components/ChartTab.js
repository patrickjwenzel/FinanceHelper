import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

const _ = require("lodash");

export default function ChartTab(props) {
    const [dataset, setDataSet] = useState(null);

    const chartSetting = {
        series: [{ dataKey: "amount", label: "Cash Flow ($)" }],
        height: 400,
    };

    useEffect(() => {
        if (props.data) {
            const tempDataset = [];
            _.forEach(Object.keys(props.data), (key) => {
                tempDataset.push({
                    amount: props.data[key],
                    month: key,
                });
            });
            setDataSet(tempDataset);
        } else {
            setDataSet(null);
        }
    }, [props.data]);

    useEffect(() => {}, [dataset]);
    console.log(dataset);
    return (
        dataset && (
            <Box
                sx={{
                    border: "3px solid #2380BF",
                    borderRadius: 15,
                    marginTop: 5,
                    width: "100%",
                }}
                textAlign="center"
            >
                <BarChart
                    dataset={dataset}
                    xAxis={[
                        {
                            scaleType: "band",
                            dataKey: "month",
                            tickPlacement: "middle",
                            tickLabelPlacement: "middle",
                        },
                    ]}
                    series={[
                        {
                            dataKey: "amount",
                            label: "Seoul rainfall",
                            // valueFormatter,
                        },
                    ]}
                    {...chartSetting}
                />
            </Box>
        )
    );
}
