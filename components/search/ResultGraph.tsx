import React, { useEffect, useState } from "react";
import { colorSets, global } from "./graphCom/LargeGraphRegister";
import { uniqueId } from "@antv/util";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { useGraphData } from "../hooks/useGraphData";
import _ from "lodash";
import { Empty } from "../shared/Empty";

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
const insertCss = isBrowser ? require("insert-css") : null;

let graph = null;
let louvain = null;

if (isBrowser) {
  louvain = G6.Algorithm.louvain;
  insertCss(`
		.g6-component-contextmenu {
			position: absolute;
			z-index: 2;
			list-style-type: none;
			background-color: #363b40;
			border-radius: 6px;
			font-size: 14px;
			color: hsla(0,0%,100%,.85);
			width: fit-content;
			transition: opacity .2s;
			text-align: center;
			padding: 0px 20px 0px 20px;
			box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.6);
			border: 0px;
		}
		.g6-component-contextmenu ul {
			padding-left: 0px;
			margin: 0;
		}
		.g6-component-contextmenu li {
			cursor: pointer;
			list-style-type: none;
			list-style: none;
			margin-left: 0;
			line-height: 38px;
	}
		}
		.g6-component-contextmenu li:hover {
			color: #aaa;
		}
	`);
}

const NODESIZEMAPPING = "degree";
const SMALLGRAPHLABELMAXLENGTH = 5;
let labelMaxLength = SMALLGRAPHLABELMAXLENGTH;
const DEFAULTNODESIZE = 20;
const DEFAULTAGGREGATEDNODESIZE = 53;
const NODE_LIMIT = 40; // TODO: find a proper number for maximum node number on the canvas

let hiddenItemIds = [];
let cachePositions = {};
let manipulatePosition = undefined;
let descreteNodeCenter;
let CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 800;

const descendCompare = (p) => {
  return function (m, n) {
    const a = m[p];
    const b = n[p];
    return b - a;
  };
};

const clearFocusItemState = (graph) => {
  if (!graph) return;
  clearFocusNodeState(graph);
  clearFocusEdgeState(graph);
};

// 清除图上所有节点的 focus 状态及相应样式
const clearFocusNodeState = (graph) => {
  const focusNodes = graph.findAllByState("node", "focus");
  focusNodes.forEach((fnode) => {
    graph.setItemState(fnode, "focus", false); // false
  });
};

// 清除图上所有边的 focus 状态及相应样式
const clearFocusEdgeState = (graph) => {
  const focusEdges = graph.findAllByState("edge", "focus");
  focusEdges.forEach((fedge) => {
    graph.setItemState(fedge, "focus", false);
  });
};

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

