import { useState } from "react";
import Box from "@mui/material/Box";
import SpendingBarChart from "./charts/SpendingBarChart";



export default function ChartTab(props) {
    return (
        <Box
            sx={{
                marginTop: 2,
                width: "100%",
            }}
        >
            <SpendingBarChart
                data={props.data}
                label={`${process.env.REACT_APP_CC_NAME} Spending`}
            />
        </Box>
    );
}
