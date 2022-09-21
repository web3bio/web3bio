import React, { memo, useEffect } from "react";
import _ from "lodash";
import { formatAddress } from "../../utils/utils";

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

let CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 800;

const legendData = {
  nodes: [
    {
      id: "nextid",
      label: "Next.ID",
      order: 0,
      style: {
        fill: colorsMap["nextid"],
      },
    },
    {
      id: "twitter",
      label: "Twitter",
      order: 1,
      style: {
        fill: colorsMap["twitter"],
      },
    },
    {
      id: "ethereum",
      label: "Ethereum",
      order: 2,
      style: {
        fill: colorsMap["ethereum"],
      },
    },
    {
      id: "keybase",
      label: "Keybase",
      order: 3,
      style: {
        fill: colorsMap["keybase"],
      },
    },
    {
      id: "reddit",
      label: "Reddit",
      order: 4,
      style: {
        fill: colorsMap["reddit"],
      },
    },
    {
      id: "github",
      label: "GitHub",
      order: 5,
      style: {
        fill: colorsMap["github"],
      },
    },
    {
      id: "ens",
      label: "ENS",
      order: 6,
      style: {
        fill: colorsMap["ens"],
      },
    },
    {
      id: "unknown",
      label: "Unknown",
      order: 7,
      style: {
        fill: colorsMap["unknown"],
      },
    },
  ],
};



const resolveGraphData = (source) => {
  const nodes = [];
  const edges = [];
  source.forEach((x, idx) => {
    const from = x.from;
    const to = x.to;
    nodes.push({
      id: to.uuid,
      label: to.displayName ?? to.identity,
      platform: to.platform,
      source: x.source,
      displayName: to.displayName,
      identity: to.identity,
      level: 1,
    });
    nodes.push({
      id: from.uuid,
      label: from.displayName ?? from.identity,
      platform: from.platform,
      source: x.source,
      displayName: from.displayName,
      identity: from.identity,
      level: 1,
    });
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: x.source,
      id: `${from.uuid}-${to.uuid}`,
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
    if (node.level === 1) {
      // identity
      node.size = 96;
      node.style = {
        lineWidth: 2,
        fill: "#fff",
        stroke: "#333",
      };
    } else {
      // ENS
      node.size = 16;
      node.labelCfg = {
        position: "bottom",
      };
      node.style = {
        lineWidth: 2,
        fill: "#fff",
        stroke: "#333",
      };
    }
    node.label = formatAddress(node.label);
  });
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
        if (e.item.getModel().level) {
          outDiv.innerHTML = `
          <ul>
            <li>DisplayName: ${e.item.getModel().displayName || "Unknown"}</li>
            <li>Identity: ${e.item.getModel().identity || "Unknown"}</li>
            <li>Platform: ${e.item.getModel().platform || "Unknown"}</li>
            <li>Source: ${e.item.getModel().source || "Unknown"}</li>
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
    const legend = new G6.Legend({
      data: legendData,
      align: "center",
      layout: "horizontal", // vertical
      position: "bottom-left",
      offsetY: -80,
      offsetX: -140,
      padding: [4, 16, 8, 16],
      containerStyle: {
        fill: "#fff",
      },
      title: " ",
      titleConfig: {
        offsetY: -10,
      },
    });
    processNodesEdges(res.nodes, res.edges);

    graph = new G6.Graph({
      container: container.current,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      defaultEdge: {
        style:{
          endArrow: {
            path: 'M 0,0 L 5,2.5 L 5,-2.5 Z',
            fill: '#666',
            stroke: '#666',
            opacity: .5,
          },
        }
      },
      fitCenter: true,
      layout: {
        type: 'gForce',
        preventOverlap: true,
        linkDistance: 150,
        linkCenter: true,
        edgeStrength: 150,
      },
      modes: {
        default: [
          {
            type: "drag-canvas",
            enableOptimize: true,
          },
          "drag-node",
        ],
      },
      plugins: [tooltip, legend],
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
      });
      graph.on("canvas:click", (evt) => {
        graph.getNodes().forEach((node) => {
          graph.clearItemStates(node);
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
