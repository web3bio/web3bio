"use strict";
exports.__esModule = true;
exports.IdentityPanel = void 0;
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var utils_1 = require("../../utils/utils");
var FeedsTab_1 = require("./FeedsTab");
var NFTsTab_1 = require("./NFTsTab");
var TabsMap;
(function (TabsMap) {
    // profile = "Profile",
    TabsMap["feeds"] = "Feeds";
    TabsMap["nfts"] = "NFTs";
})(TabsMap || (TabsMap = {}));
var IdentityPanelRender = function (props) {
    var onClose = props.onClose;
    var _a = react_1.useState(TabsMap.feeds), activeTab = _a[0], setActiveTab = _a[1];
    var renderContent = function () {
        var _a;
        return (_a = {},
            _a[TabsMap.feeds] = React.createElement(FeedsTab_1.FeedsTab, null),
            _a[TabsMap.nfts] = React.createElement(NFTsTab_1.NFTsTab, null),
            _a)[activeTab];
    };
    return (React.createElement("div", { className: "panel-container" },
        React.createElement("div", { className: "close-icon-box", onClick: onClose },
            React.createElement(react_inlinesvg_1["default"], { className: "close-icon", src: '/icons/icon-close.svg' })),
        React.createElement("div", { className: "panel-identity-basic" },
            React.createElement("div", { className: "identity-avatar-container" },
                React.createElement("img", { src: "https://pbs.twimg.com/profile_images/1582110337569935362/xrMkOl7h_400x400.jpg", alt: "" })),
            React.createElement("div", { className: "identity-basic-info" },
                React.createElement("div", { className: "displayName" }, "sujiyan.eth"),
                React.createElement("div", { className: "identity" },
                    "0x983110309620D911731Ac0932219af06091b6744",
                    React.createElement(react_inlinesvg_1["default"], { className: "copy-icon", src: "icons/icon-copy.svg", width: 16, height: 16 })))),
        React.createElement("div", { className: "panel-tab-contianer" },
            React.createElement("ul", { className: "panel-tab" }, utils_1.getEnumAsArray(TabsMap).map(function (x, idx) {
                return (React.createElement("li", { key: idx, className: activeTab === x.value ? "tab-item active" : "tab-item", onClick: function () { return setActiveTab(x.value); } },
                    React.createElement("a", { href: "#" }, x.value)));
            }))),
        React.createElement("div", { className: "panel-body" }, renderContent())));
};
exports.IdentityPanel = react_1.memo(IdentityPanelRender);
