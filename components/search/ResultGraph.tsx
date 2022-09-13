import React, { useEffect, useState } from "react";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import _ from "lodash";
import { Empty } from "../shared/Empty";
import { useQuery } from "@apollo/client";
import {
  GET_IDENTITY_GRAPH_DATA,
  GET_IDENTITY_GRAPH_ENS,
} from "../../utils/queries";
import { useGraph } from "./hooks/useGraph";

const isBrowser = typeof window !== "undefined";
const G6 = isBrowser ? require("@antv/g6") : null;
const insertCss = isBrowser ? require("insert-css") : null;

let graph = null;

if (isBrowser) {
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
  const {loading, error,data} = useGraph(value,platform,type)

  // todo: kill the infinite loop
  console.log(loading, error,data)
  useEffect(() => {
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
      nodes: res.nodes,
      edges: res.edges.map(function (edge, i) {
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

    function refreshDragedNodePosition(e) {
      const model = e.item.get("model");
      model.fx = e.x;
      model.fy = e.y;
    }

    return graph.clear();
  }, []);

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
