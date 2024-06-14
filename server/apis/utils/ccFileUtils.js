const _ = require("lodash");
const moment = require("moment");

const bankFileUtils = require("./bankFileUtils");
const commonUtils = require("./commonUtils");
const env = require("../../env");

function ccFileAnalysis(
    file,
    lines,
    req,
    prefix,
    noPrefixFunc,
    dateIndex,
    amountIndex,
    shouldSplit,
    excludes
) {
    const fileNoPrefix = noPrefixFunc(prefix, file);
    const sum = {};
    const isMonthly = req.params.period === "monthly";
    const of = isMonthly ? "month" : "week";
    const shouldIterate = bankFileUtils.shouldPass(req, fileNoPrefix, "month");

    if (shouldIterate) {
        sum.insights = {};
        let splitLines = lines.split("\n");
        splitLines.shift();
        splitLines.pop();

        _.forEach(splitLines, (line) => {
            const splitLine = line.split(",");
            if (
                bankFileUtils.shouldBeIncluded(splitLine, excludes, amountIndex)
            ) {
                const date = commonUtils.getDate(
                    splitLine,
                    dateIndex,
                    shouldSplit
                );
                const shouldAdd = bankFileUtils.shouldPass(req, date, of);

                const lineName = splitLine[2].split(" ");
                let isPeacock = false;
                if (lineName.length === 3) {
                    const newName = `${lineName.shift()} ${lineName.pop()}`;
                    isPeacock = Boolean(env.vars.SUBSCRIPTIONS[newName]);
                }
                const isRecurringPayment =
                    Boolean(env.vars.UTILITIES[splitLine[2]]) ||
                    Boolean(env.vars.SUBSCRIPTIONS[splitLine[2]]) ||
                    isPeacock;

                if (shouldAdd && !isRecurringPayment) {
                    const startOf = moment(date)
                        .startOf(of)
                        .format("YYYY-MM-DD");

                    let total = parseFloat(splitLine[amountIndex]);
                    total = Boolean(total)
                        ? total
                        : parseFloat(splitLine[amountIndex + 1]);

                    sum.date = startOf;

                    const index = req.params.insight === "category" ? 3 : 2;
                    const insight = splitLine[index];

                    if (sum.insights[insight] === undefined) {
                        sum.insights[insight] = total;
                    } else {
                        sum.insights[insight] += total;
                    }
                }
            }
        });
    }

    return sum;
}

function findNewName(name) {
    const stores = env.vars.STORES;
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        if (name.includes(store.toMatch)) {
            return store.newName;
        }
    }

    return name;
}

module.exports.ccFileAnalysis = ccFileAnalysis;
module.exports.findNewName = findNewName;
