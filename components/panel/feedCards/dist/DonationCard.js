"use strict";
exports.__esModule = true;
exports.DonationCard = exports.isDonationFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
var NFTAssetPlayer_1 = require("../../shared/NFTAssetPlayer");
function isDonationFeed(feed) {
    return feed.tag === types_1.Tag.Donation;
}
exports.isDonationFeed = isDonationFeed;
var RenderDonationCard = function (props) {
    var _a, _b;
    var feed = props.feed, identity = props.identity, actionIndex = props.actionIndex;
    var _c = react_1.useState(0), index = _c[0], setIndex = _c[1];
    var activeActionIndex = actionIndex !== null && actionIndex !== void 0 ? actionIndex : index;
    var action = feed.actions[activeActionIndex];
    var metadata = action.metadata;
    var user = feed.owner;
    var isOwner = utils_1.isSameAddress(user, identity.identity);
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" },
                React.createElement("div", { className: "feed-type-intro" },
                    React.createElement("div", { className: "strong" }, isOwner ? identity.displayName : utils_1.formatText(user !== null && user !== void 0 ? user : "")),
                    "donated",
                    React.createElement("div", { className: "strong" },
                        utils_1.formatValue(metadata === null || metadata === void 0 ? void 0 : metadata.token),
                        " ", (_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.token) === null || _a === void 0 ? void 0 : _a.symbol) !== null && _b !== void 0 ? _b : ""))),
            metadata && (React.createElement("div", { className: "feed-item-main" },
                React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-nft-img", style: { width: 64, height: 64 }, src: metadata.logo }),
                React.createElement("picture", null),
                React.createElement("div", { className: "feed-nft-info" },
                    React.createElement("div", { className: "nft-title" }, metadata === null || metadata === void 0 ? void 0 : metadata.title),
                    React.createElement("div", { className: "nft-subtitle" }, metadata === null || metadata === void 0 ? void 0 : metadata.description)))))));
};
exports.DonationCard = react_1.memo(RenderDonationCard);
