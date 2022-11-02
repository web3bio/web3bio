"use strict";
exports.__esModule = true;
exports.NFTCollections = void 0;
var react_1 = require("react");
var swr_1 = require("swr");
var nftscan_1 = require("../apis/nftscan");
var CollectionSwitcher_1 = require("./CollectionSwitcher");
var ipfs_1 = require("../../utils/ipfs");
var Loading_1 = require("../shared/Loading");
var Empty_1 = require("../shared/Empty");
var Error_1 = require("../shared/Error");
function useCollections(address) {
    var _a = swr_1["default"](nftscan_1.NFTSCAN_BASE_API_ENDPOINT + ("account/own/all/" + address + "?erc_type=erc721"), nftscan_1.NFTSCANFetcher), data = _a.data, error = _a.error;
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}
var RenderNFTCollections = function (props) {
    var onShowDetail = props.onShowDetail;
    var _a = react_1.useState([]), collections = _a[0], setCollections = _a[1];
    var _b = useCollections("0x934b510d4c9103e6a87aef13b816fb080286d649"), data = _b.data, isLoading = _b.isLoading, isError = _b.isError;
    react_1.useEffect(function () {
        if (data && data.data) {
            setCollections(data.data.map(function (x) { return ({
                key: x.contract_address,
                name: x.contract_name,
                url: x.logo_url
            }); }));
        }
    }, [data]);
    if (isLoading)
        return (React.createElement("div", { className: "panel-container" },
            React.createElement(Loading_1.Loading, null)));
    if (isError)
        return React.createElement(Error_1.Error, { text: isError });
    if (!data || !data.data)
        return React.createElement(Empty_1.Empty, null);
    return (React.createElement("div", { className: "nft-collection-container" },
        collections && (React.createElement(CollectionSwitcher_1.CollectionSwitcher, { collections: collections, currentSelect: collections[0], onSelect: function (e) { return console.log("onSelect:", encodeURI); } })),
        React.createElement("div", { className: "nft-collection-list" }, data.data.map(function (x, idx) {
            return (React.createElement("div", { className: "collection-item", key: idx },
                React.createElement("div", { className: "nft-collection-title-box" },
                    React.createElement("picture", null,
                        React.createElement("source", { srcSet: x.logo_url, type: "image/webp" }),
                        React.createElement("img", { className: "collection-logo", src: x.logo_url, alt: "" })),
                    React.createElement("div", { className: "nft-collection-title" },
                        " ",
                        x.contract_name)),
                React.createElement("div", { className: "nft-item-coantiner" }, x.assets.map(function (y, ydx) {
                    var _a;
                    var mediaURL = ipfs_1.resolveIPFS_URL((_a = y.image_uri) !== null && _a !== void 0 ? _a : y.content_uri);
                    return (React.createElement("div", { key: ydx, className: "detail-item", onClick: function () {
                            return onShowDetail({
                                collection: {
                                    url: x.logo_url,
                                    name: x.contract_name
                                },
                                asset: y
                            });
                        } },
                        React.createElement("div", { className: "img-container" },
                            React.createElement("picture", null,
                                React.createElement("img", { src: mediaURL, alt: "nft-icon" }))),
                        React.createElement("div", { className: "collection-name" }, x.contract_name),
                        React.createElement("div", { className: "nft-name" }, y.name)));
                }))));
        }))));
};
exports.NFTCollections = react_1.memo(RenderNFTCollections);
