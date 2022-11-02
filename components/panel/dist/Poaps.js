"use strict";
exports.__esModule = true;
exports.Poaps = void 0;
var image_1 = require("next/image");
var react_1 = require("react");
var RenderPoaps = function (props) {
    var _a = props.poapList, poapList = _a === void 0 ? [1, 2, 3] : _a;
    return (React.createElement("div", { className: "nft-collection-container" },
        React.createElement("div", { className: "nft-collection-title" }, "POAPS"),
        React.createElement("div", { className: "nft-list" }, poapList.map(function (x, idx) {
            return (React.createElement("div", { key: idx, className: "collection-nft-item" },
                React.createElement(image_1["default"], { src: "https://i.seadn.io/gcs/files/ad509bd6fb10b3f256481d1c0b297cf9.jpg?auto=format&w=384", alt: "" })));
        }))));
};
exports.Poaps = react_1.memo(RenderPoaps);
