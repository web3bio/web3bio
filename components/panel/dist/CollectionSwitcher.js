"use strict";
exports.__esModule = true;
exports.CollectionSwitcher = void 0;
var react_1 = require("react");
var image_1 = require("next/image");
var RenderCollectionSwitcher = function (props) {
    var collections = props.collections, currentSelect = props.currentSelect, onSelect = props.onSelect;
    var _a = react_1.useState(false), displayMenu = _a[0], setDisplayMenu = _a[1];
    var _b = react_1.useState(currentSelect), active = _b[0], setActive = _b[1];
    var hideDropdownMenu = function (v) {
        setDisplayMenu(false);
        setActive(v);
        onSelect(v);
    };
    return (React.createElement("div", { className: "collection-switcher" },
        React.createElement("div", null),
        React.createElement("div", { className: "dropdown-box" },
            React.createElement("div", { className: "dropdown-button", onClick: function () { return setDisplayMenu(!displayMenu); } },
                React.createElement("picture", { className: "collection-img" },
                    React.createElement("img", { className: "collection-img", src: active.url, alt: "" })),
                React.createElement("div", { className: "collection-name" }, active.name),
                React.createElement("div", { className: "collection-switch-arrow" },
                    React.createElement(image_1["default"], { width: 8, height: 8, src: "/icons/switch.svg", alt: "" }))),
            displayMenu && (React.createElement("div", { className: "dropdown-menu" }, collections.map(function (item) { return (React.createElement("div", { onClick: function () { return hideDropdownMenu(item); }, className: item.key === active.key
                    ? "dropdown-button active"
                    : "dropdown-button", key: item.key },
                React.createElement("picture", { className: "collection-img" },
                    React.createElement("img", { className: "collection-img", src: item.url, alt: "" })),
                React.createElement("div", { className: "collection-name" }, item.name),
                React.createElement("div", null))); }))))));
};
exports.CollectionSwitcher = react_1.memo(RenderCollectionSwitcher);
