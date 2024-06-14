import Grid from "@mui/material/Grid";

import MoneyBox from "./MoneyBox";

const _ = require("lodash");

export default function MoneyGrid(props) {
    const getGridItems = () => {
        let arr = [
            <MoneyBox
                label={`${
                    props.billChartType === "pie" ? "Total" : "Average"
                } Bills`}
                data={props.data}
                average="billAvg"
            />,
        ];

        if (
            props.showPaychecks &&
            props.billType === "all" &&
            props.billChartType === "bar"
        ) {
            arr = arr.concat([
                <MoneyBox
                    label="Average Income"
                    data={props.data}
                    average="incomeAvg"
                />,
                <MoneyBox
                    label="Average Difference"
                    data={props.data}
                    average="diffAvg"
                />,
            ]);
        }

        return arr;
    };

    return (
        props.data && (
            <Grid
                sx={{ flexGrow: 1 }}
                container
                justifyContent="center"
                spacing={4}
            >
                {_.map(getGridItems(), (item, i) => (
                    <Grid key={`MoneyGridItem-${i}`} item>
                        {item}
                    </Grid>
                ))}
            </Grid>
        )
    );
}
