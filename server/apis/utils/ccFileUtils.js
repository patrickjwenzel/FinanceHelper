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
    const nameIndex = req.params.specific ? 1 : 2;

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
                const date = req.params.specific
                    ? splitLine[dateIndex]
                    : commonUtils.getDate(splitLine, dateIndex, shouldSplit);
                const shouldAdd = bankFileUtils.shouldPass(req, date, of);
                const nameIndexLine = splitLine[nameIndex];

                const lineName = nameIndexLine.split(" ");
                let isPeacock = false;

                if (lineName.length === 3) {
                    const newName = `${lineName.shift()} ${lineName.pop()}`;
                    isPeacock = Boolean(env.vars.SUBSCRIPTIONS[newName]);
                }

                const isRecurringPayment =
                    Boolean(env.vars.UTILITIES[nameIndexLine]) ||
                    Boolean(env.vars.SUBSCRIPTIONS[nameIndexLine]) ||
                    isPeacock;

                const newName = commonUtils.findNewName(nameIndexLine);
                const isSpecific = req.params.specific
                    ? _.includes(req.params.specific, newName)
                    : true;

                if (shouldAdd && !isRecurringPayment && isSpecific) {
                    const startOf = moment(date)
                        .startOf(of)
                        .format("YYYY-MM-DD");

                    let total = parseFloat(splitLine[amountIndex]);
                    total = Boolean(total)
                        ? total
                        : parseFloat(splitLine[amountIndex + 1]);

                    sum.date = startOf;

                    const index = req.params.insight === "category" ? 3 : 2;
                    const insight = req.params.specific
                        ? req.params.specificMatch[req.params.insight]
                        : splitLine[index];

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

module.exports.ccFileAnalysis = ccFileAnalysis;
