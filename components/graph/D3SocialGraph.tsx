import { useEffect, useRef, useState } from "react";
import { Empty } from "../shared/Empty";
import * as d3 from "d3";
import SVG from "react-inlinesvg";
import {
  useIdentitySocialGraphData,
  useInitialPackingSocialGraphData,
  usePlatformSocialGraphData,
} from "./hook";
import { formatText, SocialPlatformMapping } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";
import { useLazyQuery } from "@apollo/client";
import { GET_PROFILE_IDENTITY_GRAPH } from "../../utils/queries";
import D3IdentityGraph, { calcTranslation } from "./D3IdentityGraph";

const SocialGraphNodeSize = 50;

const enum GraphView {
  initial = 1,
  platform = 2,
  identity = 3,
}

const updateNodes = (nodeContainer) => {
  const identityBadge = nodeContainer
    .append("circle")
    .attr("class", "identity-badge")
    .attr("r", 16)
    .attr("fill", (d) => SocialPlatformMapping(d.platform).color);

  const identityIcon = nodeContainer
    .append("svg:image")
    .attr("class", "identity-icon")
    .attr("xlink:href", (d) => SocialPlatformMapping(d.platform).icon);

  const displayName = nodeContainer
    .append("text")
    .attr("class", "displayName")
    .attr("id", (d) => d.id)
    .text((d) => formatText(d.displayName || d.identity));
  const identity = nodeContainer
    .append("text")
    .attr("class", "identity")
    .attr("id", (d) => d.id)
    .text((d) => {
      if (d.displayName === "") return "";
      if (d.displayName === d.identity) return formatText(d.address);
      return formatText(d.identity);
    });
  return {
    identityBadge,
    identityIcon,
    displayName,
    identity,
  };
};

