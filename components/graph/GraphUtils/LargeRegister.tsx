import isArray from "@antv/util/lib/is-array";
import isNumber from "@antv/util/lib/is-number";
import { SocialPlatformMapping } from "../../../utils/platform";
import { PlatformType } from "../../../utils/type";

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;

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
          // const colorSet = cfg.colorSet || colorSets[0];

          const keyShape = group.addShape("circle", {
            attrs: {
              ...style,
              x: 0,
              y: 0,
              r,
              fill: "#fff",
              stroke:
                SocialPlatformMapping[cfg.platform].color ||
                "rgba(0, 0, 0, .15)",
              opacity: 1,
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
                y: cfg.platform === "ENS" ? 28 : 8 * lineNum,
                textAlign: "center",
                textBaseLine: "middle",
                cursor: "pointer",
                fontSize: 12,
                fill: "#121212",
                opacity: 1,
                zIndex: 999,
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
                  x: r - 14,
                  y: -r + 14,
                  r: 14,
                  fill: SocialPlatformMapping[cfg.platform].color,
                  zIndex: 9,
                },
                name: "image-shape",
              });
              group.addShape("image", {
                attrs: {
                  x: r - 24,
                  y: -r + 4,
                  width: 20,
                  height: 20,
                  img: SocialPlatformMapping[cfg.platform].iconW,
                  zIndex: 9,
                  cursor: "pointer",
                },
                draggable: true,
                name: "image-shape",
                className: "image-shape",
              });
            } else {
              group.addShape("circle", {
                attrs: {
                  x: 0,
                  y: 0,
                  r: 12,
                  fill: SocialPlatformMapping[cfg.platform].color,
                  zIndex: 9,
                },
                name: "image-shape",
              });
              group.addShape("image", {
                attrs: {
                  x: -8,
                  y: -8,
                  width: 16,
                  height: 16,
                  img: SocialPlatformMapping[cfg.platform].iconW,
                  zIndex: 9,
                  cursor: "pointer",
                },
                draggable: true,
                name: "image-shape",
              });
            }
          }
          return keyShape;
        },
        update: undefined,
      },
      "node"
    ); // 这样可以继承 aggregated-node 的 setState

    // todo: config the line style
  }
};
