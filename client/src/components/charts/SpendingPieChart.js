import { useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function SpendingPieChart(props) {
    const valueFormatter = (item) => {
        const value = item.value;
        let str = value < 0 ? "-$" : "$";
        str += `${Math.round(value * 100) / 100}`;

        return str;
    };

    useEffect(() => {
        if (!props.usePropsData) {
            if (props.data) {
                let tempDataset = props.data.chartData;

                if (props.pageCount) {
                    const mult = props.page * 6;
                    tempDataset = tempDataset.slice(mult - 6, mult);
                }

                props.setDataset(tempDataset);
            } else {
                props.setDataset(null);
            }
        }
    }, [props.data, props.pageCount, props.page]);

    return (
        (props.dataset || (props.usePropsData && props.data?.dataSet)) && (
            <PieChart
                height={400}
                series={[
                    {
                        data: props.usePropsData
                            ? props.data.dataSet
                            : props.dataset,
                        valueFormatter,
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
