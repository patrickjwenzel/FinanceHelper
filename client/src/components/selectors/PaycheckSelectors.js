import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function PaycheckSelectors(props) {
    return (
        <Box sx={{ marginTop: 5 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.showPaychecks}
                        onChange={(event) => {
                            props.setShowPaychecks(event.target.checked);
                            if (!event.target.checked) {
                                props.setIncludeSecondary(false);
                            }
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                        size="large"
                    />
                }
                label="Paychecks Included"
                labelPlacement="top"
            />
            <FormControlLabel
                disabled={!props.showPaychecks}
                control={
                    <Checkbox
                        checked={props.includeSecondary}
                        onChange={(event) => {
                            props.setIncludeSecondary(event.target.checked);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                        size="large"
                    />
                }
                label="Include Secondary Paychecks"
                labelPlacement="top"
            />
        </Box>
    );
}
