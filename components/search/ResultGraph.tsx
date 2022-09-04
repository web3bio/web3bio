import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

export const ResultGraph = (props) => {
  const { onClose, links, nodes } = props;
  const ref = React.useRef(null);
  console.log(nodes, links, "graph");
  let graph = null;
  useEffect(() => {
    if (!graph) {
      // eslint-disable-next-line react/no-find-dom-node
      const container = ReactDOM.findDOMNode(ref.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new G6.Graph({
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
          default: ["drag-combo"],
        },
      });
      graph.data({
        nodes: nodes,
        edges: links,
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

      if (typeof window !== undefined)
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
  });

  return (
    <div className="graph-mask" onClick={onClose}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="graph-cotainer"
        ref={ref}
      ></div>
    </div>
  );
};
