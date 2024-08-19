import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import {
  formatText,
  isDomainSearch,
  isValidEthereumAddress,
} from "../utils/utils";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import SVG from "react-inlinesvg";
import { Empty } from "../shared/Empty";
import { resolveIdentityGraphData } from "./utils";

let CurrentId = null;

const IdentityNodeSize = 48;
const NFTNodeSize = 14;

const getNodeRadius = (isIdentity: boolean) =>
  isIdentity ? IdentityNodeSize : NFTNodeSize;
const getMarkerRefX = (d) => {
  return d.target.isIdentity ? IdentityNodeSize + 30 : NFTNodeSize + 16;
};

const updateNodes = (nodeContainer) => {
  const identityBadge = nodeContainer
    .append("circle")
    .attr("class", "identity-badge")
    .attr("r", 16)
    .attr("fill", (d) => SocialPlatformMapping(d.platform).color)
    .attr("style", (d) => `display:${d.isIdentity ? "normal" : "none"}`);

  const identityIcon = nodeContainer
    .append("svg:image")
    .attr("class", "identity-icon")
    .attr(
      "xlink:href",
      (d) => SocialPlatformMapping(d.platform.toLowerCase()).icon
    )
    .attr("style", (d) => `display:${d.isIdentity ? "normal" : "none"}`)
    .attr("filter", "url(#whiteFilter)");

  const badge = nodeContainer
    .append("svg:image")
    .attr("class", "badge-icon")
    .attr("xlink:href", (d) => SocialPlatformMapping(d.platform).icon)
    .attr("style", (d) => `display:${d.isIdentity ? "none" : "normal"}`)
    .attr("filter", "url(#whiteFilter)");

  const displayName = nodeContainer
    .append("text")
    .attr("class", "displayName")
    .attr("id", (d) => d.id)
    .text((d) => formatText(d.displayName || d.identity));

  const identity = nodeContainer
    .append("text")
    .attr("class", "identity")
    .attr("id", (d) => d.id)
    .style("display", (d) => (d.isIdentity ? "normal" : "none"))
    .text((d) => {
      if (d.displayName === d.identity || isDomainSearch(d.platform))
        return formatText(d.address);
      return formatText(d.identity || d.address);
    });
  return {
    identityBadge,
    identityIcon,
    badge,
    displayName,
    identity,
  };
};

