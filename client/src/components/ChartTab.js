import Box from "@mui/material/Box";
import SpendingBarChart from "./charts/SpendingBarChart";
import CCTab from "./CCTab";

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
            {props.selectedTab === 0 && (
                <SpendingBarChart data={props.data} label="Cash Flow ($)" />
            )}
            {props.selectedTab === 1 && (
                <CCTab
                    selectedInsight={props.selectedInsight}
                    setSelectedInsight={props.setSelectedInsight}
                    selectedCCDate={props.selectedCCDate}
                    setSelectedCCDate={props.setSelectedCCDate}
                    data={props.data}
                />
            )}
        </Box>
    );
}
