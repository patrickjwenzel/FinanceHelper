import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import ChartTab from "./tabs/ChartTab";
import SideFilter from "./SideFilter";

export default function MainBody(props) {
    const [selectedInsight, setSelectedInsight] = useState(0);
    const [selectedSpendingDate, setSelectedSpendingDate] = useState(null);
    const [pageCount, setPageCount] = useState(1);
    const [billType, setBillType] = useState("all");
    const [billChartType, setBillChartType] = useState("bar");
    const [selectedBillDate, setSelectedBillDate] = useState(null);
    const [showPaychecks, setShowPaychecks] = useState(false);

    return (
        <Box sx={{ flexGrow: 1, marginX: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs>
                    <SideFilter
                        selectedTab={props.selectedTab}
                        setData={props.setData}
                        period={props.period}
                        setPeriod={props.setPeriod}
                        selectedSpendingDate={selectedSpendingDate}
                        setSelectedSpendingDate={setSelectedSpendingDate}
                        selectedInsight={selectedInsight}
                        setPageCount={setPageCount}
                        billType={billType}
                        setBillType={setBillType}
                        billChartType={billChartType}
                        setBillChartType={setBillChartType}
                        selectedBillDate={selectedBillDate}
                        setSelectedBillDate={setSelectedBillDate}
                        showPaychecks={showPaychecks}
                        setShowPaychecks={setShowPaychecks}
                    />
                </Grid>
                <Grid item xs={8}>
                    <ChartTab
                        data={props.data}
                        selectedTab={props.selectedTab}
                        period={props.period}
                        setPeriod={props.setPeriod}
                        selectedInsight={selectedInsight}
                        setSelectedInsight={setSelectedInsight}
                        selectedSpendingDate={selectedSpendingDate}
                        pageCount={pageCount}
                        billType={billType}
                        setBillType={setBillType}
                        billChartType={billChartType}
                        setBillChartType={setBillChartType}
                        showPaychecks={showPaychecks}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
