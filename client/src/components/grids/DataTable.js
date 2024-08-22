import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable(props) {
    const columns = [
        { field: "id", headerName: "ID" },
        { field: "place", headerName: "Place", width: 200 },
        {
            field: "amount",
            headerName: "Amount",
            width: 100,
            valueGetter: (value, row) => {
                let str = row.amount < 0 ? "-$" : "$";
                str += `${Math.round(row.amount * 100) / 100}`;

                return str;
            },
        },
    ];

    return (
        props.data && (
            <Box
                sx={{
                    marginY: 5,
                    marginLeft: 2,
                    width: 450,
                }}
            >
                <DataGrid
                    rows={props.data}
                    columns={columns}
                    disableRowSelectionOnClick
                    hideFooter
                />
            </Box>
        )
    );
}
