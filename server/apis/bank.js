const _ = require("lodash");
const moment = require("moment");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");
const env = require("../env");

function getBankBalances(req) {
    const purchases = {};

    // Sum up SC Balance
    const scFolderContents = commonUtils.iterateBankFolder("SC_CSV_LOCATION");
    let scBalances = commonUtils.iterateFilesInFolder(
        scFolderContents.fileNames,
        scFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SC_CSV_PREFIX",
        commonUtils.scAndSSFileNoPrefix,
        0,
        4,
        false,
        []
    );

    // Sum up SS Balance
    const ssFolderContents = commonUtils.iterateBankFolder("SS_CSV_LOCATION");
    let ssBalances = commonUtils.iterateFilesInFolder(
        ssFolderContents.fileNames,
        ssFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SS_CSV_PREFIX",
        commonUtils.scAndSSFileNoPrefix,
        0,
        4,
        false,
        []
    );
    scBalances = commonUtils.sortBarChartData(scBalances, req);
    ssBalances = commonUtils.sortBarChartData(ssBalances, req);

    const totalBalances = [];

    _.forEach(scBalances, (balance) => {
        let ssBalance = _.filter(
            ssBalances,
            (ssBalance) => balance.date === ssBalance.date
        )[0];

        if (ssBalance) {
            totalBalances.push({
                date: balance.date,
                total: balance.total + ssBalance.total,
            });
        } else {
            ssBalance = findMostRecentSSBalance(balance, ssBalances);

            if (ssBalance) {
                totalBalances.push({
                    date: balance.date,
                    total: balance.total + ssBalance.total,
                });
            }
        }
    });

    const chartInfo = {
        xAxis: [
            {
                id: "Date",
                data: _.map(totalBalances, (balance) =>
                    req.params.period === "monthly"
                        ? commonUtils.createDate(balance.date)
                        : balance.date
                ),
                scaleType: "time",
            },
        ],
        series: [
            {
                id: "Checking",
                label: env.vars.SC_NAME,
                data: _.map(
                    scBalances,
                    (balance) => Math.round(balance.total * 100) / 100
                ),
            },
            {
                id: "Savings",
                label: env.vars.SS_NAME,
                data: _.map(
                    ssBalances,
                    (balance) => Math.round(balance.total * 100) / 100
                ),
            },
            {
                id: "Total",
                label: "Total",
                data: _.map(
                    totalBalances,
                    (balance) => Math.round(balance.total * 100) / 100
                ),
            },
        ],
    };

    return chartInfo;
}

function findMostRecentSSBalance(scBalance, ssBalances) {
    for (let i = 0; i < ssBalances.length; i++) {
        const ssBalance = ssBalances[i];

        if (moment(ssBalance.date).diff(moment(scBalance.date)) >= 0) {
            return i == 0 ? ssBalance : ssBalances[i - 1];
        }
    }
}

module.exports.getBankBalances = getBankBalances;
