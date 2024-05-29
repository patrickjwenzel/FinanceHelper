import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CashFlowChart from "./charts/CashFlowChart";

const _ = require("lodash");

export default function ChartTab(props) {
    return (
        <Box
            sx={{
                border: "3px solid #2380BF",
                borderRadius: 15,
                marginTop: 5,
                width: "100%",
            }}
            textAlign="center"
        >
            {props.selectedTab === 0 && <CashFlowChart data={props.data} />}
        </Box>
    );
}
