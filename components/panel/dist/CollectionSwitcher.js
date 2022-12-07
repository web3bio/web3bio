"use strict";
exports.__esModule = true;
exports.CollectionSwitcher = void 0;
var react_1 = require("react");
var NFTAssetPlayer_1 = require("../shared/NFTAssetPlayer");
var RenderCollectionSwitcher = function (props) {
    var collections = props.collections, currentSelect = props.currentSelect, onSelect = props.onSelect;
    var _a = react_1.useState(currentSelect), active = _a[0], setActive = _a[1];
    var hideDropdownMenu = function (v) {
        setActive(v.key);
        onSelect(v.key);
    };
    return (React.createElement("div", { className: "collection-switcher" },
        React.createElement("div", { className: "collection-list" }, collections.map(function (item) { return (React.createElement("div", { onClick: function () { return hideDropdownMenu(item); }, className: item.key === active
                ? "collection-item active"
                : "collection-item", key: item.key },
            React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { className: "collection-img", src: item.url, alt: item.name }),
            React.createElement("div", { className: "collection-name text-assistive" }, item.name))); }))));
};
exports.CollectionSwitcher = react_1.memo(RenderCollectionSwitcher);
