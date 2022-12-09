"use strict";
exports.__esModule = true;
exports.ProfileCard = exports.isProfileFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
var NFTAssetPlayer_1 = require("../../shared/NFTAssetPlayer");
function isProfileFeed(feed) {
    return feed.tag === types_1.Tag.Social && feed.type === types_1.Type.Profile;
}
exports.isProfileFeed = isProfileFeed;
var RenderProfileFeed = function (props) {
    var _a, _b;
    var feed = props.feed, identity = props.identity;
    var action = feed.actions[0];
    var metadata = action.metadata;
    var imageSize = 40;
    var isOwner = utils_1.isSameAddress(feed.owner, identity.identity);
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" },
                React.createElement("div", { className: "feed-type-intro" },
                    React.createElement("div", { className: "strong" }, isOwner
                        ? (_a = identity.displayName) !== null && _a !== void 0 ? _a : utils_1.formatText(identity.identity) : utils_1.formatText((_b = feed.owner) !== null && _b !== void 0 ? _b : "")),
                    "created an profile on",
                    React.createElement("div", { className: "strong" }, metadata === null || metadata === void 0 ? void 0 : metadata.platform))),
            metadata && (React.createElement("div", { className: "feed-item-main" },
                React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-nft-img", width: imageSize, height: imageSize, src: metadata.profile_uri[0], type: "image/png" }),
                React.createElement("div", { className: "feed-nft-info" },
                    React.createElement("div", { className: "nft-title" }, metadata.name || metadata.handle),
                    React.createElement("div", { className: "nft-subtitle" }, metadata === null || metadata === void 0 ? void 0 : metadata.bio)))))));
};
exports.ProfileCard = react_1.memo(RenderProfileFeed);
