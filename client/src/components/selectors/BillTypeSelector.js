import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";

export default function BillTypeSelector(props) {
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
                            props.billType === "all" ? "#1976D2" : "gray",
                    }}
                    onClick={() => props.setBillType("all")}
                >
                    All
                </Button>
                <Button
                    sx={{
                        backgroundColor:
                            props.billType === "subscriptions"
                                ? "#2380BF"
                                : "gray",
                    }}
                    onClick={() => props.setBillType("subscriptions")}
                >
                    Subscriptions
                </Button>
                <Button
                    sx={{
                        backgroundColor:
                            props.billType === "utilities" ? "#1976D2" : "gray",
                    }}
                    onClick={() => props.setBillType("utilities")}
                >
                    Utilities
                </Button>
            </ButtonGroup>
        </Box>
    );
}
