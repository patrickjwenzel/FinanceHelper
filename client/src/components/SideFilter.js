import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import Grid from "@mui/material/Grid";
import axios from "axios";

import PeriodSelector from "./selectors/PeriodSelector";
import DateRange from "./dates/DateRange";
import CustomDatePicker from "./dates/CustomDatePicker";
import BillTypeSelector from "./selectors/BillTypeSelector";
import BillChartTypeSelector from "./selectors/BillChartTypeSelector";
import PaycheckSelectors from "./selectors/PaycheckSelectors";

const today = moment();
const MINIMUM_DATE = moment("01/01/2024");

export default function SideFilter(props) {
    const [selectedDates, setSelectedDates] = useState({
        min: null,
        max: null,
    });
    const [includeSecondary, setIncludeSecondary] = useState(false);

    const addTabToURL = (tab) => {
        let url = `/${tab}/${props.period}`;

        return url;
    };

    const addDatesToURL = () => {
        let newURL = "";
        if (selectedDates.min) {
            newURL += `/min/${moment(selectedDates.min).format("YYYY-MM-DD")}`;
        }

        if (selectedDates.max) {
            newURL += `/max/${moment(selectedDates.max).format("YYYY-MM-DD")}`;
        }
        return newURL;
    };

    const addInsightToURL = (selectedInsight) => {
        return (
            `/insight/${selectedInsight === 1 ? "category" : "place"}` +
            `/period/${props.period}/date/${moment(
                props.selectedSpendingDate || today
            ).format("YYYY-MM-DD")}`
        );
    };

    const addBillDateToURL = () => {
        if (props.billChartType === "pie") {
            return `/date/${moment(props.selectedBillDate || today).format(
                "YYYY-MM-DD"
            )}`;
        } else {
            return props.selectedBillDate
                ? `/date/${moment(props.selectedBillDate).format("YYYY-MM-DD")}`
                : "";
        }
    };

    useEffect(() => {
        props.setData(null);
        props.setPageCount(null);
        let url = "";

        if (props.selectedTab === 0) {
            url = addTabToURL("analysis");
            url += addDatesToURL(url);
        } else if (props.selectedTab === 1) {
            url += "spendingTab";

            if (props.selectedInsight === 0) {
                url += addTabToURL("overall");
                url += addDatesToURL(url);
            } else {
                url += addInsightToURL(props.selectedInsight);
            }
        } else if (props.selectedTab === 2) {
            url = addTabToURL("bank");
            url += addDatesToURL(url);
        } else if (props.selectedTab === 3) {
            url += `/recurring/${props.billChartType}`;
            url += `/${props.billType}`;
            url += addBillDateToURL();
            url += `/showPaychecks/${props.showPaychecks}`;
            url += `/includeSecondary/${includeSecondary}`;
        }

        if (url) {
            axios.get(url).then((response) => {
                props.setData(response.data);
                if (
                    response.data?.chartData?.length &&
                    props.selectedTab === 1 &&
                    props.selectedInsight !== 0
                ) {
                    const numInsights = Object.keys(
                        response.data.chartData
                    ).length;

                    let pageCount = Math.floor(numInsights / 6);

                    pageCount += numInsights % 6 ? 1 : 0;
                    props.setPageCount(pageCount);
                }
            });
        }
    }, [
        selectedDates,
        props.period,
        props.selectedTab,
        props.selectedInsight,
        props.selectedSpendingDate,
        props.billType,
        props.billChartType,
        props.selectedBillDate,
        props.showPaychecks,
        includeSecondary,
    ]);

    return (
        <Box
            sx={{
                border: "3px solid #2380BF",
                borderRadius: 15,
                marginTop: 5,
            }}
        >
            <Box sx={{ flexGrow: 1, margin: "8%" }}>
                <Grid container spacing={1}>
                    {(props.selectedTab === 0 ||
                        (props.selectedTab === 1 &&
                            props.selectedInsight === 0) ||
                        props.selectedTab === 2) && (
                        <DateRange
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                            selectedTab={props.selectedTab}
                            views={["month", "year"].concat(
                                props.selectedTab === 2 &&
                                    props.period === "daily"
                                    ? ["day"]
                                    : []
                            )}
                        />
                    )}
                    {props.selectedTab === 1 && props.selectedInsight !== 0 && (
                        <CustomDatePicker
                            id="min-spending-date"
                            label="Min Date"
                            minDate={MINIMUM_DATE}
                            value={props.selectedSpendingDate}
                            onChange={(value) => {
                                props.setSelectedSpendingDate(
                                    value ? moment(value) : null
                                );
                            }}
                            views={["month", "year"].concat(
                                props.period === "weekly" ? ["day"] : []
                            )}
                        />
                    )}
                </Grid>
                {props.selectedTab !== 3 && (
                    <PeriodSelector
                        period={props.period}
                        setPeriod={props.setPeriod}
                    />
                )}
                {props.selectedTab === 3 && (
                    <>
                        <CustomDatePicker
                            id="min-bill-date"
                            label="Min Date"
                            minDate={MINIMUM_DATE}
                            value={props.selectedBillDate}
                            onChange={(value) => {
                                props.setSelectedBillDate(
                                    value ? moment(value) : null
                                );
                            }}
                            views={["month", "year"]}
                        />
                        <BillTypeSelector
                            billType={props.billType}
                            setBillType={props.setBillType}
                        />
                        <BillChartTypeSelector
                            billChartType={props.billChartType}
                            setBillChartType={props.setBillChartType}
                            setData={props.setData}
                        />
                        {props.billChartType === "bar" &&
                            props.billType === "all" && (
                                <PaycheckSelectors
                                    showPaychecks={props.showPaychecks}
                                    setShowPaychecks={props.setShowPaychecks}
                                    includeSecondary={includeSecondary}
                                    setIncludeSecondary={setIncludeSecondary}
                                />
                            )}
                    </>
                )}
            </Box>
        </Box>
    );
}
