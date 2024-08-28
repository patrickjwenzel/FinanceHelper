import Box from "@mui/material/Box";

import SavingsLineChart from "../charts/SavingsLineChart";
import SpendingTab from "./SpendingTab";
import RecurringTab from "./RecurringTab";
import AnalysisTab from "./AnalysisTab";

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
            {props.selectedTab === 0 && <AnalysisTab data={props.data} />}
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
                    showPaychecks={props.showPaychecks}
                    billType={props.billType}
                />
            )}
        </Box>
    );
}
