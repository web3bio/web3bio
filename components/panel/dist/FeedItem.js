"use strict";
exports.__esModule = true;
exports.FeedItem = exports.isSupportedFeed = void 0;
var react_1 = require("react");
var CollectibleCard_1 = require("./feedCards/CollectibleCard");
var CommentCard_1 = require("./feedCards/CommentCard");
var DonationCard_1 = require("./feedCards/DonationCard");
var NoteCard_1 = require("./feedCards/NoteCard");
var ProfileCard_1 = require("./feedCards/ProfileCard");
var TokenOperationCard_1 = require("./feedCards/TokenOperationCard");
var TokenSwapCard_1 = require("./feedCards/TokenSwapCard");
exports.isSupportedFeed = function (feed) {
    return (TokenOperationCard_1.isTokenTransferFeed(feed) ||
        TokenSwapCard_1.isTokenSwapFeed(feed) ||
        CollectibleCard_1.isCollectibleFeed(feed) ||
        DonationCard_1.isDonationFeed(feed) ||
        NoteCard_1.isNoteFeed(feed) ||
        CommentCard_1.isCommentFeed(feed) ||
        ProfileCard_1.isProfileFeed(feed));
};
var RenderFeedItem = function (props) {
    var feed = props.feed, identity = props.identity;
    if (TokenOperationCard_1.isTokenTransferFeed(feed))
        return React.createElement(TokenOperationCard_1.TokenOperationCard, { feed: feed, identity: identity });
    if (TokenSwapCard_1.isTokenSwapFeed(feed))
        return React.createElement(TokenSwapCard_1.TokenSwapCard, { feed: feed, identity: identity });
    if (CollectibleCard_1.isCollectibleFeed(feed))
        return React.createElement(CollectibleCard_1.CollectibleCard, { feed: feed, identity: identity });
    if (DonationCard_1.isDonationFeed(feed))
        return React.createElement(DonationCard_1.DonationCard, { feed: feed });
    if (NoteCard_1.isNoteFeed(feed))
        return React.createElement(NoteCard_1.NoteCard, { feed: feed, identity: identity });
    if (CommentCard_1.isCommentFeed(feed))
        return React.createElement(CommentCard_1.CommentCard, { feed: feed, identity: identity });
    if (ProfileCard_1.isProfileFeed(feed))
        return React.createElement(ProfileCard_1.ProfileCard, { feed: feed, identity: identity });
    return null;
};
exports.FeedItem = react_1.memo(RenderFeedItem);
