"use strict";
exports.__esModule = true;
exports.CollectionSwitcher = void 0;
var react_1 = require("react");
var Dropdown_1 = require("../shared/Dropdown");
var RenderCollectionSwitcher = function (props) {
    var collections = props.collections, currentSelect = props.currentSelect, onSelect = props.onSelect;
    return (React.createElement("div", { className: "collection-switcher" },
        React.createElement(Dropdown_1.Dropdown, { items: collections, active: currentSelect })));
};
exports.CollectionSwitcher = react_1.memo(RenderCollectionSwitcher);
