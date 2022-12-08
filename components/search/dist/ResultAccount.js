"use strict";
exports.__esModule = true;
exports.ResultAccount = void 0;
var react_1 = require("react");
var ResultAccountItem_1 = require("./ResultAccountItem");
var ResultGraph_1 = require("../graph/ResultGraph");
var react_inlinesvg_1 = require("react-inlinesvg");
var RenderAccount = function (props) {
    var searchTerm = props.searchTerm, resultNeighbor = props.resultNeighbor, graphData = props.graphData;
    var _a = react_1.useState(false), open = _a[0], setOpen = _a[1];
    return (react_1["default"].createElement("div", { className: "search-result" },
        react_1["default"].createElement("div", { className: "search-result-header" },
            react_1["default"].createElement("div", { className: "search-result-text text-gray" }, "Identity Graph results:"),
            graphData.length > 0 && (react_1["default"].createElement("div", { className: "btn btn-link btn-sm", onClick: function () { return setOpen(true); } },
                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "/icons/icon-view.svg", width: 20, height: 20 }),
                " ",
                "Visualize"))),
        react_1["default"].createElement("div", { className: "search-result-body" }, resultNeighbor.length > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null, resultNeighbor.map(function (avatar) { return (react_1["default"].createElement(ResultAccountItem_1.ResultAccountItem, { identity: avatar.identity, sources: avatar.sources, key: avatar.identity.uuid })); }))) : null),
        open && (react_1["default"].createElement(ResultGraph_1.ResultGraph, { onClose: function () { return setOpen(false); }, data: graphData, title: searchTerm }))));
};
exports.ResultAccount = react_1.memo(RenderAccount);
