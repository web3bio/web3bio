"use strict";
exports.__esModule = true;
exports.SearchResultDomain = void 0;
var client_1 = require("@apollo/client");
var ResultAccount_1 = require("./ResultAccount");
var Loading_1 = require("../shared/Loading");
var Empty_1 = require("../shared/Empty");
var Error_1 = require("../shared/Error");
var queries_1 = require("../../utils/queries");
var react_1 = require("react");
var RenderResultDomain = function (_a) {
    var searchTerm = _a.searchTerm, searchPlatform = _a.searchPlatform, openProfile = _a.openProfile;
    var _b = client_1.useQuery(queries_1.GET_PROFILES_DOMAIN, {
        variables: {
            platform: searchPlatform,
            identity: searchTerm
        }
    }), loading = _b.loading, error = _b.error, data = _b.data;
    var _c = react_1.useState([]), resultNeighbor = _c[0], setResultNeighbor = _c[1];
    react_1.useEffect(function () {
        if (!data || !data.domain)
            return;
        var results = data === null || data === void 0 ? void 0 : data.domain.owner;
        var resultOwner = {
            identity: {
                uuid: results === null || results === void 0 ? void 0 : results.uuid,
                platform: results === null || results === void 0 ? void 0 : results.platform,
                identity: results === null || results === void 0 ? void 0 : results.identity,
                displayName: results === null || results === void 0 ? void 0 : results.displayName,
                nft: results === null || results === void 0 ? void 0 : results.nft
            }
        };
        var temp = results === null || results === void 0 ? void 0 : results.neighborWithTraversal.reduce(function (pre, cur) {
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
        temp.unshift(resultOwner);
        setResultNeighbor(temp.filter(function (ele, index) {
            return index ===
                temp.findIndex(function (elem) { return elem.identity.uuid == ele.identity.uuid; });
        }));
    }, [data, searchTerm]);
    if (loading)
        return React.createElement(Loading_1.Loading, null);
    if (error)
        return React.createElement(Error_1.Error, { text: error });
    if (!(data === null || data === void 0 ? void 0 : data.domain))
        return React.createElement(Empty_1.Empty, null);
    return (React.createElement(ResultAccount_1.ResultAccount, { searchTerm: searchTerm, resultNeighbor: resultNeighbor, openProfile: openProfile, graphData: data.domain.owner.neighborWithTraversal.length
            ? data.domain.owner.neighborWithTraversal
            : [
                resultNeighbor.length > 0
                    ? {
                        from: resultNeighbor[0].identity,
                        to: resultNeighbor[0].identity,
                        source: "nextid"
                    }
                    : {},
            ] }));
};
exports.SearchResultDomain = react_1.memo(RenderResultDomain);
