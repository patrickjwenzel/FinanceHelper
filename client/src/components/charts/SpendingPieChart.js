import { useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function SpendingPieChart(props) {
    useEffect(() => {
        if (props.data && props.data?.chartData) {
            let tempDataset = props.data.chartData;

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
