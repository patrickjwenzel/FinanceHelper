import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function PaycheckOnSwitch(props) {
    const handleChange = (event) => {
        props.setShowPaychecks(event.target.checked);
    };

    return (
        <Box sx={{ marginTop: 5 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.showPaychecks}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                        size="large"
                    />
                }
                label="Paychecks Included"
                labelPlacement="top"
            />
        </Box>
    );
}
