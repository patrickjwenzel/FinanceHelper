import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import ChartTab from "./ChartTab";
import SideFilter from "./SideFilter";

const _ = require("lodash");

export default function MainBody(props) {
    const { selectedTab } = props;
    const [data, setData] = useState(null);
    const [period, setPeriod] = useState("monthly");
    const [selectedInsight, setSelectedInsight] = useState(0);
    const [selectedCCDate, setSelectedCCDate] = useState(null);
    const [pageCount, setPageCount] = useState(1);
    const [billType, setBillType] = useState("all");
    const [billChartType, setBillChartType] = useState("bar");
    const [selectedBillDate, setSelectedBillDate] = useState(null);

    return (
        <Box sx={{ flexGrow: 1, marginX: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs>
                    <SideFilter
                        selectedTab={selectedTab}
                        setData={setData}
                        period={period}
                        setPeriod={setPeriod}
                        selectedCCDate={selectedCCDate}
                        setSelectedCCDate={setSelectedCCDate}
                        selectedInsight={selectedInsight}
                        setPageCount={setPageCount}
                        billType={billType}
                        setBillType={setBillType}
                        billChartType={billChartType}
                        setBillChartType={setBillChartType}
                        selectedBillDate={selectedBillDate}
                        setSelectedBillDate={setSelectedBillDate}
                    />
                </Grid>
                <Grid item xs={8}>
                    <ChartTab
                        data={data}
                        selectedTab={selectedTab}
                        period={period}
                        setPeriod={setPeriod}
                        selectedInsight={selectedInsight}
                        setSelectedInsight={setSelectedInsight}
                        selectedCCDate={selectedCCDate}
                        pageCount={pageCount}
                        billType={billType}
                        setBillType={setBillType}
                        billChartType={billChartType}
                        setBillChartType={setBillChartType}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