export default function D3SocialGraph(props) {
  const { data, onDismiss, title } = props;
  const [graphTitle, setGraphTitle] = useState(title);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [graphView, setGraphView] = useState(GraphView.initial);
  const [graphId, setGraphId] = useState("");
  const [clusterParent, setClusterParent] = useState<any>(null);
  const [hideTooltip, setHideToolTip] = useState(true);
  const [transform, setTransform] = useState([0, 0]);
  const [queryIdentityGraph, { data: remoteIdentityGraphData }] = useLazyQuery(
    GET_PROFILE_IDENTITY_GRAPH,
    {
      variables: {
        graphId: graphId,
      },
    }
  );
  const graphContainer = useRef<HTMLDivElement>(null);
  const initialGraphData = useInitialPackingSocialGraphData(data);
  const identityGraphData = useIdentitySocialGraphData(remoteIdentityGraphData);
  const platformGraphData = usePlatformSocialGraphData(clusterParent);

  useEffect(() => {
    const graphData = {
      [GraphView.initial]: initialGraphData,
      [GraphView.platform]: platformGraphData,
    }[graphView];

    if (!graphData) return;
    let chart = null;
    const chartContainer = graphContainer?.current;
    const generateGraph = (_data) => {
      const width = chartContainer?.offsetWidth!;
      const height = chartContainer?.offsetHeight!;

      const nodes = _data.nodes.map((d) => ({ ...d }));
      const edges = _data.edges.map((d) => ({ ...d }));
      const removeHighlight = () => {
        setHideToolTip(true);
        setCurrentNode(null);
        edgeLabels.attr("class", "edge-label");
        edgePath.attr("class", "edge-path");
        maskCircle.attr("opacity", 0);
        circle.attr("class", "node");
        displayName.attr("class", "displayName");
        identity.attr("class", "identity");
      };
      const svg = d3
        .select(".svg-canvas")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .call(
          d3
            .zoom()
            .scaleExtent([1, 1])
            .on("zoom", (e) => {
              svg.attr("transform", e.transform);
            })
            .on("start", () => {
              setHideToolTip(true);
            })
            .on("end", (e) => {
              setTransform([e.transform.x, e.transform.y]);
              setHideToolTip(false);
            })
        )
        .on("click", removeHighlight)
        .append("svg:g");

      const generateSimulation = () => {
        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink(edges)
              .id((d) => d.id)
              .distance(20)
          )
          .force("charge", d3.forceManyBody())
          .force("x", d3.forceX(width / 2).strength(1.5))
          .force("y", d3.forceY(height / 2).strength(1))
          .force(
            "collision",
            d3.forceCollide().radius((d) => 100)
          )
          .force("center", d3.forceCenter(width / 2, height / 2))
          .stop();

        return simulation;
      };

      const simulation = generateSimulation();
      // marker
      svg
        .append("defs")
        .selectAll("marker")
        .data(edges)
        .join("marker")
        .attr("id", (d) => `arrow-${d.id}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", 7)
        .attr("markerHeight", 7)
        .attr("refX", (d) => SocialGraphNodeSize + (d.isSingle ? 30 : 26))
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#cecece")
        .attr("d", "M0,-5L10,0L0,5");

      const edgePath = svg
        .selectAll(".edge-path")
        .data(edges)
        .enter()
        .append("path")
        .attr("stroke-width", 0.8)
        .attr("class", "edge-path")
        .attr("id", (d) => "edgepath" + d.id)
        .attr("marker-end", (d) => `url(#arrow-${d.id})`);

      const edgeLabels = svg
        .selectAll(".edge-label")
        .data(edges)
        .enter()
        .append("text")
        .attr("id", (d) => d.id)
        .attr("class", "edge-label")
        .attr("dx", ".5em")
        .attr("dy", "3px")
        .attr("text-anchor", "middle")
        .text((d) => d.label);

      const dragged = (event, d) => {
        const clamp = (x, lo, hi) => {
          return x < lo ? lo : x > hi ? hi : x;
        };
        d.fx = clamp(event.x, 0, width);
        d.fy = clamp(event.y, 0, height);
        nodeContainer.each((o) => {
          if (o != d) {
            o.fx = o.x;
            o.fy = o.y;
          }
        });
        simulation.alpha(1).restart();
      };
      const nodeContainer = svg
        .selectAll(".node")
        .data(nodes, (d) => d.id)
        .join("g")
        .call(
          d3
            .drag()
            .on("drag", dragged)
            .on("start", () => setHideToolTip(true))
            .on("end", () => setHideToolTip(false))
        );

      const circle = nodeContainer
        .append("circle")
        .attr("stroke-width", 2)
        .attr("r", SocialGraphNodeSize)
        .attr("stroke", (d) => SocialPlatformMapping(d.platform).color)
        .attr("fill", "#fff");

      const maskCircle = nodeContainer
        .attr("id", (d) => d.id)
        .append("circle")
        .attr("class", "node")
        .attr("fill", (d) => SocialPlatformMapping(d.platform).color)
        .attr("fill-opacity", 0.1)
        .attr("opacity", 0)
        .attr("r", (d) => SocialGraphNodeSize)
        .on("click", (e, i) => {
          e.preventDefault();
          e.stopPropagation();
          removeHighlight();
          highlightNode(i);
        })
        .on("dblclick", (e, i) => {
          expandGraph(i);
        });

      const { displayName, identity, identityBadge, identityIcon } =
        updateNodes(nodeContainer);
      const ticked = () => {
        edgePath.attr("d", (d) => {
          const delta = calcTranslation(4, d.source, d.target);
          const rightwardSign = d.target.x > d.source.x ? 3 : -3;
          return (
            "M" +
            (d.isSingle ? d.source.x : d.source.x + rightwardSign * delta.dx) +
            "," +
            (d.isSingle ? d.source.y : d.source.y + -rightwardSign * delta.dy) +
            "L" +
            (d.isSingle ? d.target.x : d.target.x + rightwardSign * delta.dx) +
            "," +
            (d.isSingle ? d.target.y : d.target.y + -rightwardSign * delta.dy)
          );
        });

        circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        maskCircle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        displayName
          .attr("dx", (d) => d.x)
          .attr("dy", (d) => d.y)
          .attr("text-anchor", "middle");
        identity
          .attr("dx", (d) => d.x)
          .attr("dy", (d) => d.y + 14)
          .attr("text-anchor", "middle");

        identityBadge
          .attr("cx", (d) => d.x + 60 / 2 + 8)
          .attr("cy", (d) => d.y - 60 / 2 - 8);

        identityIcon
          .attr("x", (d) => d.x + 60 / 2 - 2)
          .attr("y", (d) => d.y - 60 / 2 - 18);

        edgeLabels.attr("transform", (d) => {
          let transformation = ``;

          const x = (d.source.x + d.target.x) / 2;
          const y = (d.source.y + d.target.y) / 2;
          transformation += `translate(${x}, ${y}) `;

          if (d.source.x > d.target.x) {
            transformation += `rotate(180) `;
          }
          const angle = Math.atan2(
            d.target.y - d.source.y,
            d.target.x - d.source.x
          );
          transformation += `rotate(${(angle * 180) / Math.PI}) `;

          return transformation;
        });
      };

      const highlightNode = (i) => {
        if (hideTooltip) setHideToolTip(false);
        setCurrentNode(i);
        nodeContainer.filter((l) => l.id === i.id).raise();
        edgeLabels
          .filter((l) => l.id.includes(i.id))
          .attr("class", "edge-label edge-label-selected");
        edgePath
          .filter((l) => l.source.id === i.id || l.target.id === i.id)
          .attr("class", "edge-path edge-selected");
        circle.filter((l) => l.id === i.id).attr("class", "node node-selected");
        maskCircle.filter((l) => l.id === i.id).attr("opacity", 1);
        displayName
          .filter((l) => l.id === i.id)
          .attr("class", "displayName displayName-selected");
        identity
          .filter((l) => l.id === i.id)
          .attr("class", "identity identity-selected");
      };

      d3.timeout(() => {
        for (
          let i = 0,
            n = Math.ceil(
              Math.log(simulation.alphaMin()) /
                Math.log(1 - simulation.alphaDecay())
            );
          i < n;
          ++i
        ) {
          simulation.tick();
        }
        ticked();
        simulation.on("tick", ticked);
      });
      return svg.node();
    };

    if (!chart && chartContainer) {
      chart = generateGraph(graphData);
    }
    return () => {
      const svg = d3.select(".svg-canvas");
      svg.selectAll("*").remove();
    };
  }, [graphView, identityGraphData, platformGraphData]);

  const expandGraph = (node?) => {
    setHideToolTip(true);
    const _node = node || currentNode;
    if (_node.cluster) {
      setClusterParent(
        initialGraphData.nodes.find((x) => x.id === _node?.parent)
      );
      setGraphView(GraphView.platform);
    }
    if (_node.graphId) {
      setGraphId(_node.graphId);
      queryIdentityGraph();
      setGraphTitle(`${_node.displayName}(${_node.platform})`);
      setGraphView(GraphView.identity);
    }
    setCurrentNode(null);
  };
  return (
    <>
      {(graphView === GraphView.identity && identityGraphData && (
        <D3IdentityGraph
          onBack={() => {
            setGraphTitle(title);
            setGraphView(GraphView.initial);
            setCurrentNode(null);
          }}
          onClose={onDismiss}
          data={identityGraphData}
          title={graphTitle}
        />
      )) || (
        <div className="identity-graph-modal">
          <div
            className="graph-container"
            ref={graphContainer}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {(data && <svg className="svg-canvas" />) || (
              <Empty title={"No social graph found"} />
            )}

            <div className="graph-header">
              <div className="graph-title">
                <SVG src={"/icons/icon-view.svg"} width="20" height="20" />
                <span className="ml-2">
                  Social Graph for
                  <strong className="ml-1">{graphTitle}</strong>
                </span>
              </div>
              <div className="btn-close">
                {graphView === GraphView.platform && (
                  <div
                    className="btn"
                    onClick={() => {
                      setGraphView(GraphView.initial);
                      setCurrentNode(null);
                    }}
                  >
                    <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
                    Back
                  </div>
                )}
                <div className="btn" onClick={onDismiss}>
                  <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
                </div>
              </div>
            </div>
          </div>
          {currentNode && !hideTooltip && (
            <div
              className="web3bio-tooltip"
              style={{
                left: currentNode.x + SocialGraphNodeSize,
                top: currentNode.y + SocialGraphNodeSize,
                transform: `translate(${transform[0]}px,${transform[1]}px)`,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {!currentNode.cluster ? (
                <ul>
                  <li className="text-large text-bold">
                    {currentNode.displayName || "-"}
                  </li>
                  <li className="mb-1">
                    {currentNode.identity != currentNode.displayName
                      ? currentNode.platform === PlatformType.ethereum
                        ? formatText(currentNode.identity)
                        : currentNode.identity
                      : ""}
                  </li>
                  {(currentNode.uid && (
                    <li>
                      <span className="text-gray">
                        {currentNode.platform === PlatformType.farcaster
                          ? "FID"
                          : "UID"}
                        :{" "}
                      </span>
                      {currentNode.uid}
                    </li>
                  )) ||
                    ""}
                  {((currentNode.address ||
                    currentNode.platform === PlatformType.ethereum) && (
                    <li>
                      <span className="text-gray">Address: </span>
                      {currentNode.address || currentNode.identity}
                    </li>
                  )) ||
                    ""}
                  <li>
                    <span className="text-gray">Platform: </span>
                    {SocialPlatformMapping(currentNode.platform as PlatformType)
                      ?.label ||
                      currentNode.platform ||
                      "Unknown"}
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <span className="text-gray">Platform: </span>
                    {currentNode.platform || ""}
                  </li>
                  <li>
                    <span className="text-gray">Users: </span>
                    {currentNode.amount || ""}
                  </li>
                </ul>
              )}
              {graphView !== GraphView.identity && (
                <div className="btn" onClick={() => expandGraph()}>
                  Expand
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
