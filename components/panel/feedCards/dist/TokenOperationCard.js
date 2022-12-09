"use strict";
exports.__esModule = true;
exports.TokenOperationCard = exports.isTokenTransferFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
var NFTAssetPlayer_1 = require("../../shared/NFTAssetPlayer");
exports.isTokenTransferFeed = function (feed) {
    return (feed.tag === types_1.Tag.Transaction &&
        [types_1.Type.Transfer, types_1.Type.Burn].includes(feed.type));
};
var RenderTokenOperationCard = function (props) {
    var _a, _b;
    var feed = props.feed, identity = props.identity;
    var action = feed.actions[0];
    var metadata = action.metadata;
    var isFromOwner = utils_1.isSameAddress(identity.identity, action.address_from);
    var _to = utils_1.isSameAddress(identity.identity, action.address_to)
        ? identity.displayName
        : utils_1.formatText((_a = feed.address_to) !== null && _a !== void 0 ? _a : "");
    var context = feed.type === types_1.Type.Burn ? "burn" : isFromOwner ? "send to" : "claim from";
    console.log(feed);
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" },
                React.createElement("div", { className: "feed-type-intro" },
                    React.createElement("div", { className: "strong" }, isFromOwner
                        ? identity.displayName || utils_1.formatText(identity.identity)
                        : utils_1.formatText((_b = action.address_from) !== null && _b !== void 0 ? _b : "")),
                    context,
                    React.createElement("div", { className: "strong" }, _to))),
            metadata ? (React.createElement("div", { className: "feed-item-main" },
                React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-nft-img", src: metadata.image, type: "image/png" }),
                React.createElement("div", { className: "feed-nft-info" },
                    React.createElement("div", { className: "nft-title" },
                        utils_1.formatValue(metadata),
                        " ",
                        metadata.symbol)))) : null)));
};
exports.TokenOperationCard = react_1.memo(RenderTokenOperationCard);
