"use strict";
exports.__esModule = true;
exports.CollectibleCard = exports.getLastAction = exports.isCollectibleFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
var NFTAssetPlayer_1 = require("../../shared/NFTAssetPlayer");
function isCollectibleFeed(feed) {
    return feed.tag === types_1.Tag.Collectible;
}
exports.isCollectibleFeed = isCollectibleFeed;
function getLastAction(feed) {
    return feed.actions[feed.actions.length - 1];
}
exports.getLastAction = getLastAction;
var RenderCollectibleCard = function (props) {
    var _a;
    var feed = props.feed, identity = props.identity;
    var user = feed.address_from;
    var isOwner = utils_1.isSameAddress(user, feed.address_from);
    var _b = react_1.useMemo(function () {
        var _a;
        var action;
        var metadata;
        var _from = isOwner ? identity.displayName : utils_1.formatText(user !== null && user !== void 0 ? user : "");
        var _to = utils_1.isSameAddress(identity.identity, feed.address_to)
            ? identity.displayName
            : utils_1.formatText((_a = feed.address_to) !== null && _a !== void 0 ? _a : "");
        switch (feed.type) {
            case types_1.Type.Mint:
                // If only one action, it should be free minting
                metadata = getLastAction(feed).metadata;
                return {
                    cardType: types_1.CardType.CollectibleMint,
                    metadata: metadata,
                    summary: (React.createElement("div", { className: "feed-type-intro" },
                        React.createElement("div", { className: "strong" }, _from),
                        "minted an NFT",
                        React.createElement("div", { className: "strong" }, metadata.cost &&
                            "for " + utils_1.formatValue(metadata === null || metadata === void 0 ? void 0 : metadata.cost) + " " + metadata.cost.symbol)))
                };
            case types_1.Type.Trade:
                action = getLastAction(feed);
                metadata = action.metadata;
                return {
                    cardType: types_1.CardType.CollectibleOut,
                    metadata: metadata,
                    summary: (React.createElement("div", { className: "feed-type-intro" },
                        React.createElement("div", { className: "strong" }, _from),
                        "sold an NFT to",
                        React.createElement("div", { className: "strong" }, _to)))
                };
            case types_1.Type.Transfer:
                action = getLastAction(feed);
                metadata = action.metadata;
                var isSending = utils_1.isSameAddress(feed.owner, action.address_from);
                return {
                    cardType: isSending
                        ? types_1.CardType.CollectibleOut
                        : types_1.CardType.CollectibleIn,
                    metadata: metadata,
                    summary: (React.createElement("div", { className: "feed-type-intro" },
                        React.createElement("div", { className: "strong" }, _from),
                        "sent an NFT to",
                        React.createElement("div", { className: "strong" }, _to)))
                };
            case types_1.Type.Burn:
                metadata = getLastAction(feed).metadata;
                return {
                    cardType: types_1.CardType.CollectibleBurn,
                    metadata: metadata,
                    summary: (React.createElement("div", { className: "feed-type-intro" },
                        React.createElement("div", { className: "strong" }, _from),
                        "burned an NFT"))
                };
        }
        return { summary: "", cardType: types_1.CardType.CollectibleIn };
    }, [feed, user, isOwner]), metadata = _b.metadata, cardType = _b.cardType, summary = _b.summary;
    var imageSize = 64;
    var attributes = metadata && "attributes" in metadata
        ? (_a = metadata.attributes) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return x.trait_type; }) : [];
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" }, summary),
            metadata ? (React.createElement("div", { className: "feed-item-main" },
                React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-nft-img", src: metadata.image, type: "image/png" }),
                React.createElement("div", { className: "feed-nft-info" },
                    React.createElement("div", { className: "nft-title" },
                        utils_1.formatValue(metadata),
                        " ",
                        metadata.symbol),
                    metadata.description ? (React.createElement("div", { className: "nft-subtitle" }, metadata.description)) : null))) : null)));
};
exports.CollectibleCard = react_1.memo(RenderCollectibleCard);
