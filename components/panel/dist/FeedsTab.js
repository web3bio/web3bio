"use strict";
exports.__esModule = true;
exports.FeedsTab = void 0;
var react_1 = require("react");
var swr_1 = require("swr");
var rss3_1 = require("../apis/rss3");
var Empty_1 = require("../shared/Empty");
var Loading_1 = require("../shared/Loading");
var Error_1 = require("../shared/Error");
function useFeeds(address) {
    var _a = swr_1["default"](rss3_1.RSS3_END_POINT +
        ("notes/" + address + "?limit=50&include_poap=false&count_only=false&query_status=false"), rss3_1.RSS3Fetcher), data = _a.data, error = _a.error;
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}
var RenderFeedsTab = function (props) {
    var address = props.address;
    var _a = useFeeds(address), data = _a.data, isLoading = _a.isLoading, isError = _a.isError;
    if (isLoading)
        return React.createElement(Loading_1.Loading, null);
    if (isError)
        return React.createElement(Error_1.Error, { text: isError });
    if (!data)
        return React.createElement(Empty_1.Empty, null);
    console.log("Feeds from rss3:", data);
    return (React.createElement("div", null,
        React.createElement("div", null, "Feeds See FUll DETAIL in Console"),
        React.createElement("div", { className: "feeds-container" }, data.result.map(function (x, idx) {
            return (React.createElement("div", { key: idx, style: { borderBottom: "1px solid black" } },
                React.createElement("ul", null,
                    React.createElement("li", null,
                        "owner: ",
                        x.owner),
                    React.createElement("li", null,
                        "tag: ",
                        x.tag))));
        }))));
};
exports.FeedsTab = react_1.memo(RenderFeedsTab);
