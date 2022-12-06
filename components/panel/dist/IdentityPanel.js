"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.IdentityPanel = exports.TabsMap = void 0;
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var react_clipboard_js_1 = require("react-clipboard.js");
var utils_1 = require("../../utils/utils");
var FeedsTab_1 = require("./FeedsTab");
var NFTsTab_1 = require("./NFTsTab");
var ProfileTab_1 = require("./ProfileTab");
var react_use_1 = require("react-use");
var ens_1 = require("../../utils/ens");
var NFTAssetPlayer_1 = require("../shared/NFTAssetPlayer");
var Loading_1 = require("../shared/Loading");
var utils_2 = require("../../utils/utils");
var ipfs_1 = require("../../utils/ipfs");
var router_1 = require("next/router");
exports.TabsMap = {
    profile: {
        key: "profile",
        name: "Profile"
    },
    feeds: {
        key: "feeds",
        name: "Feeds"
    },
    nfts: {
        key: "nfts",
        name: "NFTs"
    }
};
var IdentityPanelRender = function (props) {
    var onClose = props.onClose, identity = props.identity, onTabChange = props.onTabChange, curTab = props.curTab;
    var _a = react_1.useState(curTab || exports.TabsMap.feeds.key), activeTab = _a[0], setActiveTab = _a[1];
    var _b = react_1.useState(null), curAsset = _b[0], setCurAsset = _b[1];
    var _c = react_1.useState(null), copied = _c[0], setCopied = _c[1];
    var router = router_1.useRouter();
    var _d = react_use_1.useAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ens_1.ens.name(identity.displayName).getText("avatar")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }), avatar = _d.value, avatarLoading = _d.loading;
    var onCopySuccess = function () {
        setCopied(true);
        setTimeout(function () {
            setCopied(false);
        }, 1500);
    };
    var resolveMediaURL = function (asset) {
        if (asset) {
            return asset.startsWith("data:", "https:")
                ? asset
                : ipfs_1.resolveIPFS_URL(asset);
        }
        return "";
    };
    var renderContent = function () {
        var _a;
        return ((_a = {},
            _a[exports.TabsMap.profile.key] = React.createElement(ProfileTab_1.ProfileTab, { identity: identity }),
            _a[exports.TabsMap.feeds.key] = React.createElement(FeedsTab_1.FeedsTab, { identity: identity }),
            _a[exports.TabsMap.nfts.key] = (React.createElement(NFTsTab_1.NFTsTab, { defaultOpen: !!curAsset, onShowDetail: resolveOnShowDetail, identity: identity })),
            _a)[activeTab] || React.createElement(FeedsTab_1.FeedsTab, { identity: identity }));
    };
    react_1.useEffect(function () {
        if (!router.isReady || !router.query.t)
            return;
        setActiveTab(router.query.t);
    }, [router]);
    var resolveOnShowDetail = function (asset) {
        // todo: to resolve url && nft dialog
    };
    return (React.createElement("div", { className: "identity-panel" },
        React.createElement("div", { className: "panel-container" },
            React.createElement("div", { className: "panel-header" },
                React.createElement("div", { className: "social" },
                    React.createElement("div", { className: "identity-avatar" }, avatarLoading ? (React.createElement(Loading_1.Loading, null)) : (React.createElement(NFTAssetPlayer_1.NFTAssetPlayer, { src: resolveMediaURL(avatar), alt: identity.displayName
                            ? identity.displayName
                            : utils_2.formatText(identity.identity) }))),
                    React.createElement("div", { className: "identity-content content" },
                        React.createElement("div", { className: "content-title text-bold" }, identity.displayName
                            ? identity.displayName
                            : utils_2.formatText(identity.identity)),
                        React.createElement("div", { className: "content-subtitle text-gray" },
                            React.createElement("div", { className: "address hide-xs" }, identity.identity),
                            React.createElement("div", { className: "address show-xs" }, utils_2.formatText(identity.identity)),
                            React.createElement(react_clipboard_js_1["default"], { component: "div", className: "action", "data-clipboard-text": identity.identity, onSuccess: onCopySuccess },
                                React.createElement(react_inlinesvg_1["default"], { src: "icons/icon-copy.svg", width: 20, height: 20 }),
                                copied && React.createElement("div", { className: "tooltip-copy" }, "COPIED"))))),
                React.createElement("div", { className: "btn btn-link btn-close", onClick: function () {
                        localStorage.removeItem('feeds');
                        onClose();
                    } },
                    React.createElement(react_inlinesvg_1["default"], { src: "/icons/icon-close.svg", width: "20", height: "20" })),
                React.createElement("ul", { className: "panel-tab" }, utils_1.getEnumAsArray(exports.TabsMap).map(function (x, idx) {
                    return (React.createElement("li", { key: idx, className: activeTab === x.value.key ? "tab-item active" : "tab-item" },
                        React.createElement("a", { href: "#", onClick: function (e) {
                                e.preventDefault();
                                setActiveTab(x.value.key);
                                onTabChange(x.value.key);
                                localStorage.removeItem('feeds');
                            } }, x.value.name)));
                }))),
            React.createElement("div", { className: "panel-body" }, renderContent()))));
};
exports.IdentityPanel = react_1.memo(IdentityPanelRender);
