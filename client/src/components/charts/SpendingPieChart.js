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
                    if (tempDataset[j].value < tempDataset[m].value) {
                        m = j;
                    }

                    let temp = tempDataset[m];
                    tempDataset[m] = tempDataset[i];
                    tempDataset[i] = temp;
                }
            }

            props.setDataset(tempDataset);
        } else {
            props.setDataset(null);
        }
    }, [props.data]);

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
                slotProps={{
                    legend: {
                        hidden: props.hidden,
                    },
                }}
                sx={{
                    marginRight: 20,
                    marginTop: 2,
                }}
            />
        )
    );
}
