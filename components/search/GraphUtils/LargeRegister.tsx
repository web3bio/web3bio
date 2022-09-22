import isArray from "@antv/util/lib/is-array";
import isNumber from "@antv/util/lib/is-number";

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;

const duration = 2000;
const animateOpacity = 0.6;
const animateBackOpacity = 0.1;
const virtualEdgeOpacity = 0.1;
const realEdgeOpacity = 0.2;

const darkBackColor = "rgb(43, 47, 51)";
const disableColor = "#777";
const theme = "dark";
const subjectColors = [
  "#3D76DD",
  "#19A576",
  "#65789B",
  "#B98700",
  "#5349E0",
  "#5AB8DB",
  "#7B48A1",
  "#D77622",
  "#008685",
  "#D37099",
];

const resolvePlatformIcon = (platform) => {
  return (
    {
      twitter: "/icons/icon-twitter.svg",
      nextid: "",
      keybase: "/icons/icon-keybase.svg",
      ethereum: "/icons/icon-ethereum.svg",
      reddit: "/icons/icon-reddit.svg",
      lens: "/icons/icon-lens.svg",
      ens: "/icons/icon-ens.svg",
      github: "/icons/icon-github.svg",
    }[platform] || ""
  );
};

export const colorSets = G6
  ? G6.Util.getColorSetsBySubjectColors(
      subjectColors,
      darkBackColor,
      theme,
      disableColor
    )
  : [];

export const global = {
  node: {
    style: {
      fill: "#2B384E",
    },
    labelCfg: {
      style: {
        fill: "#acaeaf",
        stroke: "#191b1c",
      },
    },
    stateStyles: {
      focus: {
        fill: "#2B384E",
      },
    },
  },
  edge: {
    style: {
      stroke: "#acaeaf",
      realEdgeStroke: "#acaeaf", //'#f00',
      realEdgeOpacity,
      strokeOpacity: realEdgeOpacity,
    },
    labelCfg: {
      style: {
        fill: "#acaeaf",
        realEdgeStroke: "#acaeaf", //'#f00',
        realEdgeOpacity: 0.5,
        stroke: "#191b1c",
      },
    },
    stateStyles: {
      focus: {
        stroke: "#fff", // '#3C9AE8',
      },
    },
  },
};

