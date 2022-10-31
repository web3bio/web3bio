"use strict";
exports.__esModule = true;
exports.ResultGraph = void 0;
var react_1 = require("react");
var lodash_1 = require("lodash");
var utils_1 = require("../../utils/utils");
var maps_1 = require("../../utils/maps");
var LargeRegister_1 = require("./GraphUtils/LargeRegister");
var Loading_1 = require("../shared/Loading");
var react_inlinesvg_1 = require("react-inlinesvg");
var isBrowser = typeof window !== "undefined";
var G6 = isBrowser ? require("@antv/g6") : null;
var graph = null;
var shiftKeydown = false;
var insertCss = isBrowser ? require("insert-css") : null;
if (isBrowser) {
    insertCss("\n  .web5bio-tooltip {\n    background: #fff;\n    z-index: 999;\n    list-style-type: none;\n    border-radius: 8px;\n    font-size: .6rem;\n    width: fit-content;\n    transition: opacity .2s;\n    text-align: left;\n    padding: 4px 8px;\n    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15);\n    border: 0;\n  }\n  .web5bio-tooltip ul {\n    padding-left: 0;\n    margin: 0;\n  }\n  .web5bio-tooltip li {\n    cursor: pointer;\n    list-style-type: none;\n    list-style: none;\n    margin: 0;\n\t}\n\t");
}
if (G6) {
    LargeRegister_1.register();
}
var CANVAS_WIDTH = 800, CANVAS_HEIGHT = 800;
var resolveGraphData = function (source) {
    var nodes = [];
    var edges = [];
    source.forEach(function (x, idx) {
        var _a, _b;
        var from = x.from;
        var to = x.to;
        nodes.push({
            id: to.uuid,
            label: utils_1.formatText((_a = to.displayName) !== null && _a !== void 0 ? _a : to.identity),
            platform: to.platform,
            source: x.source,
            displayName: to.displayName,
            identity: to.identity,
            isIdentity: true
        });
        nodes.push({
            id: from.uuid,
            label: utils_1.formatText((_b = from.displayName) !== null && _b !== void 0 ? _b : from.identity),
            platform: from.platform,
            source: x.source,
            displayName: from.displayName,
            identity: from.identity,
            isIdentity: true
        });
        edges.push({
            source: from.uuid,
            target: to.uuid,
            label: maps_1.platformsMap[x.source],
            id: from.uuid + "-" + to.uuid,
            isIdentity: true
        });
        from.nft.forEach(function (k) {
            if (k.category === "ENS") {
                nodes.push({
                    id: k.uuid,
                    label: k.id,
                    category: k.category,
                    chain: k.chain,
                    holder: from.identity,
                    identity: k.id,
                    platform: "ens"
                });
                edges.push({
                    source: from.uuid,
                    target: k.uuid,
                    // label: "hold",
                    id: from.uuid + "-" + k.uuid
                });
            }
        });
        to.nft.forEach(function (k) {
            if (k.category === "ENS") {
                nodes.push({
                    id: k.uuid,
                    label: k.id,
                    category: k.category,
                    chain: k.chain,
                    holder: to.identity,
                    platform: "ens"
                });
                edges.push({
                    source: to.uuid,
                    target: k.uuid,
                    // label: "hold",
                    id: to.uuid + "-" + k.uuid
                });
            }
        });
    });
    var _nodes = lodash_1["default"].uniqBy(nodes, "id");
    var _edges = lodash_1["default"].uniqBy(edges, "id");
    return { nodes: _nodes, edges: _edges };
};
var processNodesEdges = function (nodes, edges) {
    // todo: processs edges and nodes
    nodes.forEach(function (node) {
        if (node.isIdentity) {
            // Identity
            node.size = 96;
            node.style = {
                lineWidth: 2
            };
            node.stateStyles = {
                selected: {
                    stroke: maps_1.colorsMap[node.platform],
                    fill: maps_1.colorsMap[node.platform],
                    fillOpacity: 0.1,
                    lineWidth: 2,
                    shadowColor: "transparent",
                    zIndex: 999
                }
            };
        }
        else {
            // ENS
            node.size = 24;
            node.labelCfg = {
                labelLineNum: 1,
                position: "bottom"
            };
            node.style = {
                lineWidth: 2,
                fill: maps_1.colorsMap[node.platform],
                stroke: "rgba(0, 0, 0, .05)"
            };
            node.stateStyles = {
                selected: {
                    lineWidth: 2,
                    shadowColor: "transparent",
                    zIndex: 999
                }
            };
        }
        node.type = "identity-node";
        node.label = utils_1.formatText(node.label);
        if (node.platform && node.platform.toLowerCase() === "ethereum") {
            node.label = (node.displayName || utils_1.formatText(node.identity)) + " " + (node.displayName ? "\n" + utils_1.formatText(node.identity) : "");
            node.labelLineNum = node.displayName ? 2 : 1;
        }
    });
    edges.forEach(function (edge) {
        if (edge.isIdentity) {
            // Identity
            edge.type = "quadratic";
            edge.curveOffset = 0;
            edge.stateStyles = {
                selected: {
                    stroke: "#cecece",
                    shadowColor: "transparent",
                    zIndex: 999
                }
            };
        }
        else {
            // ENS
            edge.type = "line";
            edge.stateStyles = {
                selected: {
                    stroke: "#cecece",
                    shadowColor: "transparent",
                    zIndex: 999
                }
            };
        }
    });
    // G6.Util.processParallelEdges(edges);
};
// eslint-disable-next-line react/display-name
var RenderResultGraph = function (props) {
    var data = props.data, onClose = props.onClose, title = props.title;
    var container = react_1["default"].useRef(null);
    var tooltipContainer = react_1["default"].useRef(null);
    var _a = react_1.useState(true), loading = _a[0], setLoading = _a[1];
    react_1.useEffect(function () {
        if (graph || !data)
            return;
        if (container && container.current) {
            CANVAS_WIDTH = container.current.offsetWidth;
            CANVAS_HEIGHT = container.current.offsetHeight;
        }
        var res = resolveGraphData(data);
        processNodesEdges(res.nodes, res.edges);
        var tooltip = new G6.Tooltip({
            className: "web5bio-tooltip",
            container: tooltipContainer.current,
            getContent: function (e) {
                var outDiv = document.createElement("div");
                if (e.item.getModel().isIdentity) {
                    outDiv.innerHTML = "\n          <ul>\n            <li>DisplayName: " + (e.item.getModel().displayName || "-") + "</li>\n            <li>Identity: " + (e.item.getModel().identity || "-") + "</li>\n            <li>Platform: " + maps_1.platformsMap[e.item.getModel().platform || "unknown"] + "</li>\n            <li>Source: " + maps_1.platformsMap[e.item.getModel().source || "unknown"] + "</li>\n          </ul>";
                }
                else {
                    outDiv.innerHTML = "\n          <ul>\n            <li>ENS: " + (e.item.getModel().identity || "Unknown") + "</li>\n            <li>Owner: " + (e.item.getModel().holder || "Unknown") + "</li>\n          </ul>";
                }
                return outDiv;
            },
            fixToNode: [1, 0],
            itemTypes: ["node"]
        });
        graph = new G6.Graph({
            container: container.current,
            CANVAS_WIDTH: CANVAS_WIDTH,
            CANVAS_HEIGHT: CANVAS_HEIGHT,
            defaultEdge: {
                labelCfg: {
                    autoRotate: true,
                    style: {
                        stroke: "#fff",
                        linWidth: 4,
                        fill: "#999",
                        fontSize: "10px"
                    }
                },
                style: {
                    endArrow: {
                        path: "M 0,0 L 5,2.5 L 5,-2.5 Z",
                        fill: "#cecece",
                        stroke: "#cecece"
                    }
                }
            },
            layout: {
                type: "gForce",
                preventOverlap: true,
                // gpuEnabled: true,
                linkDistance: function (d) {
                    if (d.isIdentity) {
                        return 240;
                    }
                    return 180;
                },
                nodeSpacing: function (d) {
                    if (d.isIdentity) {
                        return 240;
                    }
                    return 180;
                },
                nodeStrength: function (d) {
                    if (d.isIdentity) {
                        return 480;
                    }
                    return 180;
                },
                edgeStrength: function (d) {
                    if (d.isIdentity) {
                        return 30;
                    }
                    return 20;
                },
                onLayoutEnd: function () {
                    setLoading(false);
                }
            },
            modes: {
                "default": ["drag-canvas", "drag-node"]
            },
            plugins: [tooltip]
        });
        graph.get("canvas").set("localRefresh", false);
        graph.data({
            nodes: res.nodes,
            edges: res.edges
        });
        graph.render();
        var bindListener = function () {
            graph.on("keydown", function (evt) {
                var code = evt.key;
                if (!code) {
                    return;
                }
                if (code.toLowerCase() === "shift") {
                    shiftKeydown = true;
                }
                else {
                    shiftKeydown = false;
                }
            });
            graph.on("keyup", function (evt) {
                var code = evt.key;
                if (!code) {
                    return;
                }
                if (code.toLowerCase() === "shift") {
                    shiftKeydown = false;
                }
            });
            graph.on("node:dragstart", function (e) {
                refreshDragedNodePosition(e);
            });
            graph.on("node:drag", function (e) {
                refreshDragedNodePosition(e);
            });
            graph.on("node:dragend", function (e) {
                e.item.get("model").fx = null;
                e.item.get("model").fy = null;
            });
            graph.on("node:click", function (evt) {
                if (!shiftKeydown)
                    clearFocusItemState(graph);
                var item = evt.item;
                graph.setItemState(item, "selected", true);
                var relatedEdges = item.getEdges();
                relatedEdges.forEach(function (edge) {
                    graph.setItemState(edge, "selected", true);
                });
            });
            graph.on("canvas:click", function (evt) {
                graph.getNodes().forEach(function (node) {
                    graph.clearItemStates(node);
                });
                graph.getEdges().forEach(function (edge) {
                    graph.clearItemStates(edge);
                });
            });
            if (typeof window !== "undefined")
                window.onresize = function () {
                    if (!graph || graph.get("destroyed"))
                        return;
                    if (!container.current)
                        return;
                    graph.changeSize(container.current.offsetWidth, container.current.offsetHeight);
                    graph.layout();
                };
        };
        var clearFocusItemState = function (graph) {
            if (!graph)
                return;
            var focusNodes = graph.findAllByState("node", "selected");
            focusNodes.forEach(function (fnode) {
                graph.setItemState(fnode, "selected", false);
            });
            var focusEdges = graph.findAllByState("edge", "selected");
            focusEdges.forEach(function (fedge) {
                graph.setItemState(fedge, "selected", false);
            });
        };
        var refreshDragedNodePosition = function (e) {
            var model = e.item.get("model");
            model.fx = e.x;
            model.fy = e.y;
        };
        bindListener();
        return function () {
            graph.destroy();
            graph = null;
        };
    }, [data]);
    return (react_1["default"].createElement("div", { className: "graph-mask", ref: tooltipContainer, onClick: onClose }, data && (react_1["default"].createElement("div", { className: "graph-container", ref: container, onClick: function (e) {
            e.stopPropagation();
            e.preventDefault();
        } },
        react_1["default"].createElement("div", { className: "graph-header" },
            react_1["default"].createElement("div", { className: "graph-title" },
                react_1["default"].createElement(react_inlinesvg_1["default"], { src: '/icons/icon-view.svg', width: "20", height: "20" }),
                react_1["default"].createElement("span", { className: "ml-2" },
                    "Identity Graph for",
                    react_1["default"].createElement("strong", { className: "ml-1" }, title))),
            react_1["default"].createElement("div", { className: "btn btn-link graph-close", onClick: onClose },
                react_1["default"].createElement(react_inlinesvg_1["default"], { src: '/icons/icon-close.svg', width: "20", height: "20" }))),
        loading && (react_1["default"].createElement("div", { className: "loading-mask" },
            react_1["default"].createElement(Loading_1.Loading, null)))))));
};
exports.ResultGraph = react_1.memo(RenderResultGraph);
