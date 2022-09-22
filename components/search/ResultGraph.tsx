import React, { memo, useEffect } from "react";
import _ from "lodash";
import { formatAddress } from "../../utils/utils";
import { colorSets, global, register } from "./GraphUtils/LargeRegister";
const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
const insertCss = isBrowser ? require("insert-css") : null;
let graph = null;

if (isBrowser) {
  insertCss(`
  .g6-component-tooltip {
    position: absolute;
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

const colorsMap = {
  twitter: "#019eeb",
  nextid: "#1C68F3",
  keybase: "#07ee80",
  ethereum: "#006afc",
  reddit: "#ff5fc9",
  ens: "#008685",
  github: "#e5e5e5",
  unknown: "#000000",
};

const platformMap = {
  twitter: "Twitter",
  nextid: "Next.ID",
  keybase: "Keybase",
  ethereum: "Ethereum",
  reddit: "Reddit",
  ens: "ENS",
  lens: "Lens",
  github: "GitHub",
  unknown: "Unknown",
};

const sourceMap = {
  nextid: "Next.ID",
  keybase: "Keybase",
  rss3: "RSS3",
  reddit: "Reddit",
  ens: "ENS",
  lens: "Lens",
  cyberconnect: "CyberConnect",
  sybil: "Sybil",
  unknown: "Unknown",
};

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
      label: formatAddress(to.displayName ?? to.identity),
      platform: to.platform,
      source: x.source,
      displayName: to.displayName,
      identity: to.identity,
      isIdentity: true,
    });
    nodes.push({
      id: from.uuid,
      label: formatAddress(from.displayName ?? from.identity),
      platform: from.platform,
      source: x.source,
      displayName: from.displayName,
      identity: from.identity,
      isIdentity: true,
    });
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: sourceMap[x.source],
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
        fill: "rgba(0, 0, 0, .05)",
        stroke: "rgba(0, 0, 0, .05)",
      };
    } else {
      // ENS
      node.size = 26;
      node.labelCfg = {
        position: "bottom",
      };
      node.style = {
        lineWidth: 2,
        fill: "rgba(0, 0, 0, .05)",
        stroke: "rgba(0, 0, 0, .05)",
      };
    }
    node.type = "identity-node";
    node.label = formatAddress(node.label);
  });
  edges.forEach((edge) => {
    if (edge.isIdentity) {
      // Identity
      edge.type = "quadratic";
      edge.curveOffset = 0;
    } else {
      // ENS
      edge.type = "line";
    }
  });
  // G6.Util.processParallelEdges(edges);
};

// eslint-disable-next-line react/display-name
const RenderResultGraph = (props) => {
  const { data, onClose } = props;
  const container = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graph || !data) return;
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    const res = resolveGraphData(data);

    const tooltip = new G6.Tooltip({
      offsetX: -120,
      offsetY: -150,
      getContent(e) {
        const outDiv = document.createElement("div");
        if (e.item.getModel().isIdentity) {
          outDiv.innerHTML = `
          <ul>
            <li>DisplayName: ${e.item.getModel().displayName || "Unknown"}</li>
            <li>Identity: ${e.item.getModel().identity || "Unknown"}</li>
            <li>Platform: ${platformMap[e.item.getModel().platform || "unknown"]}</li>
            <li>Source: ${sourceMap[e.item.getModel().source || "unknown"]}</li>
          </ul>`;
        } else {
          outDiv.innerHTML = `
          <ul>
            <li>ENS: ${e.item.getModel().label || "Unknown"}</li>
            <li>Holder: ${e.item.getModel().holder || "Unknown"}</li>
          </ul>`;
        }

        return outDiv;
      },
      itemTypes: ["node"],
    });

    processNodesEdges(res.nodes, res.edges);

    graph = new G6.Graph({
      container: container.current,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
          style: {
            stroke: '#fff',
            fill: "#999",
            fontSize: "10px",
          },
        },
        style: {
          endArrow: {
            path: "M 0,0 L 5,2.5 L 5,-2.5 Z",
            fill: "#2B384E",
            stroke: global.edge.labelCfg.style.stroke,
            opacity: 0.5,
          },
        },
      },
      fitCenter: true,
      layout: {
        type: "gForce",
        preventOverlap: true,
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
      },
      modes: {
        default: [
          "drag-canvas",
          "drag-node",
        ],
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
            container.current.scrollWidth,
            container.current.scrollHeight - 30
          );
        };
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
      {data && (
        <div
          className="graph-container"
          ref={container}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
    </div>
  );
};

export const ResultGraph = memo(RenderResultGraph);
