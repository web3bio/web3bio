"use strict";
exports.__esModule = true;
exports.IconButton = void 0;
var react_inlinesvg_1 = require("react-inlinesvg");
exports.IconButton = function (props) {
    var width = props.width, height = props.height, src = props.src;
    return (React.createElement("button", { className: "form-button btn ", style: { position: "relative" } },
        React.createElement(react_inlinesvg_1["default"], { src: src, width: width !== null && width !== void 0 ? width : 24, height: height !== null && height !== void 0 ? height : 24, className: "icon" })));
};
