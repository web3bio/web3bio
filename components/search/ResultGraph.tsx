import React, { memo, useEffect, useState } from "react";
import _ from "lodash";
import { formatText } from "../../utils/utils";
import { colorsMap, platformsMap } from "../../utils/maps";
import { register } from "./GraphUtils/LargeRegister";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
let graph = null;
let shiftKeydown = false;
const insertCss = isBrowser ? require("insert-css") : null;

if (isBrowser) {
  insertCss(`
  .g6-component-tooltip {
      position: relative;
			z-index: 2;
			list-style-type: none;
			border-radius: 6px;
			font-size: .6rem;
			width: fit-content;
			transition: opacity .2s;
			text-align: left;
			padding: 4px 8px;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15);
			border: 0;
  }
  .g6-component-tooltip ul {
    padding-left: 0;
    margin: 0;
  }
  .g6-component-tooltip li {
    cursor: pointer;
    list-style-type: none;
    list-style: none;
    margin: 0;
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
    nodes.push({
      id: to.uuid,
      label: formatText(to.displayName ?? to.identity),
      platform: to.platform,
      source: x.source,
      displayName: to.displayName,
      identity: to.identity,
      isIdentity: true,
    });
    nodes.push({
      id: from.uuid,
      label: formatText(from.displayName ?? from.identity),
      platform: from.platform,
      source: x.source,
      displayName: from.displayName,
      identity: from.identity,
      isIdentity: true,
    });
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: platformsMap[x.source],
      id: `${from.uuid}-${to.uuid}`,
      isIdentity: true,
    });
    from.nft.forEach((k) => {
      if (k.category === "ENS") {
        nodes.push({
          id: k.uuid,
          label: k.id,
          category: k.category,
          chain: k.chain,
          holder: from.identity,
          platform: "ens",
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
      if (k.category === "ENS") {
        nodes.push({
          id: k.uuid,
          label: k.id,
          category: k.category,
          chain: k.chain,
          holder: to.identity,
          platform: "ens",
        });
        edges.push({
          source: to.uuid,
          target: k.uuid,
          // label: "hold",
          id: `${to.uuid}-${k.uuid}`,
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
          stroke: colorsMap[node.platform],
          fill: colorsMap[node.platform],
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
        fill: colorsMap[node.platform],
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
    node.label = formatText(node.label);
    if (node.platform && node.platform.toLowerCase() === "ethereum") {
      node.label = `${node.displayName || formatText(node.identity)} ${
        node.displayName ? `\n${formatText(node.identity)}` : ""
      }`;
      node.labelLineNum = node.displayName ? 2 : 1;
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
      getContent(e) {
        const outDiv = document.createElement("div");
        if (e.item.getModel().isIdentity) {
          outDiv.innerHTML = `
          <ul>
            <li>DisplayName: ${e.item.getModel().displayName || "-"}</li>
            <li>Identity: ${e.item.getModel().identity || "-"}</li>
            <li>Platform: ${
              platformsMap[e.item.getModel().platform || "unknown"]
            }</li>
            <li>Source: ${
              platformsMap[e.item.getModel().source || "unknown"]
            }</li>
          </ul>`;
        } else {
          outDiv.innerHTML = `
          <ul>
            <li>ENS: ${e.item.getModel().label || "Unknown"}</li>
            <li>Owner: ${e.item.getModel().holder || "Unknown"}</li>
          </ul>`;
        }

        return outDiv;
      },
      fixToNode: [0.5, 0.5],
      itemTypes: ["node"],
    });

    graph = new G6.Graph({
      container: container.current,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
          style: {
            stroke: "#fff",
            linWidth: 4,
            fill: "#999",
            fontSize: "10px",
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
      layout: {
        type: "gForce",
        preventOverlap: true,
        // gpuEnabled: true,
        linkDistance: (d) => {
          if (d.isIdentity) {
            return 240;
          }
          return 180;
        },
        nodeSpacing: (d) => {
          if (d.isIdentity) {
            return 240;
          }
          return 180;
        },
        nodeStrength: (d) => {
          if (d.isIdentity) {
            return 480;
          }
          return 180;
        },
        edgeStrength: (d) => {
          if (d.isIdentity) {
            return 30;
          }
          return 20;
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
          graph.layout()
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
  }, [data]);

  return (
    <div className="graph-mask" onClick={onClose}>
      <div className="graph-title">
        <SVG src="icons/icon-view.svg" width={"1.5rem"} />
        Identity Graph for <strong>{title}</strong>
      </div>
      {data && (
        <div
          className="graph-container"
          ref={container}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
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
