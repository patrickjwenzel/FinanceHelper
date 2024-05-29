import { useState } from "react";
import Box from "@mui/material/Box";
import SpendingBarChart from "./charts/SpendingBarChart";
import * as MUIIcons from "@mui/icons-material";

import TabMenu from "./TabMenu";

export default function CCTab(props) {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = [
        {
            icon: <MUIIcons.DonutLarge />,
            label: "Overall",
        },
        {
            icon: <MUIIcons.Category />,
            label: "Categories",
        },
        {
            icon: <MUIIcons.LocalOffer />,
            label: "Places",
        },
    ];

    const handleChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    return (
        <Box
            sx={{
                marginTop: 2,
                marginLeft: 2,
                width: "100%",
            }}
        >
            <TabMenu
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={tabs}
                handleChange={handleChange}
                centered={false}
            />
            {selectedTab === 0 && (
                <SpendingBarChart
                    data={props.data}
                    label={`${process.env.REACT_APP_CC_NAME} Spending`}
                />
            )}
        </Box>
    );
}
