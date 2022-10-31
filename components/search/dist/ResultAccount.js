"use strict";
exports.__esModule = true;
exports.ResultAccount = void 0;
var react_1 = require("react");
var ResultAccountItem_1 = require("./ResultAccountItem");
var ResultGraph_1 = require("../graph/ResultGraph");
var react_inlinesvg_1 = require("react-inlinesvg");
var IdentityPanel_1 = require("../panel/IdentityPanel");
var RenderAccount = function (props) {
    var searchTerm = props.searchTerm, resultNeighbor = props.resultNeighbor, graphData = props.graphData;
    var _a = react_1.useState(false), open = _a[0], setOpen = _a[1];
    var _b = react_1.useState(false), showPanbel = _b[0], setShowPanel = _b[1];
    return (react_1["default"].createElement("div", { className: "search-result" },
        react_1["default"].createElement("div", { className: "search-result-header" },
            react_1["default"].createElement("div", { className: "search-result-text text-gray" }, "Identity Graph results:"),
            graphData.length > 0 && (react_1["default"].createElement("div", { className: "btn btn-link btn-sm", onClick: function () { return setOpen(true); } },
                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "../assets/icons/icon-view.svg", width: 20, height: 20 }),
                " ",
                "Visualize"))),
        react_1["default"].createElement("div", { className: "search-result-body" }, resultNeighbor.length > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null, resultNeighbor.map(function (avatar) { return (react_1["default"].createElement(ResultAccountItem_1.ResultAccountItem, { identity: avatar.identity, sources: avatar.sources, key: avatar.identity.uuid, showPanel: function (item) {
                console.log(item);
                setShowPanel(true);
            } })); }))) : null),
        open && (react_1["default"].createElement(ResultGraph_1.ResultGraph, { onClose: function () { return setOpen(false); }, data: graphData, title: searchTerm })),
        showPanbel && react_1["default"].createElement(IdentityPanel_1.IdentityPanel, { onClose: function () { return setShowPanel(false); } })));
};
exports.ResultAccount = react_1.memo(RenderAccount);
