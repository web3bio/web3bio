"use strict";
exports.__esModule = true;
var head_1 = require("next/head");
var link_1 = require("next/link");
var router_1 = require("next/router");
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var SearchResultEns_1 = require("../components/search/SearchResultEns");
var SearchResultQuery_1 = require("../components/search/SearchResultQuery");
function Home() {
    var _a = react_1.useState(false), searchFocus = _a[0], setSearchFocus = _a[1];
    var _b = react_1.useState(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = react_1.useState(""), searchPlatform = _c[0], setsearchPlatform = _c[1];
    var router = router_1.useRouter();
    var regexEns = /.*\.eth|.xyz$/, regexLens = /.*\.lens$/, regexDotbit = /.*\.bit$/, regexEth = /^0x[a-fA-F0-9]{40}$/, regexTwitter = /(\w{1,15})\b/;
    var handlesearchPlatform = function (term) {
        switch (true) {
            case regexEns.test(term):
                return "ENS";
            case regexLens.test(term):
                return "lens";
            case regexDotbit.test(term):
                return "dotbit";
            case regexEth.test(term):
                return "ethereum";
            case regexTwitter.test(term):
                return "twitter";
        }
    };
    react_1.useEffect(function () {
        if (!router.isReady)
            return;
        if (router.query.s) {
            setSearchFocus(true);
            // todo: check the type of router querys
            var searchkeyword = router.query.s.toLowerCase();
            setSearchTerm(searchkeyword);
            if (!router.query.platform) {
                var searchPlatform_1 = handlesearchPlatform(searchkeyword);
                setsearchPlatform(searchPlatform_1);
            }
            else {
                setsearchPlatform(router.query.platform.toLowerCase());
            }
        }
        else {
            setSearchFocus(false);
            setSearchTerm("");
            setsearchPlatform("");
        }
    }, [router.isReady, router.query.s, router.query.platform]);
    var handleSubmit = function (e) {
        e.preventDefault();
        if (e.target.searchbox.value) {
            router.push({
                query: {
                    s: e.target.searchbox.value
                }
            });
        }
    };
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
                    React.createElement("form", { className: "search-form", onSubmit: handleSubmit, autoComplete: "off", role: "search" },
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
                            React.createElement("input", { key: searchTerm, type: "text", name: "s", placeholder: "Search Twitter, Lens, ENS or Ethereum", defaultValue: searchTerm, className: "form-input input-lg", autoCorrect: "off", autoFocus: true, spellCheck: "false", id: "searchbox" }),
                            React.createElement("button", { type: "submit", title: "Submit", className: "form-button btn" },
                                React.createElement(react_inlinesvg_1["default"], { src: "icons/icon-search.svg", width: 24, height: 24, className: "icon" })))),
                    searchPlatform ? (searchPlatform === "ENS" ? (React.createElement(SearchResultEns_1.SearchResultEns, { searchTerm: searchTerm })) : (React.createElement(SearchResultQuery_1.SearchResultQuery, { searchTerm: searchTerm, searchPlatform: searchPlatform }))) : null)),
            React.createElement("div", { className: "web3bio-footer" },
                React.createElement("div", { className: "container grid-lg" },
                    React.createElement("div", { className: "columns" },
                        React.createElement("div", { className: "column col-12" },
                            React.createElement("div", { className: "mt-4" },
                                React.createElement("a", { href: "https://twitter.com/web3bio", className: "btn-link ml-2 mr-2", target: "_blank", rel: "noopener noreferrer" },
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
                                " \u00B7 Proudly built with",
                                " ",
                                React.createElement("a", { href: "https://next.id", target: "_blank", rel: "noopener noreferrer" }, "Next.ID")))))))));
}
exports["default"] = Home;
