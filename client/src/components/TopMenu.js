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
            <Box sx={{ color: "white" }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    centered
                    textColor="inherit"
                >
                    {_.map(tabs, (tab, i) => (
                        <Tab
                            icon={tab.icon}
                            label={tab.label}
                            value={i}
                            key={`${tab.label}${i}`}
                        />
                    ))}
                </Tabs>
            </Box>
            <MainBody selectedTab={selectedTab} />
        </Box>
    );
}
