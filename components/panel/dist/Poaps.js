"use strict";
exports.__esModule = true;
exports.Poaps = void 0;
var react_1 = require("react");
var swr_1 = require("swr");
var Loading_1 = require("../shared/Loading");
var Error_1 = require("../shared/Error");
var NFTAssetPlayer_1 = require("../shared/NFTAssetPlayer");
var poap_1 = require("../apis/poap");
var ipfs_1 = require("../../utils/ipfs");
function usePoaps(address) {
    var _a = swr_1["default"]("" + poap_1.POAP_END_POINT + address, poap_1.POAPFetcher), data = _a.data, error = _a.error;
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}
var RenderPoaps = function (props) {
    var identity = props.identity;
    var _a = usePoaps(identity.identity), data = _a.data, isLoading = _a.isLoading, isError = _a.isError;
    if (isError)
        return React.createElement(Error_1.Error, { text: isError });
    if (!data || !data.length)
        return null;
    return (React.createElement("div", { className: "nft-collection-container" },
        React.createElement("div", { className: "nft-collection-title" }, "POAPS"),
        React.createElement("div", { className: "nft-list" }, isLoading ? (React.createElement(Loading_1.Loading, null)) : (data.map(function (x, idx) {
            return (React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { key: idx, className: "collection-nft-item", src: ipfs_1.resolveIPFS_URL(x.event.image_url) }));
        })))));
};
exports.Poaps = react_1.memo(RenderPoaps);
