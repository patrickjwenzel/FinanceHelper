import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

const _ = require("lodash");

export default function DateRangePicker(props) {
    return (
        <Box sx={{ flexGrow: 1, margin: "8%" }}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <DatePicker
                        id="min-date"
                        label="Min Date"
                        disableFuture
                        minDate={boy}
                        value={props.selectedDates.min}
                        onChange={(value) => {
                            const tempSelectedDates = _.cloneDeep(
                                props.selectedDates
                            );
                            tempSelectedDates.min = moment(value);
                            console.log(value);
                            props.setSelectedDates(tempSelectedDates);
                        }}
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
                        minDate={props.selectedDates.min || boy}
                        value={props.selectedDates.max}
                        onChange={(value) => {
                            const tempSelectedDates = _.cloneDeep(
                                props.selectedDates
                            );
                            tempSelectedDates.max = moment(value);
                            props.setSelectedDates(tempSelectedDates);
                        }}
                        // slotProps={
                        //     {
                        //         field: { clearable: true, onClear: () => setCleared(true) },
                        //     }
                        // }
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
