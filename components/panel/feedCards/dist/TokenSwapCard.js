"use strict";
exports.__esModule = true;
exports.TokenSwapCard = exports.isTokenSwapFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
var NFTAssetPlayer_1 = require("../../shared/NFTAssetPlayer");
function isTokenSwapFeed(feed) {
    return feed.tag === types_1.Tag.Exchange && feed.type === types_1.Type.Swap;
}
exports.isTokenSwapFeed = isTokenSwapFeed;
var RenderTokenSwapCard = function (props) {
    var feed = props.feed, identity = props.identity;
    var action = feed.actions[0];
    var metadata = action.metadata;
    var user = identity.identity;
    var isFromOwner = utils_1.isSameAddress(user, action.address_from);
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" },
                React.createElement("div", { className: "feed-type-intro" },
                    React.createElement("div", { className: "strong" }, isFromOwner ? identity.displayName : utils_1.formatText(action.address_from)),
                    "swaped on",
                    React.createElement("div", { className: "strong" }, feed.platform))),
            metadata ? (React.createElement("div", { className: "feed-item-main" },
                React.createElement("div", { style: { display: "flex" } },
                    React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-swap-img", src: metadata.from.image, alt: "ft1" }),
                    React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-swap-img", src: metadata.to.image, alt: "ft2" })),
                React.createElement("div", { className: "feed-nft-info" },
                    React.createElement("div", { className: "nft-title" },
                        utils_1.formatValue(metadata.from),
                        " ",
                        metadata.from.symbol,
                        " for",
                        " ",
                        utils_1.formatValue(metadata.to),
                        " ",
                        metadata.to.symbol)))) : null)));
};
exports.TokenSwapCard = react_1.memo(RenderTokenSwapCard);
