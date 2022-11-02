"use strict";
exports.__esModule = true;
exports.Dropdown = void 0;
var react_1 = require("react");
exports.Dropdown = function (props) {
    var items = props.items, active = props.active;
    console.log(active, 'active');
    var _a = react_1.useState(false), displayMenu = _a[0], setDisplayMenu = _a[1];
    var _b = react_1.useState(active.key), title = _b[0], setTitle = _b[1];
    var showDropdownMenu = function () { return setDisplayMenu(!displayMenu); };
    var hideDropdownMenu = function (v) {
        setDisplayMenu(false);
        setTitle(v);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { style: { position: "fixed", inset: "0px" }, onClick: function () { return setDisplayMenu(false); } }),
        react_1["default"].createElement("div", { className: "dropdown" },
            react_1["default"].createElement("div", { className: "button", onClick: function () { return showDropdownMenu(); } },
                active.name,
                react_1["default"].createElement("div", { className: "triangle_button" },
                    react_1["default"].createElement("i", { className: "triangle" }))),
            displayMenu && (react_1["default"].createElement("div", { className: "menu" }, items.map(function (item) { return (react_1["default"].createElement("div", { className: item.key === title && "active", onClick: function () { return hideDropdownMenu(item.key); }, key: item.key }, item.name)); }))))));
};
