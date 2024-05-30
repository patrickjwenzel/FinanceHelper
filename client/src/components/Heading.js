import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Heading(props) {
    return (
        <Box sx={{ textAlign: "left" }}>
            <Typography variant="h4" sx={{ color: "white" }}>
                {props.heading}
            </Typography>
        </Box>
    );
}
