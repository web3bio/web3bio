"use strict";
exports.__esModule = true;
exports.ResultAccountItem = void 0;
var react_1 = require("react");
var image_1 = require("next/image");
var link_1 = require("next/link");
var react_clipboard_js_1 = require("react-clipboard.js");
var react_inlinesvg_1 = require("react-inlinesvg");
var utils_1 = require("../../utils/utils");
var SourcesFooter_1 = require("./SourcesFooter");
var type_1 = require("../../utils/type");
var router_1 = require("next/router");
var RenderAccountItem = function (props) {
    var _a;
    var onCopySuccess = function () {
        setIsCopied(true);
        setTimeout(function () {
            setIsCopied(false);
        }, 1500);
    };
    var identity = props.identity, sources = props.sources;
    var _b = react_1.useState(false), isCopied = _b[0], setIsCopied = _b[1];
    var router = router_1.useRouter();
    switch (identity.platform) {
        case type_1.PlatformType.ethereum:
            return (react_1["default"].createElement("div", { className: "social-item social-web3 ethereum" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement("div", { className: "social" },
                        react_1["default"].createElement("figure", { className: "avatar bg-pride" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-ethereum.svg", width: 20, height: 20 })),
                        react_1["default"].createElement("div", { className: "content" },
                            react_1["default"].createElement("div", { className: "content-title text-bold" }, identity.displayName
                                ? identity.displayName
                                : utils_1.formatText(identity.identity)),
                            react_1["default"].createElement("div", { className: "content-subtitle text-gray" },
                                react_1["default"].createElement("div", { className: "address hide-xs" }, identity.identity),
                                react_1["default"].createElement("div", { className: "address show-xs" }, utils_1.formatText(identity.identity)),
                                react_1["default"].createElement(react_clipboard_js_1["default"], { component: "div", className: "action", "data-clipboard-text": identity.identity, onSuccess: onCopySuccess },
                                    react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-copy.svg", width: 20, height: 20 }),
                                    isCopied && react_1["default"].createElement("div", { className: "tooltip-copy" }, "COPIED")))),
                        react_1["default"].createElement(link_1["default"], { href: "/" + (identity.displayName || identity.identity) + "?s=" + router.query.s, className: "actions" },
                            react_1["default"].createElement("button", { className: "btn btn-sm btn-link action", title: "Link Identity Panel" },
                                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                                "Open"))),
                    ((_a = identity.nft) === null || _a === void 0 ? void 0 : _a.length) > 0 && (react_1["default"].createElement("div", { className: "nfts" }, identity.nft.map(function (nft, idx) {
                        return nft.category == "ENS" ? (react_1["default"].createElement(link_1["default"], { key: nft.uuid + "-" + idx, href: {
                                pathname: "/",
                                query: { s: nft.id }
                            } },
                            react_1["default"].createElement("div", { className: "label-ens", title: nft.id },
                                react_1["default"].createElement(image_1["default"], { src: "/icons/icon-ens.svg", width: 16, height: 16, alt: "ens" }),
                                react_1["default"].createElement("span", null, nft.id)))) : null;
                    })))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        case type_1.PlatformType.lens:
            return (react_1["default"].createElement("div", { className: "social-item lens" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement("div", { className: "social" },
                        react_1["default"].createElement("figure", { className: "avatar bg-lens" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-lens.svg", width: 20, height: 20 })),
                        react_1["default"].createElement("div", { className: "content" },
                            react_1["default"].createElement("div", { className: "content-title text-bold" }, identity.displayName
                                ? identity.displayName
                                : identity.identity),
                            react_1["default"].createElement("div", { className: "content-subtitle text-gray" },
                                react_1["default"].createElement("div", { className: "address" }, identity.identity),
                                react_1["default"].createElement(react_clipboard_js_1["default"], { component: "div", className: "action", "data-clipboard-text": identity.identity, onSuccess: onCopySuccess },
                                    react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-copy.svg", width: 20, height: 20 }),
                                    isCopied && react_1["default"].createElement("div", { className: "tooltip-copy" }, "COPIED"))))),
                    react_1["default"].createElement("div", { className: "actions" },
                        react_1["default"].createElement("a", { className: "btn btn-sm btn-link action", href: "https://www.lensfrens.xyz/" + identity.identity, title: "Open LensFrens", target: "_blank", rel: "noopener noreferrer" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                            " OPEN"))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        case type_1.PlatformType.dotbit:
            return (react_1["default"].createElement("div", { className: "social-item dotbit" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement(link_1["default"], { href: {
                            pathname: "/",
                            query: {
                                s: identity.identity
                            }
                        } },
                        react_1["default"].createElement("div", { className: "social" },
                            react_1["default"].createElement("div", { className: "icon" },
                                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-dotbit.svg", width: 20, height: 20 })),
                            react_1["default"].createElement("div", { className: "title" }, identity.displayName))),
                    react_1["default"].createElement("div", { className: "actions" },
                        react_1["default"].createElement("a", { className: "btn btn-sm btn-link action", href: "https://data.did.id/" + identity.displayName, title: "Open Keybase", target: "_blank", rel: "noopener noreferrer" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                            " OPEN"))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        case type_1.PlatformType.twitter:
            return (react_1["default"].createElement("div", { className: "social-item twitter" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement(link_1["default"], { href: {
                            pathname: "/",
                            query: { s: identity.identity }
                        } },
                        react_1["default"].createElement("div", { className: "social" },
                            react_1["default"].createElement("div", { className: "icon" },
                                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-twitter.svg", width: 20, height: 20 })),
                            react_1["default"].createElement("div", { className: "title" }, identity.displayName))),
                    react_1["default"].createElement("div", { className: "actions" },
                        react_1["default"].createElement("a", { className: "btn btn-sm btn-link action", href: "https://twitter.com/" + identity.identity, title: "Open Twitter", target: "_blank", rel: "noopener noreferrer" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                            " OPEN"))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        case type_1.PlatformType.github:
            return (react_1["default"].createElement("div", { className: "social-item github" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement(link_1["default"], { href: {
                            pathname: "/",
                            query: {
                                s: identity.identity,
                                platform: identity.platform
                            }
                        } },
                        react_1["default"].createElement("div", { className: "social" },
                            react_1["default"].createElement("div", { className: "icon" },
                                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-github.svg", width: 20, height: 20 })),
                            react_1["default"].createElement("div", { className: "title" }, identity.displayName))),
                    react_1["default"].createElement("div", { className: "actions" },
                        react_1["default"].createElement("a", { className: "btn btn-sm btn-link action", href: "https://github.com/" + identity.identity, title: "Open GitHub", target: "_blank", rel: "noopener noreferrer" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                            " OPEN"))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        case type_1.PlatformType.keybase:
            return (react_1["default"].createElement("div", { className: "social-item keybase" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement(link_1["default"], { href: {
                            pathname: "/",
                            query: {
                                s: identity.identity,
                                platform: identity.platform
                            }
                        } },
                        react_1["default"].createElement("div", { className: "social" },
                            react_1["default"].createElement("div", { className: "icon" },
                                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-keybase.svg", width: 20, height: 20 })),
                            react_1["default"].createElement("div", { className: "title" }, identity.displayName))),
                    react_1["default"].createElement("div", { className: "actions" },
                        react_1["default"].createElement("a", { className: "btn btn-sm btn-link action", href: "https://keybase.io/" + identity.displayName, title: "Open Keybase", target: "_blank", rel: "noopener noreferrer" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                            " OPEN"))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        case type_1.PlatformType.reddit:
            return (react_1["default"].createElement("div", { className: "social-item reddit" },
                react_1["default"].createElement("div", { className: "social-main" },
                    react_1["default"].createElement(link_1["default"], { href: {
                            pathname: "/",
                            query: {
                                s: identity.identity,
                                platform: identity.platform
                            }
                        } },
                        react_1["default"].createElement("div", { className: "social" },
                            react_1["default"].createElement("div", { className: "icon" },
                                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-reddit.svg", width: 20, height: 20 })),
                            react_1["default"].createElement("div", { className: "title" }, identity.displayName))),
                    react_1["default"].createElement("div", { className: "actions" },
                        react_1["default"].createElement("a", { className: "btn btn-sm btn-link action", href: "https://www.reddit.com/user/" + identity.displayName, title: "Open Reddit", target: "_blank", rel: "noopener noreferrer" },
                            react_1["default"].createElement(react_inlinesvg_1["default"], { src: "icons/icon-open.svg", width: 20, height: 20 }),
                            " OPEN"))),
                react_1["default"].createElement(SourcesFooter_1.RenderSourceFooter, { sources: sources })));
        default:
            return null;
    }
};
exports.ResultAccountItem = react_1.memo(RenderAccountItem);
