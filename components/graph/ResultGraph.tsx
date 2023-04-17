import _ from "lodash";
import React, { memo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { formatText } from "../../utils/utils";
import { Loading } from "../shared/Loading";
import { register } from "./GraphUtils/LargeRegister";
const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
let graph = null;
let shiftKeydown = false;
const insertCss = isBrowser ? require("insert-css") : null;

if (isBrowser) {
  insertCss(`
  .web5bio-tooltip {
    background: #fcfcfc;
    z-index: 999;
    list-style-type: none;
    border-radius: 8px;
    font-size: .6rem;
    max-width: 400px;
    text-align: left;
    user-select: none;
    padding: 8px 12px;
    pointer-events: none;
    border: 1px solid rgba(0, 0, 0, .25);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 4px 24px rgba(0, 0, 0, .05);
    border: 0;
  }
  .web5bio-tooltip ul {
    padding-left: 0;
    margin: 0;
  }
  .web5bio-tooltip li {
    list-style-type: none;
    list-style: none;
    overflow-wrap: break-word;
    word-break: break-all; 
    margin: 0;
	}
  .web5bio-tooltip li span {
    font-size: .5rem;
	}
	`);
}

if (G6) {
  register();
}

let CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 800;

const resolveGraphData = (source) => {
  const nodes = [];
  const edges = [];
  source.forEach((x, idx) => {
    const from = x.from;
    const to = x.to;
    const resolvedPlatform = SocialPlatformMapping(x.source);
    nodes.push({
      id: to.uuid,
      label: formatText(to.displayName ?? to.identity),
      platform: to.platform,
      source: x.source,
      displayName: to.profile?.displayName || to.displayName,
      identity: to.profile?.owner || to.identity,
      isIdentity: true,
    });
    nodes.push({
      id: from.uuid,
      label: formatText(from.displayName ?? from.identity),
      platform: from.platform,
      source: x.source,
      displayName: from.profile?.displayName || from.displayName,
      identity: from.profile?.owner || from.identity,
      isIdentity: true,
    });
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: resolvedPlatform ? resolvedPlatform.label : x.source,
      id: `${from.uuid}-${to.uuid}`,
      isIdentity: true,
    });
    from.nft.forEach((k) => {
      if (k.category === PlatformType.ens) {
        nodes.push({
          id: k.uuid,
          label: k.id,
          category: k.category,
          chain: k.chain,
          holder: from.identity,
          identity: k.id,
          platform: PlatformType.ens,
        });
        edges.push({
          source: from.uuid,
          target: k.uuid,
          // label: "hold",
          id: `${from.uuid}-${k.uuid}`,
        });
      }
    });
    to.nft.forEach((k) => {
      if (k.category === PlatformType.ens) {
        nodes.push({
          id: k.uuid,
          label: k.id,
          category: k.category,
          chain: k.chain,
          holder: to.identity,
          identity: k.id,
          platform: PlatformType.ens,
          isTransferred: true,
        });
        edges.push({
          source: to.uuid,
          target: k.uuid,
          // label: "hold",
          id: `${to.uuid}-${k.uuid}`,
          isTransferred: true,
        });
      }
    });
  });
  const _nodes = _.uniqBy(nodes, "id");
  const _edges = _.uniqBy(edges, "id");
  return { nodes: _nodes, edges: _edges };
};

const processNodesEdges = (nodes, edges) => {
  // todo: processs edges and nodes
  nodes.forEach((node) => {
    if (node.isIdentity) {
      // Identity
      node.size = 96;
      node.style = {
        lineWidth: 2,
      };
      node.stateStyles = {
        selected: {
          stroke:
            SocialPlatformMapping(node.platform)?.color || "rgba(0, 0, 0, .25)",
          fill: SocialPlatformMapping(node.platform)?.color,
          fillOpacity: 0.1,
          lineWidth: 2,
          shadowColor: "transparent",
          zIndex: 999,
        },
      };
    } else {
      // ENS
      node.size = 24;
      node.labelCfg = {
        labelLineNum: 1,
        position: "bottom",
      };
      node.style = {
        lineWidth: 2,
        fill: SocialPlatformMapping(node.platform)?.color,
        stroke: "rgba(0, 0, 0, .05)",
      };
      node.stateStyles = {
        selected: {
          lineWidth: 2,
          shadowColor: "transparent",
          zIndex: 999,
        },
      };
    }
    node.type = "identity-node";
    if (node.platform && node.isIdentity) {
      if (node.diplayName !== "") {
        node.label = `${formatText(node.displayName)}`;
        if (node.displayName !== node.identity) {
          node.label += `\n${formatText(
            node.profile?.identity || node.identity
          )}`;
          node.labelLineNum = 1.5;
        }
      } else {
        node.label = formatText(node.identity);
        node.labelLineNum = 1;
      }
    }
  });
  edges.forEach((edge) => {
    if (edge.isIdentity) {
      // Identity
      edge.type = "quadratic";
      edge.curveOffset = 0;
      edge.stateStyles = {
        selected: {
          stroke: "#cecece",
          shadowColor: "transparent",
          zIndex: 999,
        },
      };
    } else {
      // ENS
      edge.type = "line";
      edge.stateStyles = {
        selected: {
          stroke: "#cecece",
          shadowColor: "transparent",
          zIndex: 999,
        },
      };
    }
  });
  // G6.Util.processParallelEdges(edges);
};

