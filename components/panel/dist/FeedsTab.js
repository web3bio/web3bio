"use strict";
exports.__esModule = true;
exports.FeedsTab = void 0;
var react_1 = require("react");
var rss3_1 = require("../apis/rss3");
var FeedItem_1 = require("./FeedItem");
var date_1 = require("../../utils/date");
var infinite_1 = require("swr/infinite");
var Loading_1 = require("../shared/Loading");
var utils_1 = require("../../utils/utils");
var PAGE_SIZE = 30;
var getFeedsURL = function (address, startHash, previousPageData) {
    if (previousPageData && !previousPageData.length)
        return null;
    return (rss3_1.RSS3_END_POINT +
        ("notes/" + address + "?limit=" + PAGE_SIZE + (startHash ? "&cursor=" + startHash : "") + "&&include_poap=false&count_only=false&query_status=false"));
};
function useFeeds(address, startHash) {
    var _a = infinite_1["default"](function () { return getFeedsURL(address, startHash); }, rss3_1.RSS3Fetcher), data = _a.data, error = _a.error, size = _a.size, isValidating = _a.isValidating, setSize = _a.setSize;
    return {
        data: (data && data[0].result) || [],
        isLoading: !error && !data,
        error: error,
        size: size,
        setSize: setSize,
        isValidating: isValidating
    };
}
var RenderFeedsTab = function (props) {
    var identity = props.identity;
    var _a = react_1.useState(""), startHash = _a[0], setStartHash = _a[1];
    var _b = react_1.useState([]), issues = _b[0], setIssues = _b[1];
    var _c = useFeeds(identity.identity, startHash), data = _c.data, error = _c.error, size = _c.size, setSize = _c.setSize, isValidating = _c.isValidating, isLoading = _c.isLoading;
    var isLoadingInitialData = !data && !error;
    var isLoadingMore = isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === "undefined");
    var isEmpty = data.length === 0;
    var isReachingEnd = isEmpty || (data && data.length < PAGE_SIZE);
    var ref = react_1.useRef(null);
    var lastData = localStorage.getItem("feeds") || [];
    react_1.useEffect(function () {
        var rendering = false;
        var container = ref.current;
        if (lastData && lastData.length > 0) {
            var old_1 = JSON.parse(lastData);
            data.map(function (x) {
                if (!old_1.some(function (y) { return y.timestamp === x.timestamp; })) {
                    old_1.push(x);
                }
            });
            setIssues(old_1);
        }
        else {
            setIssues(data);
        }
        var scrollLoad = function (e) {
            var scrollHeight = e.target.scrollHeight;
            var scrollTop = e.target.scrollTop;
            var offsetHeight = e.target.offsetHeight;
            if (offsetHeight + scrollTop >= scrollHeight) {
                console.log(isValidating, "gggg", isReachingEnd, size, startHash, issues);
                if (data.length > 0 && !isValidating && !isLoading && !rendering) {
                    if (isReachingEnd)
                        return;
                    var copy = issues.length > 0 ? issues : data;
                    var len = copy.length;
                    setStartHash(copy[len - 1].hash);
                    setSize(size + 1);
                    rendering = true;
                }
            }
        };
        localStorage.setItem("feeds", JSON.stringify(issues));
        if (container) {
            container.addEventListener("scroll", utils_1.debounce(scrollLoad, 500));
        }
        return function () {
            container.removeEventListener("scroll", utils_1.debounce(scrollLoad, 500));
        };
    }, [
        startHash,
        isValidating,
        setStartHash,
        setSize,
        isLoading,
        size,
        isReachingEnd,
    ]);
    return (React.createElement("div", { ref: ref, className: "feeds-container" },
        React.createElement("div", { className: "social-feeds-title" }, "Social Feeds"),
        React.createElement("div", { className: "social-feeds-list" },
            isEmpty ? React.createElement("p", null, "Yay, no feeds.") : null,
            issues.map(function (x, idx) {
                return (FeedItem_1.isSupportedFeed(x) && (React.createElement("div", { key: idx },
                    React.createElement(FeedItem_1.FeedItem, { identity: identity, feed: x }),
                    React.createElement("div", { className: "feed-timestamp" }, date_1.formatTimestamp(x.timestamp))))) ||
                    null;
            }),
            React.createElement("div", { style: {
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    margin: "1.5rem 0",
                    justifyContent: "center"
                } }, isLoadingMore ? (React.createElement(Loading_1.Loading, null)) : isReachingEnd ? ("No More Feeds") : (React.createElement(Loading_1.Loading, null))))));
};
exports.FeedsTab = react_1.memo(RenderFeedsTab);
