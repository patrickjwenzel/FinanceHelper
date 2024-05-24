import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import * as MUIIcons from "@mui/icons-material";

const _ = require("lodash");

export default function CCTab() {
    return (
        <Box
            sx={{
                // width: "75%",
                border: "3px solid #2380BF",
                borderRadius: 15,
                marginTop: 5,
                color: "white",
            }}
            textAlign="center"
        >
            <div>Helo</div>
        </Box>
    );
}
