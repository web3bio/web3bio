"use strict";
exports.__esModule = true;
exports.resolveIPFS_URL = exports.isIPFS_Resource = exports.resolveIPFS_CID = void 0;
var urlcat_1 = require("urlcat");
var MATCH_IPFS_CID_RAW = 'Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[2-7A-Za-z]{58,}|B[2-7A-Z]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[\\dA-F]{50,}';
var CORS_HOST = 'https://cors.r2d2.to';
var IPFS_GATEWAY_HOST = 'https://gateway.ipfscdn.io';
var MATCH_IPFS_DATA_RE = /ipfs\/(data:.*)$/;
var MATCH_IPFS_CID_RE = new RegExp("(" + MATCH_IPFS_CID_RAW + ")");
var MATCH_IPFS_CID_AT_STARTS_RE = new RegExp("^https://(?:" + MATCH_IPFS_CID_RAW + ")");
var MATCH_IPFS_CID_AND_PATHNAME_RE = new RegExp("(?:" + MATCH_IPFS_CID_RAW + ")\\/?.*");
exports.resolveIPFS_CID = function (str) {
    var _a;
    return (_a = str.match(MATCH_IPFS_CID_RE)) === null || _a === void 0 ? void 0 : _a[1];
};
var trimQuery = function (url) {
    return url.replace(/\?.+$/, '');
};
exports.isIPFS_Resource = function (str) {
    return MATCH_IPFS_CID_RE.test(str);
};
function resolveIPFS_URL(cidOrURL) {
    var _a, _b;
    if (!cidOrURL)
        return cidOrURL;
    // eliminate cors proxy
    if (cidOrURL.startsWith(CORS_HOST)) {
        return trimQuery(resolveIPFS_URL(decodeURIComponent(cidOrURL.replace(new RegExp("^" + CORS_HOST + "??"), ''))));
    }
    // a ipfs.io host
    if (cidOrURL.startsWith(IPFS_GATEWAY_HOST)) {
        // base64 data string
        var _c = (_a = cidOrURL.match(MATCH_IPFS_DATA_RE)) !== null && _a !== void 0 ? _a : [], _ = _c[0], data = _c[1];
        if (data)
            return decodeURIComponent(data);
        // plain
        return trimQuery(decodeURIComponent(cidOrURL));
    }
    // a ipfs hash fragment
    if (exports.isIPFS_Resource(cidOrURL)) {
        // starts with a cid
        if (MATCH_IPFS_CID_AT_STARTS_RE.test(cidOrURL)) {
            try {
                var u = new URL(cidOrURL);
                var cid = exports.resolveIPFS_CID(cidOrURL);
                if (cid) {
                    if (u.pathname === '/') {
                        return resolveIPFS_URL(urlcat_1["default"]('https://ipfs.io/ipfs/:cid', {
                            cid: cid
                        }));
                    }
                    else {
                        return resolveIPFS_URL(urlcat_1["default"]('https://ipfs.io/ipfs/:cid/:path', {
                            cid: cid,
                            path: u.pathname.slice(1)
                        }));
                    }
                }
            }
            catch (error) {
                console.error({
                    error: error
                });
                // do nothing
            }
        }
        var pathname = (_b = cidOrURL.match(MATCH_IPFS_CID_AND_PATHNAME_RE)) === null || _b === void 0 ? void 0 : _b[0];
        if (pathname)
            return trimQuery(IPFS_GATEWAY_HOST + "/ipfs/" + pathname);
    }
    return cidOrURL;
}
exports.resolveIPFS_URL = resolveIPFS_URL;
