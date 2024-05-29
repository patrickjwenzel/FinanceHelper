import { useState } from "react";
import Box from "@mui/material/Box";
import * as MUIIcons from "@mui/icons-material";

import MainBody from "./MainBody";
import TabMenu from "./TabMenu";

export default function TopMenu() {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = [
        {
            icon: <MUIIcons.Insights />,
            label: "Analysis",
        },
        {
            icon: <MUIIcons.CreditCard />,
            label: process.env.REACT_APP_CC_NAME,
        },
        {
            icon: <MUIIcons.AccountBalance />,
            label: process.env.REACT_APP_BANK_NAME,
        },
    ];

    const handleChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <TabMenu
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={tabs}
                handleChange={handleChange}
                centered
            />
            <MainBody selectedTab={selectedTab} />
        </Box>
    );
}
