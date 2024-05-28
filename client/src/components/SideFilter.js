import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";

const _ = require("lodash");
const boy = moment("01/01/2024");

const today = moment().format("YYYY-MM-DD");

export default function SideFilter() {
    const [selectedDates, setSelectedDates] = useState({
        min: null,
        max: null,
    });

    return (
        <>
            <Box
                sx={{
                    border: "3px solid #2380BF",
                    borderRadius: 15,
                    marginTop: 5,
                    color: "white",
                }}
                label="hi"
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
                </Box>
            </Box>
        </>
    );
}
