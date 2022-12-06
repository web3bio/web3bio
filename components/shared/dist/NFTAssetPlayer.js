"use strict";
exports.__esModule = true;
exports.NFTAssetPlayer = void 0;
var react_1 = require("react");
var ImageLoader_1 = require("./ImageLoader");
var IsImage = function (type) {
    return [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg",
        "image/gif",
        "image/webp",
        "text/html",
        "model/gltf-binary",
        "model/gltf+json",
    ].includes(type);
};
var isVideo = function (type) {
    return ["video/mp4", "audio/mpeg", "audio/wav"].includes(type);
};
var RenderNFTAssetPlayer = function (props) {
    var _a = props.type, type = _a === void 0 ? "image/png" : _a, className = props.className, src = props.src, contentUrl = props.contentUrl, width = props.width, height = props.height, alt = props.alt, onClick = props.onClick, style = props.style;
    return (React.createElement(React.Fragment, null, src ? (React.createElement("div", { onClick: onClick, className: className, style: style }, IsImage(type) ? (React.createElement(ImageLoader_1.ImageLoader, { width: width, height: height, src: src, alt: alt, loading: "lazy" })) : (isVideo(type) && (React.createElement("video", { style: { borderRadius: 8 }, className: "video-responsive", width: "100%", height: "100%", muted: true, autoPlay: true, loop: true, poster: src },
        React.createElement("source", { src: contentUrl, type: type })))))) : (React.createElement("div", { onClick: onClick, className: className, style: style },
        React.createElement("div", { className: "img-placeholder img-responsive bg-pride", "data-initial": alt === null || alt === void 0 ? void 0 : alt.substring(0, 2) })))));
};
exports.NFTAssetPlayer = react_1.memo(RenderNFTAssetPlayer);
