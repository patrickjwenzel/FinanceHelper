import Box from "@mui/material/Box";

import SpendingBarChart from "../charts/SpendingBarChart";
import SavingsLineChart from "../charts/SavingsLineChart";
import SpendingTab from "./SpendingTab";
import RecurringTab from "./RecurringTab";

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
            {props.selectedTab === 0 && (
                <SpendingBarChart data={props.data} label="Cash Flow ($)" />
            )}
            {props.selectedTab === 1 && (
                <SpendingTab
                    selectedInsight={props.selectedInsight}
                    setSelectedInsight={props.setSelectedInsight}
                    selectedSpendingDate={props.selectedSpendingDate}
                    setSelectedSpendingDate={props.setSelectedSpendingDate}
                    data={props.data}
                    period={props.period}
                    pageCount={props.pageCount}
                />
            )}
            {props.selectedTab === 2 && <SavingsLineChart data={props.data} />}
            {props.selectedTab === 3 && (
                <RecurringTab
                    data={props.data}
                    billChartType={props.billChartType}
                />
            )}
        </Box>
    );
}
