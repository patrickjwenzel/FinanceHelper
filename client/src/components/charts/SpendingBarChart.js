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
        if (props.data) {
            let tempDataset = [];
            _.forEach(Object.keys(props.data), (key) => {
                tempDataset.push({
                    amount: props.data[key],
                    date: key,
                });
            });

            let i, j, m;
            for (i = 0; i < tempDataset.length - 1; i++) {
                m = i;
                for (j = i + 1; j < tempDataset.length; j++) {
                    const datej =
                        props.period === "monthly"
                            ? moment(createDate(tempDataset[j].date))
                            : moment(tempDataset[j].date);
                    const datemin =
                        props.period === "monthly"
                            ? moment(createDate(tempDataset[m].date))
                            : moment(tempDataset[m].date);

                    if (datej.diff(datemin) < 0) {
                        m = j;
                    }

                    let temp = tempDataset[m];
                    tempDataset[m] = tempDataset[i];
                    tempDataset[i] = temp;
                }
            }
            setDataSet(tempDataset);
        } else {
            setDataSet(null);
        }
    }, [props.data]);

    useEffect(() => {}, [dataset]);

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
                        label: "Seoul rainfall",
                        // valueFormatter,
                    },
                ]}
                {...chartSetting}
            />
        )
    );
}