export const register = () => {
  if (G6) {
    // Custom identity node
    G6.registerNode(
      "identity-node",
      {
        draw(cfg: any, group) {
          let r = 20;
          if (isNumber(cfg.size)) {
            r = (cfg.size as number) / 2;
          } else if (isArray(cfg.size)) {
            r = cfg.size[0] / 2;
          }
          const style = cfg.style || {};
          const colorSet = cfg.colorSet || colorSets[0];

          const keyShape = group.addShape("circle", {
            attrs: {
              ...style,
              x: 0,
              y: 0,
              r,
              fill: "#fff",
              stroke: "#333",
              lineWidth: 2,
              cursor: "pointer",
            },
            name: "aggregated-node-keyShape",
          });

          let labelStyle = {};
          if (cfg.labelCfg) {
            labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
          }

          if (cfg.label) {
            const text = cfg.label;
            let labelStyle: any = {};
            let refY = 0;
            if (cfg.labelCfg) {
              labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
              refY += cfg.labelCfg.refY || 0;
            }
            let offsetY = 0;
            const fontSize = labelStyle.fontSize < 8 ? 8 : labelStyle.fontSize;
            const lineNum = (cfg.labelLineNum as number) || 1;
            offsetY = lineNum * (fontSize || 12);
            group.addShape("text", {
              attrs: {
                text,
                x: 0,
                y: 6,
                textAlign: "center",
                textBaseLine: "alphabetic",
                cursor: "pointer",
                fontSize,
                fill: "#333",
                opacity: 0.85,
              },
              name: "text-shape",
              className: "text-shape",
            });
          }
          // tag for new node
          if (cfg.platform !== "unknown") {
            if (cfg.isIdentity) {
              group.addShape("circle", {
                attrs: {
                  x: r - 12,
                  y: - r + 12,
                  r: 18,
                  fill: "#dedede",
                  zIndex: 9,
                },
                name: "image-shape",
                className: "image-shape",
                zIndex: 9,
              });
              group.addShape("image", {
                attrs: {
                  x: r - 24,
                  y: - r,
                  width: 24,
                  height: 24,
                  img: resolvePlatformIcon(cfg.platform),
                },
                name: "image-shape",
                className: "image-shape",
                zIndex: 99,
              });
            } else {
              group.addShape("image", {
                attrs: {
                  x: - 8,
                  y: - 8,
                  width: 16,
                  height: 16,
                  img: resolvePlatformIcon(cfg.platform),
                },
                name: "image-shape",
                className: "image-shape",
                zIndex: 99,
              });
            }
          }
          return keyShape;
        },
        update: undefined,
      },
      "aggregated-node"
    ); // 这样可以继承 aggregated-node 的 setState

    // todo: config the line style

    // // Custom the quadratic edge for multiple edges between one node pair
    G6.registerEdge(
      "custom-quadratic",
      {
        setState: (name, value, item) => {
          const group = item.get("group");
          const model = item.getModel();
          if (name === "focus") {
            const back = group.find((ele) => ele.get("name") === "back-line");
            if (back) {
              back.stopAnimate();
              back.remove();
              back.destroy();
            }
            const keyShape = group.find(
              (ele) => ele.get("name") === "edge-shape"
            );
            const arrow: any = model.style.endArrow;
            if (value) {
              if (keyShape.cfg.animation) {
                keyShape.stopAnimate(true);
              }
              keyShape.attr({
                strokeOpacity: animateOpacity,
                opacity: animateOpacity,
                stroke: "#fff",
                endArrow: {
                  ...arrow,
                  stroke: "#fff",
                  fill: "#fff",
                },
              });
              if (model.isReal) {
                const { lineWidth, path, endArrow, stroke } = keyShape.attr();
                const back = group.addShape("path", {
                  attrs: {
                    lineWidth,
                    path,
                    stroke,
                    endArrow,
                    opacity: animateBackOpacity,
                  },
                  name: "back-line",
                });
                back.toBack();
                const length = keyShape.getTotalLength();
                keyShape.animate(
                  (ratio) => {
                    // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                    const startLen = ratio * length;
                    // Calculate the lineDash
                    const cfg = {
                      lineDash: [startLen, length - startLen],
                    };
                    return cfg;
                  },
                  {
                    repeat: true, // Whether executes the animation repeatly
                    duration, // the duration for executing once
                  }
                );
              } else {
                let index = 0;
                const lineDash = keyShape.attr("lineDash");
                const totalLength = lineDash[0] + lineDash[1];
                keyShape.animate(
                  () => {
                    index++;
                    if (index > totalLength) {
                      index = 0;
                    }
                    const res = {
                      lineDash,
                      lineDashOffset: -index,
                    };
                    // returns the modified configurations here, lineDash and lineDashOffset here
                    return res;
                  },
                  {
                    repeat: true, // whether executes the animation repeatly
                    duration, // the duration for executing once
                  }
                );
              }
            } else {
              keyShape.stopAnimate();
              const stroke = "#acaeaf";
              const opacity = model.isReal
                ? realEdgeOpacity
                : virtualEdgeOpacity;
              keyShape.attr({
                stroke,
                strokeOpacity: opacity,
                opacity,
                endArrow: {
                  ...arrow,
                  stroke,
                  fill: stroke,
                },
              });
            }
          }
        },
      },
      "quadratic"
    );

    // // Custom the line edge for single edge between one node pair
    // G6.registerEdge(
    //   "custom-line",
    //   {
    //     setState: (name, value, item) => {
    //       const group = item.get("group");
    //       const model = item.getModel();
    //       if (name === "focus") {
    //         const keyShape = group.find(
    //           (ele) => ele.get("name") === "edge-shape"
    //         );
    //         const back = group.find((ele) => ele.get("name") === "back-line");
    //         if (back) {
    //           back.stopAnimate();
    //           back.remove();
    //           back.destroy();
    //         }
    //         const arrow: any = model.style.endArrow;
    //         if (value) {
    //           if (keyShape.cfg.animation) {
    //             keyShape.stopAnimate(true);
    //           }
    //           keyShape.attr({
    //             strokeOpacity: animateOpacity,
    //             opacity: animateOpacity,
    //             stroke: "#fff",
    //             endArrow: {
    //               ...arrow,
    //               stroke: "#fff",
    //               fill: "#fff",
    //             },
    //           });
    //           if (model.isReal) {
    //             const { path, stroke, lineWidth } = keyShape.attr();
    //             const back = group.addShape("path", {
    //               attrs: {
    //                 path,
    //                 stroke,
    //                 lineWidth,
    //                 opacity: animateBackOpacity,
    //               },
    //               name: "back-line",
    //             });
    //             back.toBack();
    //             const length = keyShape.getTotalLength();
    //             keyShape.animate(
    //               (ratio) => {
    //                 // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
    //                 const startLen = ratio * length;
    //                 // Calculate the lineDash
    //                 const cfg = {
    //                   lineDash: [startLen, length - startLen],
    //                 };
    //                 return cfg;
    //               },
    //               {
    //                 repeat: true, // Whether executes the animation repeatly
    //                 duration, // the duration for executing once
    //               }
    //             );
    //           } else {
    //             const lineDash = keyShape.attr("lineDash");
    //             const totalLength = lineDash[0] + lineDash[1];
    //             let index = 0;
    //             keyShape.animate(
    //               () => {
    //                 index++;
    //                 if (index > totalLength) {
    //                   index = 0;
    //                 }
    //                 const res = {
    //                   lineDash,
    //                   lineDashOffset: -index,
    //                 };
    //                 // returns the modified configurations here, lineDash and lineDashOffset here
    //                 return res;
    //               },
    //               {
    //                 repeat: true, // whether executes the animation repeatly
    //                 duration, // the duration for executing once
    //               }
    //             );
    //           }
    //         } else {
    //           keyShape.stopAnimate();
    //           const stroke = "#acaeaf";
    //           const opacity = model.isReal
    //             ? realEdgeOpacity
    //             : virtualEdgeOpacity;
    //           keyShape.attr({
    //             stroke,
    //             strokeOpacity: opacity,
    //             opacity: opacity,
    //             endArrow: {
    //               ...arrow,
    //               stroke,
    //               fill: stroke,
    //             },
    //           });
    //         }
    //       }
    //     },
    //   },
    //   "single-edge"
    // );
  }
};
