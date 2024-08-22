import Box from "@mui/material/Box";
import _ from "lodash";
import Grid from "@mui/material/Grid";

import DataTable from "./DataTable";

export default function CashFlowGrid(props) {
    return (
        props.spendingData && (
            <Box
                sx={{
                    border: "1px solid white",
                    borderRadius: 15,
                    marginY: 5,
                    width: "95%",
                    marginLeft: 2,
                    color: "white",
                }}
                textAlign="center"
            >
                <Grid
                    sx={{ flexGrow: 1 }}
                    container
                    justifyContent="center"
                    spacing={4}
                >
                    <Grid item>
                        <DataTable data={props.spendingData.ps.places} />
                    </Grid>
                    <Grid item>
                        <DataTable data={props.spendingData.ns.places} />
                    </Grid>
                </Grid>
            </Box>
        )
    );
}
