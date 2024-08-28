// Template of how to configure .env file
const vars = {
    CC_CSV_LOCATION: "FILE_LOCATION",
    CC_CSV_PREFIX: "File name before dates",
    CC_EXCLUDE: [{ index: 4, value: "Description" }],
    SC_CSV_LOCATION: "FILE_LOCATION",
    SC_CSV_PREFIX: "File name before dates",
    SC_EXCLUDE: [
        { index: 1, value: "Description" },
        { index: 1, value: "Description" },
    ],
    SC_NAME: "Account name",
    SS_CSV_LOCATION: "FILE_LOCATION",
    SS_CSV_PREFIX: "File name before dates",
    SS_EXCLUDE: [
        { index: 1, value: "Description" },
        { index: 1, value: "Description" },
    ],
    SS_NAME: "Account name",
    CC_PAYMENT: "Name when credit card is paid off",
    PAYCHECKS: {
        primary: ["Paycheck name"],
        secondary: ["Paycheck name"],
    },
    SUBSCRIPTIONS: {
        "Peacock PremPlus": "Peacock",
        "Peacock Premium": "Peacock",
        "Disney Plus": "Disney+",
        "GOOGLE *YouTubePremium": "YouTube Premium",
        "discovery+ Ad-Free": "Discovery+",
        "discovery+": "Discovery+",
        "Spotify USA": "Spotify",
        "Figo Pet Insuran": "Figo",
        "APPLE.COM/BILL": "Apple Subscriptions",
    },
    UTILITIES: {
        TRAVELERS: "Renter's Insurance",
        "XFINITY MOBILE": "Phone",
        "QUANTUM FIBER": "Internet",
        VISIBLE: "Phone",
        "Check Paid": "Rent",
    },
    STORES: [
        {
            toMatch: "STORE'S NAME",
            newName: "Store Name",
        },
    ],
};

module.exports.vars = vars;
