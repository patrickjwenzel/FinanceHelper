import { useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const _ = require("lodash");

export default function SpendingPieChart(props) {
    useEffect(() => {
        if (props.data && props.data[0]?.insights) {
            let tempDataset = [];

            const insights = props.data[0];

            _.forEach(Object.keys(insights.insights), (insight, i) => {
                tempDataset.push({
                    id: i,
                    value: insights.insights[insight],
                    label: insight,
                });
            });

            let i, j, m;
            for (i = 0; i < tempDataset.length - 1; i++) {
                m = i;
                for (j = i + 1; j < tempDataset.length; j++) {
                    if (tempDataset[j].value >= tempDataset[m].value) {
                        m = j;
                    }

                    let temp = tempDataset[m];
                    tempDataset[m] = tempDataset[i];
                    tempDataset[i] = temp;
                }
            }

            if (props.pageCount) {
                const mult = props.page * 6;
                tempDataset = tempDataset.slice(mult - 6, mult);
            }

            props.setDataset(tempDataset);
        } else {
            props.setDataset(null);
        }
    }, [props.data, props.pageCount, props.page]);

    return (
        props.dataset && (
            <PieChart
                label="help"
                height={400}
                series={[
                    {
                        data: props.dataset,
                    },
                ]}
                sx={{
                    marginRight: 20,
                    marginTop: 2,
                }}
            />
        )
    );
}
