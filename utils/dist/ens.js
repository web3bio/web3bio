"use strict";
exports.__esModule = true;
exports.globalRecordKeys = exports.ens = void 0;
var ethers_1 = require("ethers");
var ensjs_1 = require("@ensdomains/ensjs");
var EthereumRPC = "https://rpc.ankr.com/eth";
var provider = new ethers_1.ethers.providers.JsonRpcProvider(EthereumRPC, 1);
var ens = new ensjs_1["default"]({ provider: provider, ensAddress: ensjs_1.getEnsAddress("1") });
exports.ens = ens;
var globalRecordKeys = [
    "com.github",
    "com.discord",
    "com.reddit",
    "con.twitter",
    "org.telegram",
];
exports.globalRecordKeys = globalRecordKeys;
