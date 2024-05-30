import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import Grid from "@mui/material/Grid";
import axios from "axios";

import PeriodSelector from "./PeriodSelector";
import DateRange from "./DateRange";
import CustomDatePicker from "./CustomDatePicker";

const today = moment();
const MINIMUM_DATE = moment("01/01/2024");

export default function SideFilter(props) {
    const [selectedDates, setSelectedDates] = useState({
        min: null,
        max: null,
    });

    const addTabAndDatesToURL = (tab) => {
        let url = `/${tab}/${props.period}`;
        if (selectedDates.min) {
            url += `/min/${moment(selectedDates.min).format("YYYY-MM-DD")}`;
        }

        if (selectedDates.max) {
            url += `/max/${moment(selectedDates.max).format("YYYY-MM-DD")}`;
        }
        return url;
    };

    const addInsightToURL = (selectedInsight) => {
        return (
            `/insight/${selectedInsight === 1 ? "category" : "place"}` +
            `/period/${props.period}/date/${moment(
                props.selectedCCDate || today
            ).format("YYYY-MM-DD")}`
        );
    };

    useEffect(() => {
        props.setData(null);
        props.setPageCount(null);
        let url = "";

        if (props.selectedTab === 0) {
            url = addTabAndDatesToURL("analysis");
        } else if (props.selectedTab === 1) {
            url += "ccTab";

            ///ccTab/insight/:insight/period/:period/date/:date
            if (props.selectedInsight === 0) {
                url += addTabAndDatesToURL("overall");
            } else {
                url += addInsightToURL(props.selectedInsight);
            }
        }

        axios.get(url).then((response) => {
            props.setData(response.data);
            if (
                response.data.length &&
                props.selectedTab === 1 &&
                props.selectedInsight !== 0
            ) {
                console.log(response);
                const numInsights = Object.keys(
                    response.data[0].insights
                ).length;
                console.log(numInsights);
                let pageCount = Math.floor(numInsights / 6);
                pageCount += numInsights % 6 ? 1 : 0;
                props.setPageCount(pageCount);
            }
        });
    }, [
        selectedDates,
        props.period,
        props.selectedTab,
        props.selectedInsight,
        props.selectedCCDate,
    ]);

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
                    {props.selectedTab === 1 && props.selectedInsight !== 0 && (
                        <CustomDatePicker
                            id="min-date"
                            label="Min Date"
                            minDate={MINIMUM_DATE}
                            value={props.selectedCCDate}
                            onChange={(value) => {
                                props.setSelectedCCDate(
                                    value ? moment(value) : null
                                );
                            }}
                            views={["month", "year"].concat(
                                props.period === "weekly" ? ["day"] : []
                            )}
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
