const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const moment = require("moment");

const env = require("../../env");
const recurring = require("../recurring");

function iterateFilesInFolder(
    files,
    folder,
    fileIterator,
    req,
    prefix,
    noPrefixFunc,
    dateIndex,
    amountIndex,
    shouldSplit,
    excludes,
    isInsight = false,
    nameIndex,
    isRecurring = false
) {
    const purchases = [];

    _.forEach(files, (file) => {
        const filePath = path.join(folder, file);
        const fileContents = fs.readFileSync(filePath, "utf-8");

        const totals = fileIterator(
            file,
            fileContents,
            req,
            prefix,
            noPrefixFunc,
            dateIndex,
            amountIndex,
            shouldSplit,
            excludes,
            nameIndex,
            req.params?.type?.toUpperCase()
        );

        if (totals) {
            if (req.params.period === "monthly" || isInsight || isRecurring) {
                purchases.push(totals);
            } else {
                _.forEach(totals, (total) => {
                    purchases.push(total);
                });
            }
        }
    });

    return purchases;
}

function ccFileNoPrefix(prefix, file) {
    const regex = new RegExp(`${env.vars[prefix]}|.CSV`);
    const fileNoPrefix = file.replace(regex, "").substring(0, 8);

    return fileNoPrefix;
}

function iterateBankFolder(location) {
    const bankFolder = path.join(env.vars[location]);
    const bankFiles = fs.readdirSync(bankFolder);

    return {
        folderPath: bankFolder,
        fileNames: bankFiles,
    };
}

function scAndSSFileNoPrefix(prefix, file) {
    const splitName = file.split("-");
    const fileNoPrefix = `${splitName[3]}${splitName[4].substring(0, 2)}01`;

    return fileNoPrefix;
}

function mergeBills(req) {
    req.params.skipSort = true;
    req.params.type = "utilities";
    const utilities = recurring.getRecurringPayments(req);

    req.params.type = "subscriptions";
    const subscriptions = recurring.getRecurringPayments(req);

    if (req.params.chartType === "bar") {
        _.forEach(Object.keys(subscriptions), (date) => {
            utilities[date] += subscriptions[date];
        });
    } else {
        _.forEach(Object.keys(subscriptions.insights), (bill) => {
            if (utilities.insights[bill]) {
                utilities.insights[bill] += subscriptions.insights[bill];
            } else {
                utilities.insights[bill] = subscriptions.insights[bill];
            }
        });
    }

    return req.params.usePie
        ? sortPieChartData(utilities)
        : sortBarChartData(utilities, req);
}

function sortBarChartData(data, req) {
    let tempDataset = [];

    if (Array.isArray(data)) {
        tempDataset = data;
    } else {
        _.forEach(Object.keys(data), (key) => {
            tempDataset.push({
                amount: data[key],
                date: key,
            });
        });
    }

    const length = tempDataset.length;
    let i, j, m;
    for (i = 0; i < length - 1; i++) {
        m = i;
        for (j = i + 1; j < length; j++) {
            const datej =
                req.params.period === "monthly"
                    ? moment(createDate(tempDataset[j].date))
                    : moment(tempDataset[j].date);
            const datemin =
                req.params.period === "monthly"
                    ? moment(createDate(tempDataset[m].date))
                    : moment(tempDataset[m].date);

            if (datej.diff(datemin) < 0) {
                m = j;
            }
        }

        const temp = tempDataset[m];
        tempDataset[m] = tempDataset[i];
        tempDataset[i] = temp;
    }
    return tempDataset;
}

function createDate(d) {
    let date = d;
    date = d.split("/");
    date = `${date[1]}-${date[0]}-01`;
    return date;
}

function sortPieChartData(data) {
    let tempDataset = [];

    _.forEach(Object.keys(data.insights), (insight, i) => {
        tempDataset.push({
            id: i,
            value: data.insights[insight],
            label: insight,
        });
    });

    let i, j, m;
    for (i = 0; i < tempDataset.length - 1; i++) {
        m = i;
        for (j = i + 1; j < tempDataset.length; j++) {
            if (tempDataset[j].value >= tempDataset[m].value) {
                m = j;
            }
        }

        let temp = tempDataset[m];
        tempDataset[m] = tempDataset[i];
        tempDataset[i] = temp;
    }

    return tempDataset;
}

function getDate(splitLine, dateIndex) {
    let newDate = splitLine[dateIndex];

    if (newDate.includes("/")) {
        newDate = newDate.split("/");
        newDate =
            `${newDate[2]}-${padNumber(newDate[0])}` +
            `-${padNumber(newDate[1])}`;
    }

    return newDate;
}

function padNumber(num) {
    let newNum = Number(num);

    return `${newNum < 10 && num.length === 1 ? "0" : ""}${num}`;
}

function findNewName(name) {
    const stores = env.vars.STORES;
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        if (name.toLowerCase().includes(store.toMatch.toLowerCase())) {
            return store.newName;
        }
    }

    return name;
}

module.exports.iterateFilesInFolder = iterateFilesInFolder;
module.exports.ccFileNoPrefix = ccFileNoPrefix;
module.exports.iterateBankFolder = iterateBankFolder;
module.exports.scAndSSFileNoPrefix = scAndSSFileNoPrefix;
module.exports.mergeBills = mergeBills;
module.exports.sortBarChartData = sortBarChartData;
module.exports.sortPieChartData = sortPieChartData;
module.exports.createDate = createDate;
module.exports.getDate = getDate;
module.exports.findNewName = findNewName;