const processNodesEdges = (
  nodes,
  edges,
  width,
  height,
  largeGraphMode,
  edgeLabelVisible,
  isNewGraph = false
) => {
  if (!nodes || nodes.length === 0) return {};
  const currentNodeMap = {};
  let maxNodeCount = -Infinity;
  const paddingRatio = 0.3;
  const paddingLeft = paddingRatio * width;
  const paddingTop = paddingRatio * height;
  nodes.forEach((node) => {
    node.type = node.level === 0 ? "real-node" : "aggregated-node";
    node.isReal = node.level === 0 ? true : false;
    node.label = `${node.id}`;
    node.labelLineNum = undefined;
    node.oriLabel = node.label;
    node.label = formatText(node.label, labelMaxLength, "...");
    node.degree = 0;
    node.inDegree = 0;
    node.outDegree = 0;
    if (currentNodeMap[node.id]) {
      console.warn("node exists already!", node.id);
      node.id = `${node.id}${Math.random()}`;
    }
    currentNodeMap[node.id] = node;
    if (node.count > maxNodeCount) maxNodeCount = node.count;
    const cachePosition = cachePositions ? cachePositions[node.id] : undefined;
    if (cachePosition) {
      node.x = cachePosition.x;
      node.y = cachePosition.y;
      node.new = false;
    } else {
      node.new = isNewGraph ? false : true;
      if (manipulatePosition && !node.x && !node.y) {
        node.x =
          manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
        node.y =
          manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
      }
    }
  });

  let maxCount = -Infinity;
  let minCount = Infinity;
  // let maxCount = 0;
  edges.forEach((edge) => {
    // to avoid the dulplicated id to nodes
    if (!edge.id) edge.id = `edge-${uniqueId()}`;
    else if (edge.id.split("-")[0] !== "edge") edge.id = `edge-${edge.id}`;
    // TODO: delete the following line after the queried data is correct
    if (!currentNodeMap[edge.source] || !currentNodeMap[edge.target]) {
      console.warn(
        "edge source target does not exist",
        edge.source,
        edge.target,
        edge.id
      );
      return;
    }
    const sourceNode = currentNodeMap[edge.source];
    const targetNode = currentNodeMap[edge.target];

    if (!sourceNode || !targetNode)
      console.warn(
        "source or target is not defined!!!",
        edge,
        sourceNode,
        targetNode
      );

    // calculate the degree
    sourceNode.degree++;
    targetNode.degree++;
    sourceNode.outDegree++;
    targetNode.inDegree++;

    if (edge.count > maxCount) maxCount = edge.count;
    if (edge.count < minCount) minCount = edge.count;
  });

  nodes.sort(descendCompare(NODESIZEMAPPING));
  const maxDegree = nodes[0].degree || 1;

  const descreteNodes = [];
  nodes.forEach((node, i) => {
    // assign the size mapping to the outDegree
    const countRatio = node.count / maxNodeCount;
    const isRealNode = node.level === 0;
    node.size = isRealNode ? DEFAULTNODESIZE : DEFAULTAGGREGATEDNODESIZE;
    node.isReal = isRealNode;
    node.labelCfg = {
      position: "bottom",
      offset: 5,
      style: {
        fill: global.node.labelCfg.style.fill,
        fontSize: 6 + countRatio * 6 || 12,
        stroke: global.node.labelCfg.style.stroke,
        lineWidth: 3,
      },
    };

    if (!node.degree) {
      descreteNodes.push(node);
    }
  });

  const countRange = maxCount - minCount;
  const minEdgeSize = 1;
  const maxEdgeSize = 7;
  const edgeSizeRange = maxEdgeSize - minEdgeSize;
  edges.forEach((edge) => {
    // set edges' style
    const targetNode = currentNodeMap[edge.target];

    const size =
      ((edge.count - minCount) / countRange) * edgeSizeRange + minEdgeSize || 1;
    edge.size = size;

    const arrowWidth = Math.max(size / 2 + 2, 3);
    const arrowLength = 10;
    const arrowBeging = targetNode.size + arrowLength;
    let arrowPath = `M ${arrowBeging},0 L ${
      arrowBeging + arrowLength
    },-${arrowWidth} L ${arrowBeging + arrowLength},${arrowWidth} Z`;
    let d = targetNode.size / 2 + arrowLength;
    if (edge.source === edge.target) {
      edge.type = "loop";
      arrowPath = undefined;
    }
    const sourceNode = currentNodeMap[edge.source];
    const isRealEdge = targetNode.isReal && sourceNode.isReal;
    edge.isReal = isRealEdge;
    const stroke = isRealEdge
      ? global.edge.style.realEdgeStroke
      : global.edge.style.stroke;
    const opacity = isRealEdge
      ? global.edge.style.realEdgeOpacity
      : global.edge.style.strokeOpacity;
    const dash = Math.max(size, 2);
    const lineDash = isRealEdge ? undefined : [dash, dash];
    edge.style = {
      stroke,
      strokeOpacity: opacity,
      cursor: "pointer",
      lineAppendWidth: Math.max(edge.size || 5, 5),
      fillOpacity: 1,
      lineDash,
      endArrow: arrowPath
        ? {
            path: arrowPath,
            d,
            fill: stroke,
            strokeOpacity: 0,
          }
        : false,
    };
    edge.labelCfg = {
      autoRotate: true,
      style: {
        stroke: global.edge.labelCfg.style.stroke,
        fill: global.edge.labelCfg.style.fill,
        lineWidth: 10,
        fontSize: 12,
        lineAppendWidth: 10,
        opacity: 1,
      },
    };
    if (!edge.oriLabel) edge.oriLabel = edge.label;
    if (largeGraphMode || !edgeLabelVisible) edge.label = "";
    else {
      edge.label = labelFormatter(edge.label, labelMaxLength);
    }

    // arrange the other nodes around the hub
    const sourceDis = sourceNode.size / 2 + 20;
    const targetDis = targetNode.size / 2 + 20;
    if (sourceNode.x && !targetNode.x) {
      targetNode.x =
        sourceNode.x + sourceDis * Math.cos(Math.random() * Math.PI * 2);
    }
    if (sourceNode.y && !targetNode.y) {
      targetNode.y =
        sourceNode.y + sourceDis * Math.sin(Math.random() * Math.PI * 2);
    }
    if (targetNode.x && !sourceNode.x) {
      sourceNode.x =
        targetNode.x + targetDis * Math.cos(Math.random() * Math.PI * 2);
    }
    if (targetNode.y && !sourceNode.y) {
      sourceNode.y =
        targetNode.y + targetDis * Math.sin(Math.random() * Math.PI * 2);
    }

    if (!sourceNode.x && !sourceNode.y && manipulatePosition) {
      sourceNode.x =
        manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
      sourceNode.y =
        manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
    }
    if (!targetNode.x && !targetNode.y && manipulatePosition) {
      targetNode.x =
        manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
      targetNode.y =
        manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
    }
  });

  descreteNodeCenter = {
    x: width - paddingLeft,
    y: height - paddingTop,
  };
  descreteNodes.forEach((node) => {
    if (!node.x && !node.y) {
      node.x =
        descreteNodeCenter.x + 30 * Math.cos(Math.random() * Math.PI * 2);
      node.y =
        descreteNodeCenter.y + 30 * Math.sin(Math.random() * Math.PI * 2);
    }
  });

  G6.Util.processParallelEdges(edges, 12.5, "custom-quadratic", "custom-line");
  return {
    maxDegree,
    edges,
  };
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

  if (!linkDistance && linkDistance !== 0) linkDistance = 225;
  if (!edgeStrength && edgeStrength !== 0) edgeStrength = 50;
  if (!nodeStrength && nodeStrength !== 0) nodeStrength = 200;
  if (!nodeSpacing && nodeSpacing !== 0) nodeSpacing = 5;

  const config = {
    type: "gForce",
    minMovement: 0.01,
    maxIteration: 5000,
    preventOverlap,
    damping: 0.99,
    gpuEnabled: largeGraphMode,
  };

  if (nodeSize) config["nodeSize"] = nodeSize;
  if (collideStrength) config["collideStrength"] = collideStrength;
  if (alpha) config["alpha"] = alpha;
  if (alphaDecay) config["alphaDecay"] = alphaDecay;
  if (alphaMin) config["alphaMin"] = alphaMin;

  return config;
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
    });
    nodes.push({
      id: to.uuid,
      label: to.displayName ?? to.identity,
      platfrom: to.platform,
      nft: to.nft,
      level: 1,
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

export const ResultGraph = (props) => {
  const { value, platform, type, onClose } = props;
  const container = React.useRef<HTMLDivElement>(null);
  const [edgeLabelVisible, setEdgeLabelVisible] = useState(false);
  const result = useGraphData(value, platform, type);
  // todo: to open the layout or not

  useEffect(() => {
    if (!result.data || graph) return;
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    const data = resolveGraphData(
      type === "ens"
        ? result.data.nft.owner.neighborWithTraversal
        : result.data.identity.neighborWithTraversal
    );
    console.log(data, "graphData");

    const contextMenu = new G6.Menu({
      shouldBegin(evt) {
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas())
          return true;
        if (evt.item) return true;
        return false;
      },
      getContent(evt) {
        const { item } = evt;
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
          return `<ul>
                  <li id='show'>show all hide nodes</li>
                  <li id='collapseAll'>Aggregate all clusters</li>
                </ul>`;
        } else if (!item) return;
        const itemType = item?.getType();
        const model = item?.getModel();
        if (itemType && model) {
          if (itemType === "node") {
            if (model.level !== 0) {
              return `<ul>
                      <li id='expand'>expand identity</li>
                      <li id='hide'>hide this node</li>
                    </ul>`;
            } else {
              return `<ul>
                      <li id='collapse'>aggregate identity</li>
                      <li id='hide'>hide this node</li>
                    </ul>`;
            }
          } else {
            return `<ul>
                    <li id='hide'>hide this edge</li>
                  </ul>`;
          }
        }
      },
      // handleMenuClick: (target, item) => {
      //   const model = item?.getModel();
      //   const liIdStrs = target.id.split("-");
      //   let mixedGraphData;
      //   switch (liIdStrs[0]) {
      //     case "hide":
      //       graph.hideItem(item);
      //       hiddenItemIds.push(model.id);
      //       break;
      //     case "expand":
      //       const newArray = manageExpandCollapseArray(
      //         graph.getNodes().length,
      //         model,
      //         collapseArray,
      //         expandArray
      //       );
      //       expandArray = newArray.expandArray;
      //       collapseArray = newArray.collapseArray;
      //       mixedGraphData = getMixedGraph(
      //         clusteredData,
      //         data,
      //         nodeMap,
      //         aggregatedNodeMap,
      //         expandArray,
      //         collapseArray
      //       );
      //       break;
      //     case "collapse":
      //       const aggregatedNode = aggregatedNodeMap[model.clusterId];
      //       manipulatePosition = {
      //         x: aggregatedNode.x,
      //         y: aggregatedNode.y,
      //       };
      //       collapseArray.push(aggregatedNode);
      //       for (let i = 0; i < expandArray.length; i++) {
      //         if (expandArray[i].id === model.clusterId) {
      //           expandArray.splice(i, 1);
      //           break;
      //         }
      //       }
      //       mixedGraphData = getMixedGraph(
      //         clusteredData,
      //         data,
      //         nodeMap,
      //         aggregatedNodeMap,
      //         expandArray,
      //         collapseArray
      //       );
      //       break;
      //     case "collapseAll":
      //       expandArray = [];
      //       collapseArray = [];
      //       mixedGraphData = getMixedGraph(
      //         clusteredData,
      //         data,
      //         nodeMap,
      //         aggregatedNodeMap,
      //         expandArray,
      //         collapseArray
      //       );
      //       break;
      //     case "neighbor":
      //       const expandNeighborSteps = parseInt(liIdStrs[1]);
      //       mixedGraphData = getNeighborMixedGraph(
      //         model,
      //         expandNeighborSteps,
      //         data,
      //         clusteredData,
      //         currentUnproccessedData,
      //         nodeMap,
      //         aggregatedNodeMap,
      //         10
      //       );
      //       break;
      //     case "show":
      //       showItems(graph);
      //       break;
      //     default:
      //       break;
      //   }
      //   if (mixedGraphData) {
      //     cachePositions = cacheNodePositions(graph.getNodes());
      //     currentUnproccessedData = mixedGraphData;
      //     handleRefreshGraph(
      //       graph,
      //       currentUnproccessedData,
      //       CANVAS_WIDTH,
      //       CANVAS_HEIGHT,
      //       largeGraphMode,
      //       true,
      //       false
      //     );
      //   }
      // },
      // offsetX and offsetY include the padding of the parent container
      // 需要加上父级容器的 padding-left 16 与自身偏移量 10
      offsetX: 16 + 10,
      // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
      offsetY: 0,
      // the types of items that allow the menu show up
      // 在哪些类型的元素上响应
      itemTypes: ["node", "edge", "canvas"],
    });

    graph = new G6.Graph({
      container: container.current,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      layout: {
        type: "force",
        preventOverlap: true,
        linkDistance: (d) => {
          if (d.source.id === "node0") {
            return 100;
          }
          return 30;
        },
        nodeStrength: (d) => {
          if (d.isLeaf) {
            return -50;
          }
          return -10;
        },
        edgeStrength: (d) => {
          if (
            d.source.id === "node1" ||
            d.source.id === "node2" ||
            d.source.id === "node3"
          ) {
            return 0.7;
          }
          return 0.1;
        },
      },
      defaultNode: {
        color: "#5B8FF9",
      },
      modes: {
        default: ["drag-canvas"],
      },
    });

    graph.data({
      nodes: data.nodes,
      edges: data.edges.map(function (edge, i) {
        edge.id = "edge" + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    graph.on("node:dragstart", function (e) {
      graph.layout();
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

    // return graph.clear();
  }, [result, type]);

  function refreshDragedNodePosition(e) {
    const model = e.item.get("model");
    model.fx = e.x;
    model.fy = e.y;
  }

  if (typeof window !== "undefined")
    window.onresize = () => {
      if (container && container.current) {
        CANVAS_WIDTH = container.current.offsetWidth;
        CANVAS_HEIGHT = container.current.offsetHeight;
      }
      if (graph) {
        graph.changeSize(CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    };

  if (result.loading)
    return (
      <div className="graph-mask">
        <div className="graph-container">
          <Loading />
        </div>
      </div>
    );
  if (result.error)
    return (
      <div className="graph-mask">
        <div className="graph-container">
          <Error text={result.error} />
        </div>
      </div>
    );
  if (result.data)
    return (
      <div className="graph-mask" onClick={onClose}>
        <div
          className="graph-container"
          ref={container}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </div>
    );
  return (
    <div className="graph-mask">
      <div className="graph-container">
        <Empty />
      </div>
    </div>
  );
};
