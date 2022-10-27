"use strict";
exports.__esModule = true;
exports.NFTCollections = void 0;
var react_1 = require("react");
var swr_1 = require("swr");
var nftscan_1 = require("../apis/nftscan");
var CollectionSwitcher_1 = require("./CollectionSwitcher");
function useNFTCollections(address) {
    var _a = swr_1["default"](nftscan_1.NFTSCAN_BASE_API_ENDPOINT + ("account/own/all/" + address + "?erc_type=erc721"), nftscan_1.NFTSCANFetcher), data = _a.data, error = _a.error;
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}
exports.NFTCollections = function (props) {
    var _a = props.list, list = _a === void 0 ? [1, 2, 3, 4, 5, 6] : _a, isDetail = props.isDetail;
    var _b = react_1.useState([]), collections = _b[0], setCollections = _b[1];
    var _c = useNFTCollections("0x934b510d4c9103e6a87aef13b816fb080286d649"), data = _c.data, isLoading = _c.isLoading, isError = _c.isError;
    if (isLoading)
        return React.createElement("div", null, "Loading...");
    if (isError)
        return React.createElement("div", null, "failed to load");
    return (React.createElement("div", { className: "nft-collection-container" },
        React.createElement(CollectionSwitcher_1.CollectionSwitcher, { collections: collections, currentSelect: collections[0], onSelect: function (e) { return console.log("onSelect:", encodeURI); } }),
        React.createElement("div", { className: "nft-collection-list" }, data.data.map(function (x, idx) {
            return (React.createElement("div", { className: "collection-item", key: idx },
                React.createElement("div", { className: "nft-collection-title-box" },
                    React.createElement("img", { className: "collection-logo", src: x.logo_url, alt: "" }),
                    React.createElement("div", { className: "nft-collection-title" },
                        " ",
                        x.contract_name)),
                React.createElement("div", { className: "nft-item-coantiner" }, x.assets.map(function (y, ydx) {
                    var resolvedMediaURL = y.image_uri || y.content_uri || y.external_link;
                    console.log(y, "asset_url", x);
                    return (React.createElement("div", { key: ydx, className: "detail-item" },
                        React.createElement("div", { className: "img-container" },
                            React.createElement("img", { src: resolvedMediaURL, alt: "nft-icon" })),
                        React.createElement("div", { className: "collection-name" }, x.contract_name),
                        React.createElement("div", { className: "nft-name" }, y.name)));
                }))));
        }))));
};
