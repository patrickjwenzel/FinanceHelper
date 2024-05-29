import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import axios from "axios";

import PeriodSelector from "./PeriodSelector";

const _ = require("lodash");
const boy = moment("01/01/2024");

export default function SideFilter(props) {
    const [selectedDates, setSelectedDates] = useState({
        min: null,
        max: null,
    });

    useEffect(() => {
        props.setData(null);
        let url = "";

        if (props.selectedTab === 0) {
            url += `/analysis/${props.period}`;

            if (selectedDates.min) {
                url += `/min/${moment(selectedDates.min).format("YYYY-MM-DD")}`;
            }

            if (selectedDates.max) {
                url += `/max/${moment(selectedDates.max).format("YYYY-MM-DD")}`;
            }
        }

        axios.get(url).then((response) => {
            props.setData(response.data);
        });
    }, [selectedDates, props.period]);

    return (
        <>
            <Box
                sx={{
                    border: "3px solid #2380BF",
                    borderRadius: 15,
                    marginTop: 5,
                }}
            >
                <Box sx={{ flexGrow: 1, margin: "8%" }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <DatePicker
                                id="min-date"
                                label="Min Date"
                                disableFuture
                                minDate={boy}
                                value={selectedDates.min}
                                onChange={(value) => {
                                    const tempSelectedDates =
                                        _.cloneDeep(selectedDates);
                                    tempSelectedDates.min = moment(value);
                                    setSelectedDates(tempSelectedDates);
                                }}
                                views={["month", "year"]}
                                // slotProps={
                                //     {
                                //         field: { clearable: true, onClear: () => setCleared(true) },
                                //     }
                                // }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                id="max-date"
                                label="Max Date"
                                disableFuture
                                minDate={selectedDates.min || boy}
                                value={selectedDates.max}
                                onChange={(value) => {
                                    const tempSelectedDates =
                                        _.cloneDeep(selectedDates);
                                    tempSelectedDates.max = moment(value);
                                    setSelectedDates(tempSelectedDates);
                                }}
                                views={["month", "year"]}
                                // slotProps={
                                //     {
                                //         field: { clearable: true, onClear: () => setCleared(true) },
                                //     }
                                // }
                            />
                        </Grid>
                    </Grid>
                    <PeriodSelector
                        period={props.period}
                        setPeriod={props.setPeriod}
                    />
                </Box>
            </Box>
        </>
    );
}
