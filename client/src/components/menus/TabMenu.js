import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const _ = require("lodash");

export default function TabMenu(props) {
    return (
        <Box sx={{ color: "white" }}>
            <Tabs
                value={props.selectedTab}
                onChange={props.handleChange}
                centered={props.centered}
                textColor="inherit"
            >
                {_.map(props.tabs, (tab, i) => (
                    <Tab
                        icon={tab.icon}
                        label={tab.label}
                        value={i}
                        key={`${tab.label}${i}`}
                    />
                ))}
            </Tabs>
        </Box>
    );
}
