import { useState } from "react";
import Box from "@mui/material/Box";
import * as MUIIcons from "@mui/icons-material";

import MainBody from "../MainBody";
import TabMenu from "./TabMenu";

export default function TopMenu() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [period, setPeriod] = useState("monthly");
    const [data, setData] = useState(null);

    const tabs = [
        {
            icon: <MUIIcons.Insights />,
            label: "Analysis",
        },
        {
            icon: <MUIIcons.ShoppingCartCheckout />,
            label: process.env.REACT_APP_SPENDING_NAME,
        },
        {
            icon: <MUIIcons.AccountBalance />,
            label: process.env.REACT_APP_BANK_NAME,
        },
        {
            icon: <MUIIcons.RotateRight />,
            label: process.env.REACT_APP_RECURRING_PAYMENTS,
        },
    ];

    const handleChange = (event, newTab) => {
        setData(null);
        setSelectedTab(newTab);
        setPeriod("monthly");
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
            <MainBody
                selectedTab={selectedTab}
                period={period}
                setPeriod={setPeriod}
                data={data}
                setData={setData}
            />
        </Box>
    );
}
