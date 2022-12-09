"use strict";
exports.__esModule = true;
exports.NoteCard = exports.isNoteFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
function isNoteFeed(feed) {
    return (feed.tag === types_1.Tag.Social && [types_1.Type.Post, types_1.Type.Revise].includes(feed.type));
}
exports.isNoteFeed = isNoteFeed;
var RenderNoteCard = function (props) {
    var _a, _b;
    var feed = props.feed, identity = props.identity;
    var action = feed.actions[0];
    var metadata = action.metadata;
    var isOwner = utils_1.isSameAddress(feed.address_from, identity.identity);
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" },
                React.createElement("div", { className: "feed-type-intro" },
                    React.createElement("div", { className: "strong" }, isOwner
                        ? (_a = identity.displayName) !== null && _a !== void 0 ? _a : utils_1.formatText(identity.identity) : utils_1.formatText((_b = feed.address_from) !== null && _b !== void 0 ? _b : "")),
                    "posted a note on",
                    React.createElement("div", { className: "strong" }, action.platform || "unknown"))),
            React.createElement("div", { className: "feed-item-main" },
                React.createElement("div", { className: "feed-nft-info" },
                    (metadata === null || metadata === void 0 ? void 0 : metadata.title) && (React.createElement("div", { className: "nft-title" }, metadata.title)),
                    (metadata === null || metadata === void 0 ? void 0 : metadata.body) && (React.createElement("div", { className: "nft-subtitle" }, metadata.body)))))));
};
exports.NoteCard = react_1.memo(RenderNoteCard);
