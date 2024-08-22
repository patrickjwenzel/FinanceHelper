import { useState } from "react";

import Box from "@mui/material/Box";
import _ from "lodash";

import SpendingBarChart from "../charts/SpendingBarChart";
import CashFlowGrid from "../grids/CashFlowGrid";

export default function AnalysisTab(props) {
    const [spendingData, setSpendingData] = useState(null);
    const [selectedBar, setSelectedBar] = useState(null);

    const handleClick = (e, d) => {
        if (d.dataIndex === selectedBar) {
            setSpendingData(null);
            setSelectedBar(null);
        } else {
            const tempSpendingData = {
                ps: { total: 0, places: [] },
                ns: { total: 0, places: [] },
            };
            const places = _.find(
                props.data.storeSums,
                (place) => place.date === d.axisValue
            ).places;

            _.forEach(Object.keys(places), (place) => {
                const amt = Math.round(places[place] * 100) / 100;
                const pl = amt >= 0 ? "ps" : "ns";

                tempSpendingData[pl].places.push({
                    id: tempSpendingData[pl].places.length + 1,
                    place: place,
                    amount: amt,
                });
                tempSpendingData[pl].total += amt;
            });

            tempSpendingData.ps.places = _.reverse(
                _.sortBy(tempSpendingData.ps.places, "amount")
            );

            tempSpendingData.ns.places = _.sortBy(
                tempSpendingData.ns.places,
                "amount"
            );

            setSpendingData(tempSpendingData);
            setSelectedBar(d.dataIndex);
        }
    };

    return (
        props.data && (
            <Box
                sx={{
                    marginTop: 2,
                    marginLeft: 2,
                    width: "100%",
                }}
            >
                <SpendingBarChart
                    data={props.data.chartData}
                    label="Cash Flow ($)"
                    onAxisClick={handleClick}
                />
                <CashFlowGrid spendingData={spendingData} />
            </Box>
        )
    );
}
