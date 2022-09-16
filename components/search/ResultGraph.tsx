import React, { useEffect } from "react";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import _ from "lodash";
import { Empty } from "../shared/Empty";
import { useLazyQuery } from "@apollo/client";
import {
  GET_IDENTITY_GRAPH_DATA,
  GET_IDENTITY_GRAPH_ENS,
} from "../../utils/queries";
import { colorSets, global } from "./graphCom/LargeGraphRegister";

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
const insertCss = isBrowser ? require("insert-css") : null;
let graph = null;

if (isBrowser) {
  insertCss(`
  .g6-component-tooltip{
    position: absolute;
			z-index: 2;
			list-style-type: none;
			border-radius: 6px;
			font-size: 0.3rem;
			width: fit-content;
			transition: opacity .2s;
			text-align: left;
			padding: 4px 8px;
			box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
			border: 0px;
  }
		.g6-component-tooltip ul {
			padding-left: 0px;
			margin: 0;
		}
		.g6-component-tooltip li {
			cursor: pointer;
			list-style-type: none;
			list-style: none;
			margin-left: 0;
	}
	`);
}

const colorsMap = {
  twitter: "#019eeb",
  nextid: "#ad00ff",
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
      label: "NextID",
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
      label: "Github",
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

// 截断长文本。length 为文本截断后长度，elipsis 是后缀
const formatText = (text, length = 10, elipsis = "..") => {
  if (!text) return "";
  if (text.length > length) {
    return `${text.substr(0, length)}${elipsis}`;
  }
  return text;
};

const labelFormatter = (text: string, minLength: number = 10): string => {
  if (text && text.split("").length > minLength)
    return `${text.substr(0, minLength)}...`;
  return text;
};

const resolveGraphData = (source) => {
  const nodes = [];
  const edges = [];
  source.forEach((x, idx) => {
    const from = x.from;
    const to = x.to;
    console.log(x, "node");
    nodes.push({
      id: to.uuid,
      label: to.displayName ?? to.identity,
      platform: to.platform,
      source: x.source,
      ens: to.displayName,
      identity: to.identity,
      level: 1,
    });
    nodes.push({
      id: from.uuid,
      label: from.displayName ?? from.identity,
      platform: from.platform,
      source: x.source,
      ens: from.displayName,
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
          chain: k.chian,
          holder: from.identity,
          platform: "ens",
        });
        edges.push({
          source: from.uuid,
          target: k.uuid,
          label: "hold",
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
          chain: k.chian,
          holder: to.identity,
          platform: "ens",
        });
        edges.push({
          source: to.uuid,
          target: k.uuid,
          label: "hold",
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
      node.size = 35;
    }
    node.style = {
      lineWidth: 3,
      fill: "#fff",
      stroke: colorsMap[node.platform],
    };
    node.label = formatText(node.label);
  });
};

export const ResultGraph = (props) => {
  const { value, platform, type, onClose } = props;
  const container = React.useRef<HTMLDivElement>(null);
  const [fetchGraph, { loading, called, error, data }] = useLazyQuery(
    type === "ens" ? GET_IDENTITY_GRAPH_ENS : GET_IDENTITY_GRAPH_DATA,
    {
      variables:
        type === "ens"
          ? {
              id: value,
            }
          : {
              platform,
              identity: value,
            },
    }
  );

  useEffect(() => {
    fetchGraph();
    if (graph || !data) return;
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    const res = resolveGraphData(
      type === "ens"
        ? data.nft.owner.neighborWithTraversal
        : data.identity.neighborWithTraversal
    );

    const tooltip = new G6.Tooltip({
      offsetX: -120,
      offsetY: -150,
      getContent(e) {
        const outDiv = document.createElement("div");
        if (e.item.getModel().level) {
          outDiv.innerHTML = `
          <ul>
            <li>DisplayName: ${e.item.getModel().ens || "Unknown"}</li>
            <li>Identity: ${e.item.getModel().identity || "Unknown"}</li>
            <li>Source: ${e.item.getModel().source || "Unknown"}</li>
          </ul>`;
        } else {
          outDiv.innerHTML = `
          <ul>
            <li>ENS: ${e.item.getModel().id || "Unknown"}</li>
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
      offsetY: -120,
      offsetX: -100,
      padding: [4, 16, 8, 16],
      containerStyle: {
        fill: "#fff",
      },
      title: " ",
      titleConfig: {
        offsetY: -8,
      },
    });

    graph = new G6.Graph({
      container: container.current,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      defaultNode: {
        size: 20,
        labelCfg: {
          position: "bottom",
        },
      },
      defaultEdge: {
        style: {
          endArrow: {
            path: "M 0,0 L 8,4 L 8,-4 Z",
            fill: "#e2e2e2",
          },
        },
      },
      linkCenter: true,
      minZoom: 0.1,
      layout: {
        type: "radial",
        unitRadius: 70,
        preventOverlap: true,
        strictRadial: false,
      },
      modes: {
        default: [
          {
            type: "drag-canvas",
            enableOptimize: true,
          },
          {
            type: "zoom-canvas",
            enableOptimize: true,
            optimizeZoom: 0.01,
          },
          "drag-node",
        ],
      },
      plugins: [tooltip, legend],
    });

    graph.get("canvas").set("localRefresh", false);

    processNodesEdges(res.nodes, res.edges);
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
  }, [data, called, type, fetchGraph]);

  return (
    <div className="graph-mask" onClick={onClose}>
      {(!data && (
        <div className="graph-container graph-container-placeholder">
          {loading ? <Loading /> : error ? <Error text={error} /> : <Empty />}
        </div>
      )) || (
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
