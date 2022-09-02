import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

const data = {
  nodes: [
    { id: "node0", size: 50 },
    { id: "node1", size: 30 },
    { id: "node2", size: 30 },
    { id: "node3", size: 30 },
    { id: "node4", size: 30, isLeaf: true },
    { id: "node5", size: 30, isLeaf: true },
    { id: "node6", size: 15, isLeaf: true },
    { id: "node7", size: 15, isLeaf: true },
    { id: "node8", size: 15, isLeaf: true },
    { id: "node9", size: 15, isLeaf: true },
    { id: "node10", size: 15, isLeaf: true },
    { id: "node11", size: 15, isLeaf: true },
    { id: "node12", size: 15, isLeaf: true },
    { id: "node13", size: 15, isLeaf: true },
    { id: "node14", size: 15, isLeaf: true },
    { id: "node15", size: 15, isLeaf: true },
    { id: "node16", size: 15, isLeaf: true },
  ],
  edges: [
    { source: "node0", target: "node1" },
    { source: "node0", target: "node2" },
    { source: "node0", target: "node3" },
    { source: "node0", target: "node4" },
    { source: "node0", target: "node5" },
    { source: "node1", target: "node6" },
    { source: "node1", target: "node7" },
    { source: "node2", target: "node8" },
    { source: "node2", target: "node9" },
    { source: "node2", target: "node10" },
    { source: "node2", target: "node11" },
    { source: "node2", target: "node12" },
    { source: "node2", target: "node13" },
    { source: "node3", target: "node14" },
    { source: "node3", target: "node15" },
    { source: "node3", target: "node16" },
  ],
};

export const ResultGraph = () => {
  const ref = React.useRef(null);
  let graph = null;
  useEffect(() => {
    if (!graph) {
      // eslint-disable-next-line react/no-find-dom-node
      const container = ReactDOM.findDOMNode(ref.current);
      const graph = new G6.Graph({
        container,
        width: 400,
        height: 400,
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
        edges: data.edges,
      });
      graph.render();

      graph.on("node:dragstart", function (e) {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on("node:drag", function (e) {
        refreshDragedNodePosition(e);
      });
      graph.on("node:dragend", function (e) {
        e.item.get("model").fx = null;
        e.item.get("model").fy = null;
      });

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };

      const refreshDragedNodePosition = (e) => {
        const model = e.item.get("model");
        model.fx = e.x;
        model.fy = e.y;
      };
    }
  }, [graph]);

  return <div ref={ref}></div>;
};
