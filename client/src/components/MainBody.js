import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import * as MUIIcons from "@mui/icons-material";
import Grid from "@mui/material/Grid";

import ChartTab from "./ChartTab";
import SideFilter from "./SideFilter";

const _ = require("lodash");

export default function MainBody(props) {
    const { selectedTab } = props;
    const [data, setData] = useState(null);

    return (
        <Box sx={{ flexGrow: 1, marginX: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs>
                    <SideFilter
                        selectedTab={selectedTab}
                        data={data}
                        setData={setData}
                    />
                </Grid>
                <Grid item xs={8}>
                    <ChartTab data={data} />
                </Grid>
            </Grid>
        </Box>
    );
}