export default function D3IdentityGraph(props) {
  const { data, onClose, title, onBack, disableBack, containerRef, root } =
    props;
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [hideTooltip, setHideToolTip] = useState(true);
  const [transform, setTransform] = useState({
    offsetX: 0,
    offsetY: 0,
    offsetWidth: 0,
  });

  useEffect(() => {
    if (!data) return;
    let chart = null;
    const chartContainer = containerRef?.current;
    const generateGraph = (_data) => {
      const width = chartContainer?.offsetWidth!;
      const height = chartContainer?.offsetHeight!;
      const links = _data.links.map((d) => ({ ...d }));
      const nodes = _data.nodes.map((d) => ({ ...d }));
      const resolveBoundingTransform = () => {
        const curNode = nodeContainer.filter((l) => l.id === CurrentId);
        const curNodeElement = curNode.node();
        if (!curNodeElement) return;
        const rect = curNodeElement.getBoundingClientRect();
        const isIdentity = nodes.find((x) => x.id === CurrentId)?.isIdentity;
        setTransform({
          offsetX: rect.left,
          offsetY: rect.top,
          offsetWidth: isIdentity ? IdentityNodeSize * 2 : NFTNodeSize,
        });
      };
      const removeHighlight = () => {
        setHideToolTip(true);
        setCurrentNode(null);
        setTransform({
          offsetX: 0,
          offsetY: 0,
          offsetWidth: 0,
        });
        CurrentId = null;
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
        .on("click", removeHighlight)
        .call(
          d3
            .zoom()
            .scaleExtent([0.3, 10])
            .on("zoom", (e) => {
              if (!hideTooltip) setHideToolTip(true);
              svg.attr("transform", d3.zoomTransform(svg.node()));
            })
            .on("end", () => {
              resolveBoundingTransform();
              if (hideTooltip) {
                setHideToolTip(false);
              }
            })
        )
        .append("svg:g");
      
      // Add white filter definition
      const defs = svg.append("defs");
      defs.append("filter")
        .attr("id", "whiteFilter")
        .append("feColorMatrix")
        .attr("type", "matrix")
        .attr("values", "1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 1 0");

      const generateSimulation = () => {
        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink(links)
              .id((d) => d.id)
              .distance((d) => (d.source.group === d.target.group ? 100 : 50))
          )
          .force("charge", d3.forceManyBody().strength(-200))
          .force(
            "x",
            d3.forceX((d) => {
              if (d.group === 2) {
                return - width / 4;
              } else {
                return width / 2;
              }
            })
          )
          .force("y", d3.forceY(height / 2))
          .force(
            "collide",
            d3
              .forceCollide(80)
              .radius((d) =>
                d.isIdentity ? IdentityNodeSize * 1.75 : NFTNodeSize * 2.25
              )
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
        .data(links)
        .join("marker")
        .attr("id", (d) => `arrow-${d.id}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", 7)
        .attr("markerHeight", 7)
        .attr("refX", (d) => getMarkerRefX(d))
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#cecece")
        .attr("d", "M0,-5L10,0L0,5");

      const edgePath = svg
        .selectAll(".edge-path")
        .data(links)
        .enter()
        .append("path")
        .attr("stroke-width", 0.8)
        .attr("class", "edge-path")
        .attr("id", (d) => "edgepath" + d.id)
        .attr("marker-end", (d) => `url(#arrow-${d.id})`);

      const edgeLabels = svg
        .selectAll(".edge-label")
        .data(links)
        .enter()
        .append("text")
        .attr("id", (d) => d.id)
        .attr("class", "edge-label")
        .attr("dx", ".5em")
        .attr("dy", "3px")
        .attr("text-anchor", "middle")
        .text((d) =>
          d.source.platform === PlatformType.ens ||
          d.target.platform === PlatformType.ens
            ? ""
            : d.label
        );

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
            .on("drag", (e, d) => {
              if (!hideTooltip) setHideToolTip(true);
              dragged(e, d);
            })
            .on("end", () => {
              resolveBoundingTransform();
              setHideToolTip(false);
            })
        );

      const circle = nodeContainer
        .append("circle")
        .attr("stroke-width", 1.5)
        .attr("r", (d) => getNodeRadius(d.isIdentity))
        .attr("stroke", (d) => SocialPlatformMapping(d.platform).color)
        .attr("fill", (d) =>
          d.isIdentity ? "#fff" : SocialPlatformMapping(d.platform).color
        );
      const maskCircle = nodeContainer
        .attr("id", (d) => d.id)
        .append("circle")
        .attr("class", "node")
        .attr("fill", (d) => SocialPlatformMapping(d.platform).color)
        .attr("fill-opacity", 0.1)
        .attr("opacity", 0)
        .attr("r", (d) => getNodeRadius(d.isIdentity))
        .on("click", (e, i) => {
          e.preventDefault();
          e.stopPropagation();
          removeHighlight();
          highlightNode(i);
        });

      const { displayName, identity, identityBadge, identityIcon, badge } =
        updateNodes(nodeContainer);
      const ticked = () => {
        // tick
        edgePath.attr("d", (d) => {
          return (
            "M" +
            d.source.x +
            "," +
            d.source.y +
            "L" +
            d.target.x +
            "," +
            d.target.y
          );
        });

        circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        maskCircle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        displayName
          .attr("dx", (d) => d.x)
          .attr("dy", (d) => {
            if (!d.isIdentity) return d.y + NFTNodeSize * 2;
            if (
              d.displayName !== "" &&
              (d.displayName !== d.identity || d.address)
            )
              return d.y;
            return d.y + 6;
          })
          .attr("text-anchor", "middle");
        identity
          .attr("dx", (d) => d.x)
          .attr("dy", (d) => (d.isIdentity ? d.y + 14 : 0))
          .attr("text-anchor", "middle");

        identityBadge
          .attr("cx", (d) => d.x + IdentityNodeSize / 2 + 8)
          .attr("cy", (d) => d.y - IdentityNodeSize / 2 - 8);

        identityIcon
          .attr("x", (d) => d.x + IdentityNodeSize / 2 - 2)
          .attr("y", (d) => d.y - IdentityNodeSize / 2 - 18);

        badge.attr("x", (d) => d.x - 9).attr("y", (d) => d.y - 10);

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
        CurrentId = i.id;
        resolveBoundingTransform();
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
          // initial center the root node before every tick
          const rootNode = nodes.find((x) => x.id === root.id);
          if (rootNode) {
            rootNode.x = width / 2;
            rootNode.y = height / 2;
          }
          simulation.tick();
        }
        ticked();
        simulation.on("tick", ticked);
      });
      return svg.node();
    };

    if (!chart && chartContainer) {
      const res = resolveIdentityGraphData(data);
      chart = generateGraph({ nodes: res.nodes, links: res.edges });
    }
    return () => {
      const svg = d3.select(".svg-canvas");
      svg.selectAll("*").remove();
    };
  }, [data]);

  
  return (
    <>
      {(data && <svg className="svg-canvas" />) || (
        <Empty title={"No Identity Graph"} />
      )}

      <div className="graph-header">
        <div className="graph-title">
          <SVG src={"/icons/icon-view.svg"} width="20" height="20" />
          <span className="ml-2">
            Identity Graph for
            <strong className="ml-1">{title}</strong>
          </span>
        </div>
        <div className="graph-header-action">
          {!disableBack && (
            <div className="btn" onClick={onBack}>
              <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
              Back
            </div>
          )}
          <button className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </button>
        </div>
      </div>
      {currentNode && !hideTooltip && (
        <div
          className="web3bio-tooltip"
          style={{
            left: transform.offsetX + transform.offsetWidth / 2,
            top: transform.offsetY + transform.offsetWidth / 2,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {currentNode.isIdentity ? (
            <ul>
              <li className="text-large text-bold">
                {currentNode.displayName || "-"}
              </li>
              <li className="mb-1">
                {currentNode.identity !== currentNode.displayName
                  ? isValidEthereumAddress(currentNode.identity)
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
                  #{currentNode.uid}
                </li>
              )) ||
                ""}
              {((currentNode.address ||
                [PlatformType.ethereum, PlatformType.solana].includes(
                  currentNode.platform
                )) && (
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
              <li className="text-large text-bold mb-1">
                {currentNode.identity || ""}
              </li>
              <li>
                <span className="text-gray">Platform: </span>
                {SocialPlatformMapping(currentNode.platform).label || ""}
              </li>
              {currentNode.resolvedAddress && (
                <li>
                  <span className="text-gray">Resolved: </span>
                  {currentNode.resolvedAddress || ""}
                </li>
              )}
              {currentNode.owner && (
                <li>
                  <span className="text-gray">Owner: </span>
                  {currentNode.owner || ""}
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
