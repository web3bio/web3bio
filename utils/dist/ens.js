"use strict";
exports.__esModule = true;
exports.globalRecordKeys = exports.ens = exports.provider = void 0;
var ethers_1 = require("ethers");
var ensjs_1 = require("@ensdomains/ensjs");
var EthereumRPC = "https://rpc.ankr.com/eth";
exports.provider = new ethers_1.ethers.providers.JsonRpcProvider(EthereumRPC, 1);
var ens = new ensjs_1.ENS();
exports.ens = ens;
var globalRecordKeys = [
    "description",
    "url",
    "com.github",
    "com.twitter",
    "org.telegram",
    "com.discord",
    "com.reddit",
    "vnd.twitter",
    "vnd.github",
];
exports.globalRecordKeys = globalRecordKeys;
