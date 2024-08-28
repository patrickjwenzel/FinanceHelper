import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CustomDatePicker(props) {
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        if (cleared) {
            setCleared(false);
            props.onChange(null);
        }
    }, [cleared]);

    return (
        <DatePicker
            disableFuture
            id={props.id}
            label={props.label}
            minDate={props.minDate}
            value={props.value}
            onChange={(value) => props.onChange(value)}
            views={props.views}
            slotProps={{
                field: {
                    clearable: true,
                    onClear: () => setCleared(true),
                },
            }}
        />
    );
}
