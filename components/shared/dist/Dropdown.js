"use strict";
exports.__esModule = true;
exports.Dropdown = void 0;
var react_1 = require("react");
exports.Dropdown = function (props) {
    var items = props.items, active = props.active;
    console.log(active, "active");
    var _a = react_1.useState(false), displayMenu = _a[0], setDisplayMenu = _a[1];
    var _b = react_1.useState(active.key), title = _b[0], setTitle = _b[1];
    var hideDropdownMenu = function (v) {
        setDisplayMenu(false);
        setTitle(v);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", null),
        react_1["default"].createElement("div", { className: "dropdown-box" },
            react_1["default"].createElement("div", { className: "dropdown-button", onClick: function () { return setDisplayMenu(!displayMenu); } },
                active.name,
                react_1["default"].createElement("div", { className: "dropdown-triangle_button" },
                    react_1["default"].createElement("i", { className: "dropdown-triangle" }))),
            displayMenu && (react_1["default"].createElement("div", { className: "dropdown-menu" }, items.map(function (item) { return (react_1["default"].createElement("div", { className: item.key === title && "active", onClick: function () { return hideDropdownMenu(item.key); }, key: item.key }, item.name)); }))))));
};
