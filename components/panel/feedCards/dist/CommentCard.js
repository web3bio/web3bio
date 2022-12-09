"use strict";
exports.__esModule = true;
exports.CommentCard = exports.isCommentFeed = void 0;
var react_1 = require("react");
var utils_1 = require("../../../utils/utils");
var types_1 = require("../../apis/rss3/types");
var NFTAssetPlayer_1 = require("../../shared/NFTAssetPlayer");
function isCommentFeed(feed) {
    return feed.tag === types_1.Tag.Social && feed.type === types_1.Type.Comment;
}
exports.isCommentFeed = isCommentFeed;
var RenderCommentFeed = function (props) {
    var feed = props.feed, identity = props.identity;
    var action = feed.actions[0];
    var metadata = action.metadata;
    var user = identity.identity;
    var commentTarget = metadata === null || metadata === void 0 ? void 0 : metadata.targetuseAddressLabel;
    var isOwner = utils_1.isSameAddress(user, feed.owner);
    return (React.createElement("div", { className: "feed-item-box" },
        React.createElement("div", { className: "feed-type-badge" }),
        React.createElement("div", { className: "feed-item" },
            React.createElement("div", { className: "feed-item-header" },
                React.createElement("div", { className: "feed-type-intro" },
                    React.createElement("div", { className: "strong" }, isOwner ? identity.displayName : utils_1.formatText(user !== null && user !== void 0 ? user : "")),
                    "made a comment on",
                    React.createElement("div", { className: "strong" }, action.platform || "unknown"))),
            React.createElement("div", null, metadata === null || metadata === void 0 ? void 0 : metadata.body),
            commentTarget && (React.createElement("div", { className: "feed-item-main" },
                React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "feed-nft-img", src: commentTarget.media[0].address }),
                React.createElement("picture", null),
                React.createElement("div", { className: "feed-nft-info" }, commentTarget === null || commentTarget === void 0 ? void 0 : commentTarget.body))))));
};
exports.CommentCard = react_1.memo(RenderCommentFeed);
