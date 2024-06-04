import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";

export default function PeriodSelector(props) {
    return (
        <Box sx={{ marginTop: 5 }}>
            <ButtonGroup
                variant="contained"
                aria-label="Basic button group"
                fullWidth
            >
                <Button
                    sx={{
                        backgroundColor:
                            props.period === "monthly" ? "#1976D2" : "gray",
                    }}
                    onClick={() => props.setPeriod("monthly")}
                >
                    Monthly
                </Button>
                <Button
                    sx={{
                        backgroundColor:
                            props.period === "weekly" ? "#1976D2" : "gray",
                    }}
                    onClick={() => props.setPeriod("weekly")}
                >
                    Weekly
                </Button>
            </ButtonGroup>
        </Box>
    );
}
