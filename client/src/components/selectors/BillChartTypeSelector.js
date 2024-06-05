import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";

export default function BillChartTypeSelector(props) {
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
                            props.billChartType === "bar" ? "#1976D2" : "gray",
                    }}
                    onClick={() => {
                        props.setData(null);
                        props.setBillChartType("bar");
                    }}
                >
                    Bar Chart
                </Button>
                <Button
                    sx={{
                        backgroundColor:
                            props.billChartType === "pie" ? "#1976D2" : "gray",
                    }}
                    onClick={() => {
                        props.setData(null);
                        props.setBillChartType("pie");
                    }}
                >
                    Pie Chart
                </Button>
            </ButtonGroup>
        </Box>
    );
}
