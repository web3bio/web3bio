"use strict";
exports.__esModule = true;
exports.NFTOverview = void 0;
var react_1 = require("react");
var swr_1 = require("swr");
var Loading_1 = require("../shared/Loading");
var Error_1 = require("../shared/Error");
var NFTAssetPlayer_1 = require("../shared/NFTAssetPlayer");
var ipfs_1 = require("../../utils/ipfs");
var nftscan_1 = require("../apis/nftscan");
function useCollections(address) {
    var _a = swr_1["default"](nftscan_1.NFTSCAN_BASE_API_ENDPOINT + ("account/own/all/" + address + "?erc_type=erc721"), nftscan_1.NFTSCANFetcher), data = _a.data, error = _a.error;
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}
var RenderNFTOverview = function (props) {
    var identity = props.identity;
    var _a = useCollections(identity.identity), data = _a.data, isLoading = _a.isLoading, isError = _a.isError;
    if (isLoading)
        return React.createElement(Loading_1.Loading, null);
    if (isError)
        return React.createElement(Error_1.Error, { text: isError });
    if (!data || !data.data)
        return null;
    return (React.createElement("div", { className: "nft-collection-container" },
        React.createElement("div", { className: "nft-collection-title" }, "COLLECTIONS"),
        React.createElement("div", { className: "nft-list" }, isLoading ? (React.createElement(Loading_1.Loading, null)) : (data.data.map(function (x, idx) {
            return (React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { key: idx, className: "collection-nft-item", src: ipfs_1.resolveIPFS_URL(x.logo_url) }));
        })))));
};
exports.NFTOverview = react_1.memo(RenderNFTOverview);