// eslint-disable-next-line react/display-name
const RenderResultGraph = (props) => {
  const { data, onClose, title } = props;
  const container = React.useRef<HTMLDivElement>(null);
  const tooltipContainer = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (graph || !data) return;
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    const res = resolveGraphData(data);

    processNodesEdges(res.nodes, res.edges);

    const tooltip = new G6.Tooltip({
      className: "web5bio-tooltip",
      container: tooltipContainer.current,
      getContent(e) {
        const outDiv = document.createElement("div");
        if (e.item.getModel().isIdentity) {
          outDiv.innerHTML = `
          <ul>
            <li class="text-large text-bold">${
              e.item.getModel().displayName || "-"
            }</li>
            <li class="mb-1">${
              e.item.getModel().identity != e.item.getModel().displayName
                ? e.item.getModel().identity
                : ""
            }</li>
            <li><span class="text-gray">Platform: </span>${
              SocialPlatformMapping(e.item.getModel().platform)?.label ||
              e.item.getModel().platform ||
              "Unknown"
            }</li>
          </ul>`;
        } else {
          outDiv.innerHTML = `
          <ul>
            <li class="text-large text-bold mb-1">${
              e.item.getModel().identity || ""
            }</li>
            <li><span class="text-gray">Platform: </span>${
              e.item.getModel().platform || ""
            }</li>
            <li><span class="text-gray">Owner: </span>${
              e.item.getModel().holder || ""
            }</li>
          </ul>`;
        }

        return outDiv;
      },
      fixToNode: [1, 0],
      itemTypes: ["node"],
    });

    graph = new G6.Graph({
      container: container.current,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      fitCenter: true,
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
          style: {
            stroke: "#fff",
            linWidth: 4,
            fill: "#999",
            fontSize: 10,
          },
        },
        style: {
          endArrow: {
            path: "M 0,0 L 5,2.5 L 5,-2.5 Z",
            fill: "#cecece",
            stroke: "#cecece",
          },
        },
      },
      defaultNode: {
        stroke: "rgba(0, 0, 0, .25)",
        fillOpacity: 0.1,
        lineWidth: 2,
        shadowColor: "transparent",
        zIndex: 999,
      },
      layout: {
        type: "gForce",
        gravity: 20,
        preventOverlap: true,
        linkDistance: (d) => {
          if (d.isIdentity) {
            return 200;
          }
          return 100;
        },
        nodeSpacing: (d) => {
          if (d.isIdentity) {
            return 160;
          }
          return 10;
        },
        nodeStrength: (d) => {
          if (d.isIdentity) {
            return 1200;
          }
          return 800;
        },
        nodeSize: (d) => {
          if (d.isIdentity) {
            return 120;
          }
          return 40;
        },
        onLayoutEnd: () => {
          setLoading(false);
        },
      },
      modes: {
        default: ["drag-canvas", "drag-node"],
      },
      plugins: [tooltip],
    });

    graph.get("canvas").set("localRefresh", false);

    graph.data({
      nodes: res.nodes,
      edges: res.edges,
    });
    graph.render();
    const bindListener = () => {
      graph.on("keydown", (evt) => {
        const code = evt.key;
        if (!code) {
          return;
        }
        if (code.toLowerCase() === "shift") {
          shiftKeydown = true;
        } else {
          shiftKeydown = false;
        }
      });
      graph.on("keyup", (evt) => {
        const code = evt.key;
        if (!code) {
          return;
        }
        if (code.toLowerCase() === "shift") {
          shiftKeydown = false;
        }
      });
      graph.on("node:dragstart", function (e) {
        refreshDragedNodePosition(e);
      });
      graph.on("node:drag", function (e) {
        refreshDragedNodePosition(e);
      });
      graph.on("node:dragend", function (e) {
        e.item.get("model").fx = null;
        e.item.get("model").fy = null;
      });

      graph.on("node:click", (evt) => {
        if (!shiftKeydown) clearFocusItemState(graph);
        const { item } = evt;
        graph.setItemState(item, "selected", true);

        const relatedEdges = item.getEdges();
        relatedEdges.forEach((edge) => {
          graph.setItemState(edge, "selected", true);
        });
      });
      graph.on("canvas:click", (evt) => {
        graph.getNodes().forEach((node) => {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach((edge) => {
          graph.clearItemStates(edge);
        });
      });

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container.current) return;

          graph.changeSize(
            container.current.offsetWidth,
            container.current.offsetHeight
          );
          graph.layout();
        };
    };
    const clearFocusItemState = (graph) => {
      if (!graph) return;
      const focusNodes = graph.findAllByState("node", "selected");
      focusNodes.forEach((fnode) => {
        graph.setItemState(fnode, "selected", false);
      });
      const focusEdges = graph.findAllByState("edge", "selected");
      focusEdges.forEach((fedge) => {
        graph.setItemState(fedge, "selected", false);
      });
    };
    const refreshDragedNodePosition = (e) => {
      const model = e.item.get("model");
      model.fx = e.x;
      model.fy = e.y;
    };

    bindListener();
    return () => {
      graph.destroy();
      graph = null;
    };
  }, [data, onClose, title]);

  return (
    <div
      className="identity-graph-modal"
      ref={tooltipContainer}
      onClick={onClose}
    >
      {data && (
        <div
          className="graph-container"
          ref={container}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div className="graph-header">
            <div className="graph-title">
              <SVG src={"/icons/icon-view.svg"} width="20" height="20" />
              <span className="ml-2">
                Identity Graph for<strong className="ml-1">{title}</strong>
              </span>
            </div>
            <div className="btn btn-link btn-close" onClick={onClose}>
              <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
            </div>
          </div>
          {loading && (
            <div className="loading-mask">
              <Loading />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ResultGraph = memo(RenderResultGraph);
