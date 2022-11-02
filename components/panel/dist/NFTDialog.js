"use strict";
exports.__esModule = true;
exports.NFTDialog = void 0;
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var swr_1 = require("swr");
var ipfs_1 = require("../../utils/ipfs");
var nftscan_1 = require("../apis/nftscan");
var Empty_1 = require("../shared/Empty");
var Loading_1 = require("../shared/Loading");
var Error_1 = require("../shared/Error");
function useAsset(address, tokenId) {
    var _a = swr_1["default"](nftscan_1.NFTSCAN_BASE_API_ENDPOINT + ("assets/" + address + "/" + tokenId), nftscan_1.NFTSCANFetcher), data = _a.data, error = _a.error;
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}
var NFTDialogRender = function (props) {
    var onClose = props.onClose, asset = props.asset;
    var _a = useAsset(asset.asset.contract_address, asset.asset.token_id), data = _a.data, isLoading = _a.isLoading, isError = _a.isError;
    var resolveOpenseaLink = "https://opensea.io/assets/ethereum/" + asset.asset.contract_address + "/" + asset.asset.token_id;
    if (isLoading || !data)
        return React.createElement("div", { className: "panel-container" }, "Loading...");
    if (isError)
        return React.createElement("div", { className: "panel-container" }, "failed to load");
    if (isLoading)
        return (React.createElement("div", { className: "panel-container" },
            React.createElement(Loading_1.Loading, null)));
    if (isError)
        return React.createElement(Error_1.Error, { text: isError });
    if (!data)
        return React.createElement(Empty_1.Empty, null);
    var _asset = data.data;
    var metadata = JSON.parse(_asset.metadata_json);
    var mediaurl = ipfs_1.resolveIPFS_URL(metadata.image);
    console.log(metadata, "metadata");
    return (React.createElement("div", { className: "panel-container", style: { overflow: "hidden auto" } },
        React.createElement("div", { className: "close-icon-box", onClick: onClose },
            React.createElement(react_inlinesvg_1["default"], { className: "close-icon", src: "icons/icon-close.svg" })),
        React.createElement("div", { className: "nft-dialog-basic" },
            React.createElement("picture", null,
                React.createElement("source", { srcSet: mediaurl }),
                React.createElement("img", { className: "nft-dialog-asset-player", src: mediaurl, alt: "avatar" })),
            React.createElement("div", { className: "nft-dialog-info" },
                React.createElement("div", { className: "nft-dialog-collection" },
                    React.createElement("picture", null,
                        React.createElement("source", { srcSet: asset.collection.url }),
                        React.createElement("img", { className: "avatar", src: asset.collection.url, alt: "collection" })),
                    React.createElement("div", { className: "title" }, asset.collection.name)),
                React.createElement("div", { className: "nft-name" }, metadata.name),
                React.createElement("button", { onClickCapture: function () { return window.open(resolveOpenseaLink, "_blank"); }, className: "form-button btn ", style: { position: "relative" } },
                    React.createElement(react_inlinesvg_1["default"], { src: "/icons/social-opensea.svg", width: 24, height: 24, className: "icon" })))),
        React.createElement("div", { className: "nft-dialog-scroll-box" },
            React.createElement("div", { className: "nft-dialog-des-box" },
                React.createElement("div", { className: "common-title" }, "Description"),
                React.createElement("div", { className: "description-content" }, metadata.description)),
            metadata.attributes && (React.createElement("div", { className: "nft-dialog-des-box" },
                React.createElement("div", { className: "common-title" }, "Attributes"),
                React.createElement("div", { className: "traits-box" }, metadata.attributes.map(function (x, idx) {
                    return (React.createElement("div", { key: idx, className: "traits-card" },
                        React.createElement("div", { className: "trait-type" }, x.trait_type),
                        React.createElement("div", { className: "trait-value" }, x.value)));
                })))))));
};
exports.NFTDialog = react_1.memo(NFTDialogRender);
