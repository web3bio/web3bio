"use strict";
exports.__esModule = true;
exports.SearchResultQuery = void 0;
var client_1 = require("@apollo/client");
var ResultAccount_1 = require("./ResultAccount");
var Loading_1 = require("../shared/Loading");
var Empty_1 = require("../shared/Empty");
var Error_1 = require("../shared/Error");
var queries_1 = require("../../utils/queries");
var react_1 = require("react");
exports.SearchResultQuery = function (_a) {
    var searchTerm = _a.searchTerm, searchPlatform = _a.searchPlatform, openProfile = _a.openProfile;
    var _b = client_1.useQuery(queries_1.GET_PROFILES_QUERY, {
        variables: {
            platform: searchPlatform,
            identity: searchTerm
        }
    }), loading = _b.loading, error = _b.error, data = _b.data;
    var _c = react_1.useState([]), resultNeighbor = _c[0], setResultNeighbor = _c[1];
    react_1.useEffect(function () {
        if (!data || !data.identity)
            return;
        var results = data === null || data === void 0 ? void 0 : data.identity;
        var resultOwner = {
            identity: {
                uuid: results === null || results === void 0 ? void 0 : results.uuid,
                platform: results === null || results === void 0 ? void 0 : results.platform,
                identity: results === null || results === void 0 ? void 0 : results.identity,
                displayName: results === null || results === void 0 ? void 0 : results.displayName,
                ownedBy: results === null || results === void 0 ? void 0 : results.ownedBy,
                nft: results === null || results === void 0 ? void 0 : results.nft
            }
        };
        if (results === null || results === void 0 ? void 0 : results.neighborWithTraversal) {
            var temp_1 = results === null || results === void 0 ? void 0 : results.neighborWithTraversal.reduce(function (pre, cur) {
                pre.push({
                    identity: cur.from,
                    sources: [cur.source],
                    __typename: "IdentityWithSource"
                });
                pre.push({
                    identity: cur.to,
                    sources: [cur.source],
                    __typename: "IdentityWithSource"
                });
                return pre;
            }, []);
            temp_1.unshift(resultOwner);
            setResultNeighbor(temp_1.filter(function (ele, index) {
                return index ===
                    temp_1.findIndex(function (elem) { return elem.identity.uuid == ele.identity.uuid; });
            }));
        }
    }, [data]);
    if (loading)
        return React.createElement(Loading_1.Loading, null);
    if (error)
        return React.createElement(Error_1.Error, { text: error });
    if (!(data === null || data === void 0 ? void 0 : data.identity))
        return React.createElement(Empty_1.Empty, null);
    return (React.createElement(ResultAccount_1.ResultAccount, { openProfile: openProfile, searchTerm: searchTerm, resultNeighbor: resultNeighbor, graphData: data.identity.neighborWithTraversal || [] }));
};
