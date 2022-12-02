"use strict";
exports.__esModule = true;
exports.debounce = exports.throttle = exports.isDomainSearch = exports.handleSearchPlatform = exports.isValidJson = exports.resolveSocialMediaLink = exports.isSameAddress = exports.formatBalance = exports.formatValue = exports.getEnumAsArray = exports.formatText = void 0;
var bignumber_js_1 = require("bignumber.js");
var number_1 = require("./number");
var type_1 = require("./type");
exports.formatText = function (string, length) {
    var len = length !== null && length !== void 0 ? length : 12;
    if (string.length <= len) {
        return string;
    }
    if (string.startsWith("0x")) {
        var oriAddr = string, chars = 4;
        return oriAddr.substring(0, chars + 2) + "..." + oriAddr.substring(oriAddr.length - chars);
    }
    else {
        if (string.length > len) {
            return string.substr(0, len) + "...";
        }
    }
    return string;
};
function getEnumAsArray(enumObject) {
    return (Object.keys(enumObject)
        // Leave only key of enum
        .filter(function (x) { return Number.isNaN(Number.parseInt(x)); })
        .map(function (key) { return ({ key: key, value: enumObject[key] }); }));
}
exports.getEnumAsArray = getEnumAsArray;
exports.formatValue = function (value) {
    if (!value)
        return "";
    return formatBalance(value.value, value.decimals, 5);
};
function formatBalance(rawValue, decimals, significant, isPrecise) {
    var _a, _b;
    if (rawValue === void 0) { rawValue = "0"; }
    if (decimals === void 0) { decimals = 0; }
    if (significant === void 0) { significant = decimals; }
    if (isPrecise === void 0) { isPrecise = false; }
    var balance = new bignumber_js_1.BigNumber(rawValue);
    if (balance.isNaN())
        return "0";
    var base = number_1.pow10(decimals); // 10n ** decimals
    if (balance.div(base).lt(number_1.pow10(-6)) && balance.isGreaterThan(0) && !isPrecise)
        return "<0.000001";
    var negative = balance.isNegative(); // balance < 0n
    if (negative)
        balance = balance.absoluteValue(); // balance * -1n
    var fraction = balance.modulo(base).toString(10); // (balance % base).toString(10)
    // add leading zeros
    while (fraction.length < decimals)
        fraction = "0" + fraction;
    // match significant digits
    var matchSignificantDigits = new RegExp("^0*[1-9]\\d{0," + (significant > 0 ? significant - 1 : 0) + "}");
    fraction = (_b = (_a = fraction.match(matchSignificantDigits)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "";
    // trim tailing zeros
    fraction = fraction.replace(/0+$/g, "");
    var whole = balance.dividedToIntegerBy(base).toString(10); // (balance / base).toString(10)
    var value = "" + whole + (fraction === "" ? "" : "." + fraction);
    var raw = negative ? "-" + value : value;
    return raw.includes(".") ? raw.replace(/0+$/, "").replace(/\.$/, "") : raw;
}
exports.formatBalance = formatBalance;
function isSameAddress(address, otherAddress) {
    if (!address || !otherAddress)
        return false;
    return address.toLowerCase() === otherAddress.toLowerCase();
}
exports.isSameAddress = isSameAddress;
function resolveSocialMediaLink(name, type) {
    switch (type) {
        case "github":
            return "https://github.com/" + name;
        case "twitter":
            return "https://twitter.com/" + name;
        case "telegram":
            return "https://t.me/" + name;
        case "reddit":
            return "https://www.reddit.com/user/" + name;
        case "discord":
            return "https://discord.gg/" + name;
        default:
            return "https://twitter.com/" + name;
    }
}
exports.resolveSocialMediaLink = resolveSocialMediaLink;
function isValidJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isValidJson = isValidJson;
var regexEns = /.*\.eth|.xyz$/, regexLens = /.*\.lens$/, regexDotbit = /.*\.bit$/, regexEth = /^0x[a-fA-F0-9]{40}$/, regexTwitter = /(\w{1,15})\b/;
exports.handleSearchPlatform = function (term) {
    switch (true) {
        case regexEns.test(term):
            return type_1.PlatformType.ens;
        case regexLens.test(term):
            return type_1.PlatformType.lens;
        case regexDotbit.test(term):
            return type_1.PlatformType.dotbit;
        case regexEth.test(term):
            return type_1.PlatformType.ethereum;
        case regexTwitter.test(term):
            return type_1.PlatformType.twitter;
        default:
            return type_1.PlatformType.nextid;
    }
};
exports.isDomainSearch = function (term) {
    return [type_1.PlatformType.ens, type_1.PlatformType.dotbit, type_1.PlatformType.lens].includes(term);
};
exports.throttle = function (fun, delay) {
    var last, deferTimer;
    return function (args) {
        var that = this;
        var _args = arguments;
        var now = +new Date();
        if (last && now < last + delay) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fun.apply(that, _args);
            }, delay);
        }
        else {
            last = now;
            fun.apply(that, _args);
        }
    };
};
exports.debounce = function (func, delay, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timer;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var that = this;
        if (immediate) {
            func.apply(that, args);
            immediate = false;
            return;
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            func.apply(that, args);
        }, delay);
    };
};
