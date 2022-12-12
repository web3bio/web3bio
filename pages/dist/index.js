"use strict";
exports.__esModule = true;
var head_1 = require("next/head");
var link_1 = require("next/link");
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var IdentityPanel_1 = require("../components/panel/IdentityPanel");
var SearchResultDomain_1 = require("../components/search/SearchResultDomain");
var SearchResultQuery_1 = require("../components/search/SearchResultQuery");
var utils_1 = require("../utils/utils");
var ____domain_1 = require("./[...domain]");
function Home() {
    var _a = react_1.useState(false), searchFocus = _a[0], setSearchFocus = _a[1];
    var _b = react_1.useState(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = react_1.useState(false), modalOpen = _c[0], setModalOpen = _c[1];
    var _d = react_1.useState(null), profileIdentity = _d[0], setProfileIdentity = _d[1];
    var _e = react_1.useState(null), profilePlatform = _e[0], setProfilePlatform = _e[1];
    var _f = react_1.useState(""), searchPlatform = _f[0], setsearchPlatform = _f[1];
    var _g = react_1.useState(IdentityPanel_1.TabsMap.profile.key), panelTab = _g[0], setPanelTab = _g[1];
    var inputRef = react_1.useRef(null);
    var handleSubmit = function (e) {
        e.preventDefault();
        var ipt = inputRef.current;
        if (!ipt)
            return;
        setSearchTerm(ipt.value);
        setsearchPlatform(utils_1.handleSearchPlatform(ipt.value));
        setSearchFocus(true);
    };
    var openProfile = function (identity, platform) {
        setProfileIdentity(identity);
        setProfilePlatform(platform);
        setModalOpen(true);
    };
    react_1.useEffect(function () {
        if (modalOpen) {
            window.history.replaceState({}, "", "/" + (profileIdentity.displayName || profileIdentity.identity) + (panelTab === IdentityPanel_1.TabsMap.profile.key ? "" : "/" + panelTab));
        }
        else {
            window.history.replaceState({}, "", "/");
        }
    }, [modalOpen, profileIdentity, panelTab]);
    return (React.createElement("div", null,
        React.createElement(head_1["default"], null,
            searchTerm ? (React.createElement("title", null,
                searchTerm,
                " - Web5.bio")) : (React.createElement("title", null, "Web5.bio")),
            React.createElement("meta", { name: "description", content: "Web5.bio is a Web3 and Web 2.0 Identity Graph search service which is powered by Next.ID. Web5.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain or Lens Profile." }),
            React.createElement("link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" })),
        React.createElement("main", { className: "web3bio-container" },
            React.createElement("div", { className: "web3bio-cover flare" }),
            React.createElement("div", { className: searchFocus ? "web3bio-search focused" : "web3bio-search" },
                React.createElement("div", { className: "container grid-xs" },
                    React.createElement("form", { autoComplete: "off", role: "search", className: "search-form" },
                        React.createElement(link_1["default"], { href: {
                                pathname: "/",
                                query: {}
                            } },
                            React.createElement("div", { className: "web3bio-logo", title: "Web5.bio" },
                                React.createElement("h1", { className: "text-pride" },
                                    "WEB5",
                                    React.createElement("br", null),
                                    "BIO"))),
                        React.createElement("div", { className: "form-label" },
                            "Web3 ",
                            React.createElement("span", null, "Identity Search")),
                        React.createElement("div", { className: "form-input-group" },
                            React.createElement("input", { ref: inputRef, key: searchTerm, type: "text", placeholder: "Search Twitter, Lens, ENS or Ethereum", defaultValue: searchTerm, className: "form-input input-lg", autoCorrect: "off", autoFocus: true, spellCheck: "false", id: "searchbox" }),
                            React.createElement("button", { type: "submit", title: "Submit", className: "form-button btn", onClickCapture: handleSubmit },
                                React.createElement(react_inlinesvg_1["default"], { src: "icons/icon-search.svg", width: 24, height: 24, className: "icon" })))),
                    searchPlatform ? (utils_1.isDomainSearch(searchPlatform) ? (React.createElement(SearchResultDomain_1.SearchResultDomain, { openProfile: openProfile, searchTerm: searchTerm, searchPlatform: searchPlatform })) : (React.createElement(SearchResultQuery_1.SearchResultQuery, { openProfile: openProfile, searchTerm: searchTerm, searchPlatform: searchPlatform }))) : null)),
            React.createElement("div", { className: "web3bio-footer" },
                React.createElement("div", { className: "container grid-lg" },
                    React.createElement("div", { className: "columns" },
                        React.createElement("div", { className: "column col-12" },
                            React.createElement("div", { className: "mt-4 mb-4" },
                                React.createElement("a", { href: "https://twitter.com/web3bio", className: "btn-link text-dark ml-2 mr-2", target: "_blank", rel: "noopener noreferrer" },
                                    React.createElement(react_inlinesvg_1["default"], { src: "icons/icon-twitter.svg", width: 20, height: 20, className: "icon" })),
                                React.createElement("a", { href: "https://github.com/web3bio/web5bio", className: "btn-link ml-2 mr-2", target: "_blank", rel: "noopener noreferrer" },
                                    React.createElement(react_inlinesvg_1["default"], { src: "icons/icon-github.svg", width: 20, height: 20, className: "icon" }))),
                            React.createElement("div", { className: "mt-2" },
                                "A",
                                " ",
                                React.createElement("a", { href: "https://web3.bio", target: "_blank", rel: "noopener noreferrer" }, "Web3.bio"),
                                " ",
                                "project crafted with",
                                " ",
                                React.createElement("span", { className: "text-pride" }, "\u2665"),
                                " \u00B7 Built with",
                                " ",
                                React.createElement("a", { href: "https://next.id", target: "_blank", rel: "noopener noreferrer" }, "Next.ID"))))))),
        modalOpen && (React.createElement(____domain_1["default"], { toNFT: function () {
                setPanelTab(IdentityPanel_1.TabsMap.nfts.key);
            }, asComponent: true, onClose: function () {
                setModalOpen(false);
            }, overridePanelTab: panelTab, onTabChange: function (v) {
                setPanelTab(v);
            }, domain: [profileIdentity.displayName || profileIdentity.identity], overridePlatform: profilePlatform }))));
}
exports["default"] = Home;
