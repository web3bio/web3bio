"use strict";
exports.__esModule = true;
exports.NFTDialog = void 0;
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var IconButton_1 = require("../shared/IconButton");
var social_opensea_svg_1 = require("../assets/icons/social-opensea.svg");
var NFTDialogRender = function (props) {
    var open = props.open, onClose = props.onClose, asset = props.asset;
    return (open && (React.createElement("div", { className: "panel-container" },
        React.createElement("div", { className: "close-icon-box", onClick: onClose },
            React.createElement(react_inlinesvg_1["default"], { className: "close-icon", src: "icons/icon-close.svg" })),
        React.createElement("div", { className: "nft-dialog-basic" },
            React.createElement("img", { className: "nft-dialog-asset-player", src: asset.image_uri }),
            React.createElement("div", { className: "nft-dialog-info" },
                React.createElement("div", { className: "nft-dialog-collection" },
                    React.createElement("img", { className: "avatar", src: asset.collection.url, alt: "" }),
                    React.createElement("div", { className: "title" }, asset.collection.name)),
                React.createElement("div", { className: "nft-name" }, asset.asset.name),
                React.createElement(IconButton_1.IconButton, { url: social_opensea_svg_1["default"] }))))));
};
exports.NFTDialog = react_1.memo(NFTDialogRender);
