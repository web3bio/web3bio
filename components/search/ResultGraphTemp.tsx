import React, { useEffect, useState } from "react";
import { colorSets, global } from "./GraphUtils/LargeRegister";
import { uniqueId } from "@antv/util";

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
const insertCss = isBrowser ? require("insert-css") : null;

let louvain = null;
let findShortestPath = null;

if (isBrowser) {
  louvain = G6.Algorithm.louvain;
  findShortestPath = G6.Algorithm.findShortestPath;
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

let graph = null;
let originData;
let currentUnproccessedData = { nodes: [], edges: [] };
let nodeMap = {};
let aggregatedNodeMap = {};
let largeGraphMode = true;
let cachePositions = {};
let manipulatePosition = undefined;
let descreteNodeCenter;
let layout = {
  type: "",
  instance: null,
  destroyed: true,
};

let shiftKeydown = false;
let CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 800;

const descendCompare = (p) => {
  // 这是比较函数
  return function (m, n) {
    const a = m[p];
    const b = n[p];
    return b - a; // 降序
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
    if (!edge.id) edge.id = uniqueId("edge");
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
        lineWidth: 4,
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
    linkDistance: (d) => {
      let dist = linkDistance;
      const sourceNode = nodeMap[d.source] || aggregatedNodeMap[d.source];
      const targetNode = nodeMap[d.target] || aggregatedNodeMap[d.target];
      // // 两端都是聚合点
      // if (sourceNode.level && targetNode.level) dist = linkDistance * 3;
      // // 一端是聚合点，一端是真实节点
      // else if (sourceNode.level || targetNode.level) dist = linkDistance * 1.5;
      if (!sourceNode.level && !targetNode.level) dist = linkDistance * 0.3;
      return dist;
    },
    edgeStrength: (d) => {
      const sourceNode = nodeMap[d.source] || aggregatedNodeMap[d.source];
      const targetNode = nodeMap[d.target] || aggregatedNodeMap[d.target];
      // 聚合节点之间的引力小
      if (sourceNode.level && targetNode.level) return edgeStrength / 2;
      // 聚合节点与真实节点之间引力大
      if (sourceNode.level || targetNode.level) return edgeStrength;
      return edgeStrength;
    },
    nodeStrength: (d) => {
      // 给离散点引力，让它们聚集
      if (d.degree === 0) return -10;
      // 聚合点的斥力大
      if (d.level) return nodeStrength * 2;
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


const generateNeighbors = (
  centerNodeModel,
  step,
  maxNeighborNumPerNode = 5
) => {
  if (step <= 0) return undefined;
  let nodes = [],
    edges = [];
  const clusterId = centerNodeModel.clusterId;
  const centerId = centerNodeModel.id;
  const neighborNum = Math.ceil(Math.random() * maxNeighborNumPerNode);
  for (let i = 0; i < neighborNum; i++) {
    const neighborNode = {
      id: uniqueId("node"),
      clusterId,
      level: 0,
      colorSet: centerNodeModel.colorSet,
    };
    nodes.push(neighborNode);
    const dire = Math.random() > 0.5;
    const source = dire ? centerId : neighborNode.id;
    const target = dire ? neighborNode.id : centerId;
    const neighborEdge = {
      id: uniqueId("edge"),
      source,
      target,
      label: `${source}-${target}`,
    };
    edges.push(neighborEdge);
    const subNeighbors = generateNeighbors(
      neighborNode,
      step - 1,
      maxNeighborNumPerNode
    );
    if (subNeighbors) {
      nodes = nodes.concat(subNeighbors.nodes);
      edges = edges.concat(subNeighbors.edges);
    }
  }
  return { nodes, edges };
};



const examAncestors = (model, expandedArray, length, keepTags) => {
  for (let i = 0; i < length; i++) {
    const expandedNode = expandedArray[i];
    if (!keepTags[i] && model.parentId === expandedNode.id) {
      keepTags[i] = true; // 需要被保留
      examAncestors(expandedNode, expandedArray, length, keepTags);
      break;
    }
  }
};



const LargeGraph = () => {
  const container = React.useRef<HTMLDivElement>(null);
  const [edgeLabelVisible, setEdgeLabelVisible] = useState(false);
  const [graphInstance, setGraphInstance] = useState(null);


  const stopLayout = () => {
    layout.instance.stop();
  };

  const bindListener = (graph) => {
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
    graph.on("node:mouseenter", (evt: any) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      model.oriFontSize = model.labelCfg.style.fontSize;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
      graph.setItemState(item, "hover", true);
      item.toFront();
    });

    graph.on("node:mouseleave", (evt: any) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
      graph.setItemState(item, "hover", false);
    });

    graph.on("edge:mouseenter", (evt: any) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
      item.toFront();
      item.getSource().toFront();
      item.getTarget().toFront();
    });

    graph.on("edge:mouseleave", (evt: any) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
    });
    // click node to show the detail drawer
    graph.on("node:click", (evt: any) => {
      stopLayout();
      if (!shiftKeydown) clearFocusItemState(graph);
      else clearFocusEdgeState(graph);
      const { item } = evt;

      // highlight the clicked node, it is down by click-select
      graph.setItemState(item, "focus", true);

      if (!shiftKeydown) {
        // 将相关边也高亮
        const relatedEdges = item.getEdges();
        relatedEdges.forEach((edge) => {
          graph.setItemState(edge, "focus", true);
        });
      }
    });

    graph.on("edge:click", (evt: any) => {
      stopLayout();
      if (!shiftKeydown) clearFocusItemState(graph);
      const { item } = evt;
      // highlight the clicked edge
      graph.setItemState(item, "focus", true);
    });

    // click canvas to cancel all the focus state
    graph.on("canvas:click", (evt: any) => {
      clearFocusItemState(graph);
    });
  };


  useEffect(() => {
    if (!graph) {
      fetch(
        "https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json"
      )
        .then((res) => res.json())
        .then((data) => {
          if (container && container.current) {
            CANVAS_WIDTH = container.current.offsetWidth;
            CANVAS_HEIGHT = container.current.offsetHeight;
          }

          originData = data;
          nodeMap = {};
          const clusteredData = louvain(data, false, "weight");
          const aggregatedData = { nodes: [], edges: [] };
          clusteredData.clusters.forEach((cluster, i) => {
            cluster.nodes.forEach((node) => {
              node.level = 0;
              node.label = node.id;
              node.type = "";
              node.colorSet = colorSets[i];
              nodeMap[node.id] = node;
            });
            const cnode = {
              id: cluster.id,
              type: "aggregated-node",
              count: cluster.nodes.length,
              level: 1,
              label: cluster.id,
              colorSet: colorSets[i],
              idx: i,
            };
            aggregatedNodeMap[cluster.id] = cnode;
            aggregatedData.nodes.push(cnode);
          });
          clusteredData.clusterEdges.forEach((clusterEdge) => {
            const cedge = {
              ...clusterEdge,
              size: Math.log(clusterEdge.count as number),
              label: "",
              id: uniqueId("edge"),
            };
            if (cedge.source === cedge.target) {
              cedge.type = "loop";
              cedge.loopCfg = {
                dist: 20,
              };
            } else cedge.type = "line";
            aggregatedData.edges.push(cedge);
          });

          data.edges.forEach((edge) => {
            edge.label = `${edge.source}-${edge.target}`;
            edge.id = uniqueId("edge");
          });

          currentUnproccessedData = aggregatedData;

          const { edges: processedEdges } = processNodesEdges(
            currentUnproccessedData.nodes,
            currentUnproccessedData.edges,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            largeGraphMode,
            true,
            true
          );

          graph = new G6.Graph({
            container: container.current as HTMLElement,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
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
                },
                {
                  type: "lasso-select",
                  selectedState: "focus",
                  trigger: "drag",
                },
              ],
              fisheyeMode: [],
            },
            defaultNode: {
              type: "aggregated-node",
              size: DEFAULTNODESIZE,
            },
          });

          graph.get("canvas").set("localRefresh", false);

          const layoutConfig: any = getForceLayoutConfig(graph, largeGraphMode);
          layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
          layout.instance = new G6.Layout["gForce"](layoutConfig);
          layout.instance.init({
            nodes: currentUnproccessedData.nodes,
            edges: processedEdges,
          });
          layout.instance.execute();

          bindListener(graph);
          graph.data({ nodes: aggregatedData.nodes, edges: processedEdges });
          graph.render();
          setGraphInstance(graph);
        });
    }
  });

  // hide the edge label
  useEffect(() => {
    if (!graph || graph.get("destroyed")) return;
    graph.getEdges().forEach((edge) => {
      const oriLabel: string = edge.getModel().oriLabel as string;
      edge.update({
        label: edgeLabelVisible ? labelFormatter(oriLabel, labelMaxLength) : "",
      });
    });
  }, [edgeLabelVisible]);

  if (typeof window !== "undefined")
    window.onresize = () => {
      if (container && container.current) {
        CANVAS_WIDTH = container.current.offsetWidth;
        CANVAS_HEIGHT = container.current.offsetHeight;
      }
      if (graph && layout.instance) {
        layout.instance.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
        graph.changeSize(CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    };
  return (
    <>
      <div
        ref={container}
        style={{
          backgroundColor: "#2b2f33",
          height: "calc(100vh - 100px)",
          width: "70%",
        }}
      />
    </>
  );
};

export default LargeGraph;
