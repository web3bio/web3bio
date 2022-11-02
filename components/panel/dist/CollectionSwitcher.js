"use strict";
exports.__esModule = true;
exports.CollectionSwitcher = void 0;
var image_1 = require("next/image");
var react_1 = require("react");
var RenderCollectionSwitcher = function (props) {
    var collections = props.collections, currentSelect = props.currentSelect, onSelect = props.onSelect;
    console.log(collections, 'gggg');
    return (React.createElement("div", { className: "collection-switcher" },
        React.createElement(image_1["default"], { width: 20, height: 20, className: "collection-img", src: "/img/collection.png", alt: "" }),
        React.createElement("div", { className: "collection-name" }, "Collections"),
        React.createElement("div", { className: "collection-switch-arrow" },
            React.createElement(image_1["default"], { width: 8, height: 8, src: "/icons/switch.svg", alt: "" }))));
};
exports.CollectionSwitcher = react_1.memo(RenderCollectionSwitcher);
