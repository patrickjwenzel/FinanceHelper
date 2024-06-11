import Grid from "@mui/material/Grid";

import MoneyBox from "./MoneyBox";

const _ = require("lodash");

export default function MoneyGrid(props) {
    const getGridItems = () => [
        <MoneyBox
            label={`${
                props.billChartType === "pie" ? "Total" : "Average"
            } Bills`}
            data={props.data}
            average="billAvg"
        />,
        props.showPaychecks && props.billType === "all" ? (
            <MoneyBox
                label="Average Income"
                data={props.data}
                average="incomeAvg"
            />
        ) : null,
        props.showPaychecks && props.billType === "all" ? (
            <MoneyBox
                label="Average Difference"
                data={props.data}
                average="diffAvg"
            />
        ) : null,
    ];
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
