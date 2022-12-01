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
var _a;
exports.__esModule = true;
exports.ProfileTab = void 0;
var react_1 = require("react");
var react_inlinesvg_1 = require("react-inlinesvg");
var react_use_1 = require("react-use");
var ens_1 = require("../../utils/ens");
var utils_1 = require("../../utils/utils");
var Loading_1 = require("../shared/Loading");
var NFTOverview_1 = require("./NFTOverview");
var Poaps_1 = require("./Poaps");
var socialButtonMapping = (_a = {},
    _a["com.github"] = {
        icon: "icons/icon-github.svg",
        type: "github"
    },
    _a["com.twitter"] = {
        icon: "icons/icon-twitter.svg",
        type: "twitter"
    },
    _a["com.discord"] = {
        icon: "icons/social-discord.svg",
        type: "discord"
    },
    _a["com.reddit"] = {
        icon: "icons/social-reddit.svg",
        type: "reddit"
    },
    _a["com.telegram"] = {
        icon: "icons/social-telegram",
        type: "telegram"
    },
    _a);
var RenderProfileTab = function (props) {
    var identity = props.identity;
    var _a = react_use_1.useAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
        var ensInstance, obj, i, value, _a, _b, i, value, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    ensInstance = ens_1.ens.name(identity.displayName);
                    obj = {
                        base: {},
                        socialMedia: {}
                    };
                    i = 0;
                    _e.label = 1;
                case 1:
                    if (!(i < ens_1.globalRecordKeys.base.length)) return [3 /*break*/, 4];
                    value = ens_1.globalRecordKeys.base[i];
                    _a = obj.base;
                    _b = ens_1.globalRecordKeys.base[i];
                    return [4 /*yield*/, ensInstance.getText(value)];
                case 2:
                    _a[_b] = _e.sent();
                    _e.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    i = 0;
                    _e.label = 5;
                case 5:
                    if (!(i < ens_1.globalRecordKeys.socialMedia.length)) return [3 /*break*/, 8];
                    value = ens_1.globalRecordKeys.socialMedia[i];
                    _c = obj.socialMedia;
                    _d = ens_1.globalRecordKeys.socialMedia[i];
                    return [4 /*yield*/, ensInstance.getText(value)];
                case 6:
                    _c[_d] =
                        _e.sent();
                    _e.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, obj];
            }
        });
    }); }), ensRecords = _a.value, ensLoading = _a.loading;
    var openSocialMediaLink = function (url, type) {
        var resolvedURL = "";
        if (url.startsWith("https")) {
            resolvedURL = url;
        }
        else {
            resolvedURL = utils_1.resolveSocialMediaLink(url, type);
        }
        window.open(resolvedURL, "_blank");
    };
    return (React.createElement("div", { className: "profile-container" },
        ensLoading || !ensRecords ? (React.createElement("div", { className: "profile-basic-info-loading" },
            React.createElement(Loading_1.Loading, null))) : (React.createElement("div", { className: "profile-basic-info" },
            React.createElement("div", { className: "profile-description" }, ensRecords.base.description || "no description"),
            React.createElement("div", { className: "records" }, Object.keys(socialButtonMapping).map(function (x, idx) {
                return (ensRecords.socialMedia[x] && (React.createElement("button", { key: idx, className: "form-button btn", style: { position: "relative" }, onClick: function () {
                        openSocialMediaLink(ensRecords.socialMedia[x], socialButtonMapping[x].type);
                    } },
                    React.createElement(react_inlinesvg_1["default"], { src: socialButtonMapping[x].icon, width: 24, height: 24, className: "icon" }))));
            })))),
        React.createElement(NFTOverview_1.NFTOverview, { identity: identity }),
        React.createElement(Poaps_1.Poaps, { identity: identity })));
};
exports.ProfileTab = react_1.memo(RenderProfileTab);
