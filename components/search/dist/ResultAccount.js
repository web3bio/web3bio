"use strict";
exports.__esModule = true;
exports.ResultAccount = void 0;
var react_1 = require("react");
var ResultAccountItem_1 = require("./ResultAccountItem");
var ResultGraph_1 = require("../graph/ResultGraph");
var react_inlinesvg_1 = require("react-inlinesvg");
var IdentityPanel_1 = require("../panel/IdentityPanel");
var router_1 = require("next/router");
var RenderAccount = function (props) {
    var searchTerm = props.searchTerm, resultNeighbor = props.resultNeighbor, graphData = props.graphData;
    var _a = react_1.useState(false), open = _a[0], setOpen = _a[1];
    var _b = react_1.useState(false), showPanbel = _b[0], setShowPanel = _b[1];
    var _c = react_1.useState(undefined), identity = _c[0], setIdentity = _c[1];
    var _d = react_1.useState(''), panelTab = _d[0], setPanelTab = _d[1];
    var router = router_1.useRouter();
    react_1.useEffect(function () {
        if (!router.isReady)
            return;
        if (router.query.s && router.query.d) {
            var cachedIentity = localStorage.getItem("cur_identity");
            if (!cachedIentity)
                return;
            setIdentity(JSON.parse(cachedIentity));
            setPanelTab(router.query.t || IdentityPanel_1.TabsMap.feeds.key);
            setShowPanel(true);
        }
    }, [router.isReady, router.query]);
    var resolveShowPanel = function (item) {
        if (!router.isReady || !router.query.s)
            return;
        router.replace({
            pathname: "",
            query: {
                s: router.query.s,
                d: item.identity,
                t: panelTab
            }
        });
        localStorage.setItem("cur_identity", JSON.stringify(item));
        setIdentity(item);
        setShowPanel(true);
    };
    return (react_1["default"].createElement("div", { className: "search-result" },
        react_1["default"].createElement("div", { className: "search-result-header" },
            react_1["default"].createElement("div", { className: "search-result-text text-gray" }, "Identity Graph results:"),
            graphData.length > 0 && (react_1["default"].createElement("div", { className: "btn btn-link btn-sm", onClick: function () { return setOpen(true); } },
                react_1["default"].createElement(react_inlinesvg_1["default"], { src: "/icons/icon-view.svg", width: 20, height: 20 }),
                " ",
                "Visualize"))),
        react_1["default"].createElement("div", { className: "search-result-body" }, resultNeighbor.length > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null, resultNeighbor.map(function (avatar) { return (react_1["default"].createElement(ResultAccountItem_1.ResultAccountItem, { identity: avatar.identity, sources: avatar.sources, key: avatar.identity.uuid, showPanel: function (item) { return resolveShowPanel(item); } })); }))) : null),
        open && (react_1["default"].createElement(ResultGraph_1.ResultGraph, { onClose: function () { return setOpen(false); }, data: graphData, title: searchTerm })),
        showPanbel && (react_1["default"].createElement(IdentityPanel_1.IdentityPanel, { onTabChange: function (v) {
                router.replace({
                    pathname: "",
                    query: {
                        s: router.query.s,
                        d: router.query.d,
                        t: v
                    }
                });
                setPanelTab(v);
            }, curTab: panelTab, identity: identity, onShowDetail: function (n) { }, onClose: function () {
                setShowPanel(false);
                router.replace({
                    pathname: "",
                    query: {
                        s: router.query.s
                    }
                });
            } }))));
};
exports.ResultAccount = react_1.memo(RenderAccount);
