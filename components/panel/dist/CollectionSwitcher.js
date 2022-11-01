"use strict";
exports.__esModule = true;
exports.CollectionSwitcher = void 0;
var react_1 = require("react");
var RenderCollectionSwitcher = function (props) {
    var collections = props.collections, currentSelect = props.currentSelect, onSelect = props.onSelect;
    return (React.createElement("div", { className: "collection-switcher" },
        React.createElement("img", { className: "collection-img", src: "img/collection.png", alt: "" }),
        React.createElement("div", { className: "collection-name" }, "Collections"),
        React.createElement("div", { className: "collection-switch-arrow" },
            React.createElement("img", { src: "icons/switch.svg", alt: "" }))));
};
exports.CollectionSwitcher = react_1.memo(RenderCollectionSwitcher);
