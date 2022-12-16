"use strict";
exports.__esModule = true;
exports.NFTDialog = void 0;
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var swr_1 = require("swr");
var nftscan_1 = require("../apis/nftscan");
var Error_1 = require("../shared/Error");
var NFTAssetPlayer_1 = require("../shared/NFTAssetPlayer");
var utils_1 = require("../../utils/utils");
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
    var _a = useAsset(asset.asset.contract_address, asset.asset.token_id), data = _a.data, isError = _a.isError;
    var resolveOpenseaLink = "https://opensea.io/assets/ethereum/" + asset.asset.contract_address + "/" + asset.asset.token_id;
    if (isError)
        return React.createElement(Error_1.Error, { text: isError });
    if (!data)
        return null;
    var _asset = data.data;
    var metadata = utils_1.isValidJson(_asset.metadata_json)
        ? JSON.parse(_asset.metadata_json)
        : null;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "nft-panel" },
            React.createElement("div", { className: "panel-container" },
                React.createElement("div", { className: "btn btn-close", onClick: onClose },
                    React.createElement(react_inlinesvg_1["default"], { src: "/icons/icon-close.svg", width: "20", height: "20" })),
                React.createElement("div", { className: "panel-header" },
                    React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "img-container", type: asset.asset.content_type, src: asset.mediaURL, contentUrl: asset.contentURL, alt: asset.asset.name }),
                    React.createElement("div", { className: "panel-header-content" },
                        React.createElement("div", { className: "nft-header-collection collection-title" },
                            React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { type: "image/png", className: "collection-logo", src: asset.collection.url, alt: asset.collection.name }),
                            React.createElement("div", { className: "collection-name text-ellipsis" },
                                " ",
                                asset.collection.name)),
                        React.createElement("div", { className: "nft-header-name" }, asset.asset.name || "#" + asset.asset.token_id),
                        React.createElement("div", { className: "nft-header-actions" },
                            React.createElement("a", { href: resolveOpenseaLink, className: "btn mr-2", title: "Open OpenSea", target: "_blank", rel: "noopener noreferrer" },
                                React.createElement(react_inlinesvg_1["default"], { src: "/icons/social-opensea.svg", width: 20, height: 20, className: "icon" }),
                                React.createElement("span", { className: "ml-1" }, "OpenSea")),
                            React.createElement("a", { href: "https://etherscan.io/token/" + asset.asset.contract_address + "?a=" + asset.asset.token_id, className: "btn", title: "Open Etherscan", target: "_blank", rel: "noopener noreferrer" },
                                React.createElement(react_inlinesvg_1["default"], { src: "/icons/icon-ethereum.svg", width: 20, height: 20, className: "icon" }),
                                React.createElement("span", { className: "ml-1" }, "Etherscan")))),
                    (metadata === null || metadata === void 0 ? void 0 : metadata.description) && (React.createElement("div", { className: "panel-widget" },
                        React.createElement("div", { className: "panel-widget-title" }, "Description"),
                        React.createElement("div", { className: "panel-widget-content" }, metadata === null || metadata === void 0 ? void 0 : metadata.description))),
                    metadata.attributes && metadata.attributes.length > 0 && (React.createElement("div", { className: "panel-widget" },
                        React.createElement("div", { className: "panel-widget-title" }, "Attributes"),
                        React.createElement("div", { className: "panel-widget-content" },
                            React.createElement("div", { className: "traits-cards" }, metadata.attributes.map(function (x, idx) {
                                return (React.createElement("div", { key: idx, className: "traits-card" },
                                    React.createElement("div", { className: "trait-type" }, x.trait_type),
                                    React.createElement("div", { className: "trait-value" }, x.value)));
                            }))))))))));
};
exports.NFTDialog = react_1.memo(NFTDialogRender);
