import Box from "@mui/material/Box";

export default function RecurringTab(props) {
    const valueFormatter = (value) => `$${Math.round(value * 100) / 100}`;

    return (
        props.data && (
            <Box
                sx={{
                    border: "3px solid #2380BF",
                    borderRadius: 15,
                    marginTop: 5,
                    width: "100%",
                    color: "white",
                }}
            >
                <div style={{ padding: 10 }}>
                    <h3>{props.label}:</h3>
                    <p>{valueFormatter(props.data.avgs[props.average])}</p>
                </div>
            </Box>
        )
    );
}
