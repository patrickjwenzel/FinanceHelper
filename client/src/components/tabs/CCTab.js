import { useState } from "react";
import Box from "@mui/material/Box";
import * as MUIIcons from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";

import TabMenu from "../TabMenu";
import SpendingBarChart from "../charts/SpendingBarChart";
import SpendingPieChart from "../charts/SpendingPieChart";

export default function CCTab(props) {
    const [dataset, setDataset] = useState(null);
    const [page, setPage] = useState(1);

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
        props.setSelectedInsight(newTab);
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
                selectedTab={props.selectedInsight}
                setSelectedTab={props.setSelectedInsight}
                tabs={tabs}
                handleChange={handleChange}
                centered={false}
            />
            {props.selectedInsight === 0 && (
                <SpendingBarChart
                    data={props.data}
                    label={`${process.env.REACT_APP_CC_NAME} Spending`}
                />
            )}
            {props.selectedInsight === 1 && (
                <SpendingPieChart
                    data={props.data}
                    dataset={dataset}
                    setDataset={setDataset}
                    selectedTab={props.selectedInsight}
                    setSelectedTab={props.setSelectedInsight}
                />
            )}
            {props.selectedInsight === 2 && (
                <>
                    {props.pageCount && (
                        <div
                            style={{
                                alignItems: "center",
                                alignContent: "center",
                                position: "relative",
                                marginLeft: "30%",
                            }}
                        >
                            <Pagination
                                count={props.pageCount}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                            />
                        </div>
                    )}
                    <SpendingPieChart
                        data={props.data}
                        dataset={dataset}
                        setDataset={setDataset}
                        pageCount={props.pageCount}
                        page={page}
                    />
                </>
            )}
        </Box>
    );
}
