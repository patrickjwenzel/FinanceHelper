import { useState } from "react";
import Box from "@mui/material/Box";

import SpendingBarChart from "../charts/SpendingBarChart";
import SpendingPieChart from "../charts/SpendingPieChart";

export default function RecurringTab(props) {
    const getChartLabel = () => {
        switch (props.selectedBillType) {
            case "all":
                return "Utilities and Subscriptions";
            case "utilities":
                return "Utilities";
            case "subscriptions":
                return "Subscriptions";
        }
    };

    return (
        <Box
            sx={{
                marginTop: 2,
                marginLeft: 2,
                width: "100%",
            }}
        >
            {props.billChartType === "bar" && (
                <SpendingBarChart data={props.data} label={getChartLabel()} />
            )}
            {props.billChartType === "pie" && (
                <SpendingPieChart
                    data={props.data}
                    usePropsData
                    label={getChartLabel()}
                />
            )}
        </Box>
    );
}
