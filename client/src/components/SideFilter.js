import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import Grid from "@mui/material/Grid";
import axios from "axios";

import PeriodSelector from "./PeriodSelector";
import DateRange from "./DateRange";

const _ = require("lodash");
const boy = moment("01/01/2024");

export default function SideFilter(props) {
    const [selectedDates, setSelectedDates] = useState({
        min: null,
        max: null,
    });

    const [clearedMax, setClearedMax] = useState(false);

    const addTabToURL = (tab) => {
        return `/${tab}/${props.period}`;
    };

    useEffect(() => {
        props.setData(null);
        let url = "";
        console.log(selectedDates);

        if (props.selectedTab === 0) {
            url = addTabToURL("analysis");
        } else if (props.selectedTab === 1) {
            url = addTabToURL("ccTab/overall");
        }

        if (selectedDates.min) {
            url += `/min/${moment(selectedDates.min).format("YYYY-MM-DD")}`;
        }

        if (selectedDates.max) {
            url += `/max/${moment(selectedDates.max).format("YYYY-MM-DD")}`;
        }
        console.log(url);

        axios.get(url).then((response) => {
            props.setData(response.data);
        });
    }, [selectedDates, props.period, props.selectedTab, props.selectedInsight]);

    return (
        <Box
            sx={{
                border: "3px solid #2380BF",
                borderRadius: 15,
                marginTop: 5,
            }}
        >
            <Box sx={{ flexGrow: 1, margin: "8%" }}>
                <Grid container spacing={1}>
                    {(props.selectedTab === 0 ||
                        (props.selectedTab === 1 &&
                            props.selectedInsight === 0)) && (
                        <DateRange
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                        />
                    )}
                </Grid>
                <PeriodSelector
                    period={props.period}
                    setPeriod={props.setPeriod}
                />
            </Box>
        </Box>
    );
}
