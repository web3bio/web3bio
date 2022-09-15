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

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
const labelMaxLength = 5;
const largeGraphMode = true;
let graph = null;
let layout = {
  type: "",
  instance: null,
  destroyed: true,
};

let CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 800;

// 截断长文本。length 为文本截断后长度，elipsis 是后缀
const formatText = (text, length = 5, elipsis = "...") => {
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
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: x.source,
      id: `${from.uuid}-${to.uuid}`,
      size: 8,
    });
    nodes.push({
      id: to.uuid,
      label: to.displayName ?? to.identity,
      platfrom: to.platform,
      nft: to.nft,
      level: 1,
    });
    to.nft.forEach((k) => {
      nodes.push({
        id: k.uuid,
        label: k.id,
        category: k.category,
        chain: k.chian,
        level: 0,
      });
      edges.push({
        source: to.uuid,
        target: k.uuid,
        label: k.__typename,
        id: `${to.uuid}-${k.uuid}`,
        size: 5,
      });
    });
    from.nft.forEach((k) => {
      nodes.push({
        id: k.uuid,
        label: k.id,
        category: k.category,
        chain: k.chian,
        level: 0,
      });
      edges.push({
        source: from.uuid,
        target: k.uuid,
        label: k.__typename,
        id: `${from.uuid}-${k.uuid}`,
        size: 5,
      });
    });
    nodes.push({
      id: from.uuid,
      label: from.displayName ?? from.identity,
      platfrom: from.platform,
      nft: from.nft,
      level: 1,
    });
  });
  const _nodes = _.uniqBy(nodes, "id");
  const _edges = _.uniqBy(edges, "id");
  return { nodes: _nodes, edges: _edges };
};

const getForceLayoutConfig = (graph, largeGraphMode, configSettings?) => {
  let {
    linkDistance,
    edgeStrength,
    nodeStrength,
    nodeSpacing,
    preventOverlap,
    nodeSize,
    collideStrength,
    alpha,
    alphaDecay,
    alphaMin,
  } = configSettings || { preventOverlap: true };

  if (!linkDistance && linkDistance !== 0) linkDistance = 1000;
  if (!edgeStrength && edgeStrength !== 0) edgeStrength = 20;
  if (!nodeStrength && nodeStrength !== 0) nodeStrength = 200;
  if (!nodeSpacing && nodeSpacing !== 0) nodeSpacing = 500;

  const config = {
    type: "gForce",
    minMovement: 0.01,
    maxIteration: 5000,
    preventOverlap,
    damping: 0.99,
    linkDistance: (d) => {
      let dist = linkDistance;
      const sourceNode = d.source;
      const targetNode = d.source;
      if (!sourceNode.level && !targetNode.level) dist = linkDistance * 0.3;
      return dist;
    },
    edgeStrength: (d) => {
      return edgeStrength;
    },
    nodeStrength: (d) => {
      return nodeStrength;
    },
    nodeSize: (d) => {
      if (!nodeSize && d.size) return d.size;
      return 50;
    },
    nodeSpacing: (d) => {
      if (d.degree === 0) return nodeSpacing * 2;
      if (d.level) return nodeSpacing;
      return nodeSpacing;
    },
    onLayoutEnd: () => {
      if (largeGraphMode) {
        console.log('large')
        graph.getEdges().forEach((edge) => {
          if (!edge.oriLabel) return;
          edge.update({
            label: labelFormatter(edge.oriLabel, labelMaxLength),
          });
        });
      }
    },
    tick: () => {
      graph.refreshPositions();
    },
  };

  if (nodeSize) config["nodeSize"] = nodeSize;
  if (collideStrength) config["collideStrength"] = collideStrength;
  if (alpha) config["alpha"] = alpha;
  if (alphaDecay) config["alphaDecay"] = alphaDecay;
  if (alphaMin) config["alphaMin"] = alphaMin;

  return config;
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

  // todo: kill the infinite loop
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
    console.log(res, "graphData");

    graph = new G6.Graph({
      container: container.current,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      defaultNode: {
        // todo: img node
        // img: "https://pixabay.com/vectors/twitter-tweet-twitter-bird-312464/",
        type: "circle",
        size: 30,
        // clipCfg: {
        //   show: true,
        //   type: "circle",
        //   r: 100,
        // },
        labelCfg: {
          position: "bottom",
        },
      },
      defaultEdge: {
        style: {
          endArrow: true,
          startArrow: true,
        },
        labelCfg: {
          autoRotate: true,
          style: {
            stroke: "#fff",
            lineWidth: 5,
          },
        },
      },
      linkCenter: true,
      minZoom: 0.1,
      groupByTypes: false,
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
          "shortcuts-call",
        ],
        lassoSelect: [
          {
            type: "zoom-canvas",
            enableOptimize: true,
            optimizeZoom: 0.01,
          },
          {
            type: "lasso-select",
            selectedState: "focus",
            trigger: "drag",
          },
        ],
        fisheyeMode: [],
      },
    });

    graph.get("canvas").set("localRefresh", false);

    const layoutConfig: any = getForceLayoutConfig(graph, largeGraphMode);
    layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
    layout.instance = new G6.Layout["gForce"](layoutConfig);
    layout.instance.init({
      nodes: res.nodes,
      edges: res.edges,
    });
    layout.instance.execute();

    graph.data({
      nodes: res.nodes.map(function (node, i) {
        node.label = formatText(node.label);
        return node;
      }),
      edges: res.edges.map(function (edge, i) {
        edge.id = "edge" + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    const bindListener = () => {
      graph.on("node:dragstart", function (e) {
        // graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on("node:drag", function (e) {
        console.log("drag");
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
    };
    const refreshDragedNodePosition = (e) => {
      const model = e.item.get("model");
      model.fx = e.x;
      model.fy = e.y;
    };
    bindListener();
  }, [called, data, error, fetchGraph, loading, type]);

  return (
    <div className="graph-mask" onClick={onClose}>
      {(!data && (
        <div className="graph-container">
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
