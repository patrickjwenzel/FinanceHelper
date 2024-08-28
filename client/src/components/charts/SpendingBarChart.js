import { BarChart } from "@mui/x-charts/BarChart";

export default function SpendingBarChart(props) {
    const valueFormatter = (value) => {
        let str = value < 0 ? "-$" : "$";
        str += `${Math.round(value * 100) / 100}`;

        return str;
    };

    const chartSetting = {
        height: 400,
    };

    return (
        props.data && (
            <BarChart
                dataset={props.data?.dataSet || props.data}
                xAxis={[
                    {
                        scaleType: "band",
                        dataKey: "date",
                        tickPlacement: "middle",
                        tickLabelPlacement: "middle",
                    },
                ]}
                series={
                    props.data?.chartSettings || [
                        {
                            dataKey: "amount",
                            valueFormatter,
                            label: props.label,
                        },
                    ]
                }
                {...chartSetting}
                onAxisClick={
                    props.onAxisClick
                        ? (e, d) => props.onAxisClick(e, d)
                        : () => {}
                }
            />
        )
    );
}
