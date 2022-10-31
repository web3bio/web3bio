"use strict";
exports.__esModule = true;
exports.NFTsTab = void 0;
var react_1 = require("react");
var NFTCollections_1 = require("./NFTCollections");
var NFTDialog_1 = require("./NFTDialog");
var RenderNFTsTab = function (props) {
    var address = props.address;
    var _a = react_1.useState(false), dialogOpen = _a[0], setDialogOpen = _a[1];
    var _b = react_1.useState(""), asset = _b[0], setAsset = _b[1];
    return (React.createElement("div", null,
        React.createElement(NFTCollections_1.NFTCollections, { onShowDetail: function (a) {
                setAsset(a);
                setDialogOpen(true);
            }, isDetail: true }),
        dialogOpen && (React.createElement(NFTDialog_1.NFTDialog, { asset: asset, open: dialogOpen, onClose: function () { return setDialogOpen(false); } }))));
};
exports.NFTsTab = react_1.memo(RenderNFTsTab);
