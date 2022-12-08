"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.register = void 0;
var is_array_1 = require("@antv/util/lib/is-array");
var is_number_1 = require("@antv/util/lib/is-number");
var maps_1 = require("../../../utils/maps");
var type_1 = require("../../../utils/type");
var isBrowser = typeof window !== "undefined";
var G6 = isBrowser ? require("@antv/g6") : null;
var resolvePlatformIcon = function (platform) {
    var _a;
    return ((_a = {},
        _a[type_1.PlatformType.twitter] = "/icons/icon-twitter-w.svg",
        _a[type_1.PlatformType.nextid] = "/icons/icon-nextid-w.svg",
        _a[type_1.PlatformType.keybase] = "/icons/icon-keybase-w.svg",
        _a[type_1.PlatformType.ethereum] = "/icons/icon-ethereum-w.svg",
        _a[type_1.PlatformType.reddit] = "/icons/icon-reddit-w.svg",
        // PlatformType.ens is uppercase
        _a["ens"] = "/icons/icon-ens-w.svg",
        _a[type_1.PlatformType.lens] = "/icons/icon-lens-w.svg",
        _a[type_1.PlatformType.github] = "/icons/icon-github-w.svg",
        _a[type_1.PlatformType.dotbit] = "/icons/icon-dotbit-w.svg",
        _a)[platform] || "");
};
exports.register = function () {
    if (G6) {
        // Custom identity node
        G6.registerNode("identity-node", {
            draw: function (cfg, group) {
                var r = 20;
                if (is_number_1["default"](cfg.size)) {
                    r = cfg.size / 2;
                }
                else if (is_array_1["default"](cfg.size)) {
                    r = cfg.size[0] / 2;
                }
                var style = cfg.style || {};
                // const colorSet = cfg.colorSet || colorSets[0];
                var keyShape = group.addShape("circle", {
                    attrs: __assign(__assign({}, style), { x: 0, y: 0, r: r, fill: "#fff", stroke: maps_1.colorsMap[cfg.platform], opacity: 1, lineWidth: 2, cursor: "pointer" }),
                    name: "aggregated-node-keyShape"
                });
                var labelStyle = {};
                if (cfg.labelCfg) {
                    labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
                }
                if (cfg.label) {
                    var text = cfg.label;
                    var labelStyle_1 = {};
                    var refY = 0;
                    if (cfg.labelCfg) {
                        labelStyle_1 = Object.assign(labelStyle_1, cfg.labelCfg.style);
                        refY += cfg.labelCfg.refY || 0;
                    }
                    var offsetY = 0;
                    var fontSize = labelStyle_1.fontSize < 8 ? 8 : labelStyle_1.fontSize;
                    var lineNum = cfg.labelLineNum || 1;
                    offsetY = lineNum * (fontSize || 12);
                    group.addShape("text", {
                        attrs: {
                            text: text,
                            x: 0,
                            y: cfg.platform === "ens" ? 28 : 8 * lineNum,
                            textAlign: "center",
                            textBaseLine: "middle",
                            cursor: "pointer",
                            fontSize: 12,
                            fill: "#121212",
                            opacity: 1,
                            zIndex: 999
                        },
                        name: "text-shape",
                        className: "text-shape"
                    });
                }
                // tag for new node
                if (cfg.platform !== "unknown") {
                    if (cfg.isIdentity) {
                        group.addShape("circle", {
                            attrs: {
                                x: r - 14,
                                y: -r + 14,
                                r: 14,
                                fill: maps_1.colorsMap[cfg.platform],
                                zIndex: 9
                            },
                            name: "image-shape"
                        });
                        group.addShape("image", {
                            attrs: {
                                x: r - 24,
                                y: -r + 4,
                                width: 20,
                                height: 20,
                                img: resolvePlatformIcon(cfg.platform),
                                zIndex: 9,
                                cursor: "pointer"
                            },
                            draggable: true,
                            name: "image-shape",
                            className: "image-shape"
                        });
                    }
                    else {
                        group.addShape("circle", {
                            attrs: {
                                x: 0,
                                y: 0,
                                r: 12,
                                fill: maps_1.colorsMap[cfg.platform],
                                zIndex: 9
                            },
                            name: "image-shape"
                        });
                        group.addShape("image", {
                            attrs: {
                                x: -8,
                                y: -8,
                                width: 16,
                                height: 16,
                                img: resolvePlatformIcon(cfg.platform),
                                zIndex: 9,
                                cursor: "pointer"
                            },
                            draggable: true,
                            name: "image-shape"
                        });
                    }
                }
                return keyShape;
            },
            update: undefined
        }, "node"); // 这样可以继承 aggregated-node 的 setState
        // todo: config the line style
    }
};
