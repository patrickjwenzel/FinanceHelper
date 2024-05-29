import { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";

import CustomDatePicker from "./CustomDatePicker";

const _ = require("lodash");
const boy = moment("01/01/2024");

export default function DateRange(props) {
    const [clearedMin, setClearedMin] = useState(false);
    const [clearedMax, setClearedMax] = useState(false);

    useEffect(() => {
        if (clearedMin) {
            setClearedMin(false);
            updateDates("min", null);
        }
    }, [setClearedMin]);

    useEffect(() => {
        if (clearedMax) {
            setClearedMax(false);
            updateDates("max", null);
        }
    }, [clearedMax]);

    const updateDates = (date, value) => {
        const tempSelectedDates = _.cloneDeep(props.selectedDates);
        tempSelectedDates[date] = value ? moment(value) : null;
        props.setSelectedDates(tempSelectedDates);
    };

    return (
        <>
            <Grid item xs={6}>
                <CustomDatePicker
                    id="min-date"
                    label="Min Date"
                    minDate={boy}
                    value={props.selectedDates.min}
                    onChange={(value) => {
                        updateDates("min", value);
                    }}
                    views={["month", "year"]}
                />
            </Grid>
            <Grid item xs={6}>
                <CustomDatePicker
                    id="max-date"
                    label="Max Date"
                    minDate={props.selectedDates.min || boy}
                    value={props.selectedDates.max}
                    onChange={(value) => {
                        updateDates("max", value);
                    }}
                    views={["month", "year"]}
                />
            </Grid>
        </>
    );
}
