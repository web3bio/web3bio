import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatText, SocialPlatformMapping } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";
import _ from "lodash";
import SVG from "react-inlinesvg";

const IdentityNodeSize = 48;
const NFTNodeSize = 14;

const resolveGraphData = (source) => {
  const nodes = new Array<any>();
  const edges = new Array<any>();
  source.forEach((x) => {
    const from = x.from;
    const to = x.to;
    const resolvedPlatform = SocialPlatformMapping(x.source);
    nodes.push({
      id: to.uuid,
      label: formatText(to.displayName ?? to.identity),
      platform: to.platform,
      source: x.source,
      displayName: to.profile?.displayName || to.displayName,
      identity: to.profile?.identity || to.identity,
      uid: to.uid,
      address: to.profile?.address || to.ownedBy?.identity,
      isIdentity: true,
    });
    nodes.push({
      id: from.uuid,
      label: formatText(from.displayName ?? from.identity),
      platform: from.platform,
      source: x.source,
      displayName: from.profile?.displayName || from.displayName,
      identity: from.profile?.identity || from.identity,
      uid: from.uid,
      address: from.profile?.address || from.ownedBy?.identity,
      isIdentity: true,
    });
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: resolvedPlatform ? resolvedPlatform.key : x.source,
      id: `${from.uuid}-${to.uuid}`,
      isIdentity: true,
    });
    from.nft.forEach((k) => {
      if (k.category === PlatformType.ens) {
        nodes.push({
          id: k.uuid,
          label: formatText(k.id, 15),
          category: k.category,
          chain: k.chain,
          holder: from.identity,
          identity: k.id,
          platform: PlatformType.ens,
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
      if (k.category === PlatformType.ens) {
        nodes.push({
          id: k.uuid,
          label: formatText(k.id, 15),
          category: k.category,
          chain: k.chain,
          holder: to.identity,
          identity: k.id,
          platform: PlatformType.ens,
          isTransferred: true,
        });
        edges.push({
          source: to.uuid,
          target: k.uuid,
          // label: "hold",
          id: `${to.uuid}-${k.uuid}`,
          isTransferred: true,
        });
      }
    });
  });
  const _nodes = _.uniqBy(nodes, "id");
  const _edges = _.uniqBy(edges, "id");
  return { nodes: _nodes, edges: _edges };
};

function calcTranslationExact(targetDistance, point0, point1) {
  var x1_x0 = point1.x - point0.x,
    y1_y0 = point1.y - point0.y,
    x2_x0,
    y2_y0;
  if (y1_y0 === 0) {
    x2_x0 = 0;
    y2_y0 = targetDistance;
  } else {
    var angle = Math.atan(x1_x0 / y1_y0);
    x2_x0 = -targetDistance * Math.cos(angle);
    y2_y0 = targetDistance * Math.sin(angle);
  }
  return {
    dx: x2_x0,
    dy: y2_y0,
  };
}

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
    .attr("xlink:href", (d) => SocialPlatformMapping(d.platform).icon)
    .attr("style", (d) => `display:${d.isIdentity ? "normal" : "none"}`);

  const ensBadge = nodeContainer
    .append("svg:image")
    .attr("class", "ens-icon")
    .attr("xlink:href", SocialPlatformMapping(PlatformType.ens).icon)
    .attr("style", (d) => `display:${d.isIdentity ? "none" : "normal"}`);

  const displayName = nodeContainer
    .append("text")
    .attr("class", "displayName")
    .text((d) => formatText(d.displayName || d.identity));

  const identity = nodeContainer
    .append("text")
    .attr("class", "identity")
    .style("display", (d) => (d.isIdentity ? "normal" : "none"))
    .text((d) =>
      d.displayName !== d.identity && d.displayName !== ""
        ? formatText(d.identity)
        : ""
    );
  return {
    identityBadge,
    identityIcon,
    ensBadge,
    displayName,
    identity,
  };
};

export default function D3ResultGraph(props) {
  const { data, onClose, title } = props;
  const [currentNode, setCurrentNode] = useState<any>(null);
  const tooltipContainer = useRef(null);
  const graphContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart = null;
    const chartContainer = graphContainer?.current;
    const generateGraph = (_data) => {
      const width = chartContainer?.offsetWidth!;
      const height = chartContainer?.offsetHeight!;
      const links = _data.links.map((d) => ({ ...d }));
      const nodes = _data.nodes.map((d) => ({ ...d }));

      const svg = d3
        .select(".svg-canvas")
        .attr("width", "100%")
        .attr("height", "100%");

      const generateSimulation = () => {
        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink(links)
              .id((d) => d.id)
              .distance((d) => (d.target.isIdentity ? 70 : 10))
          )
          .force("charge", d3.forceManyBody())
          .force("x", d3.forceX(width / 2).strength(0.25))
          .force("y", d3.forceY(height / 2).strength(1))
          .force(
            "collision",
            d3
              .forceCollide()
              .radius((d) =>
                d.isIdentity ? IdentityNodeSize * 2.5 : NFTNodeSize * 2
              )
          )
          .force("center", d3.forceCenter(width / 2, height / 2))
          .stop();

        return simulation;
      };

      const simulation = generateSimulation();
      const marker = svg
        .append("defs")
        .selectAll("marker")
        .data(Array.from(new Set(links.map((d) => d.label))))
        .join("marker")
        .attr("id", (d) => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", (d) => (d ? 60 : 20))
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#cecece")
        .attr("d", "M0,-5L10,0L0,5");

      const edgePath = svg
        .selectAll(".edge-path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "edge-path")
        .attr("id", (d, i) => "edgepath" + i)
        .attr("stoke-width", 1.5)
        .attr("stroke", (d) => "#cecece")
        .style("pointer-events", "none")
        .attr("marker-end", (d) => `url(#arrow-${d.label})`);

      const edgeLabels = svg
        .selectAll(".edge-label")
        .data(links)
        .enter()
        .append("text")
        .style("pointer-events", "none")
        .attr("class", "edge-label")
        .attr("fill", (d) => "#cecece");

      edgeLabels
        .append("textPath")
        .attr("xlink:href", (d, i) => "#edgepath" + i)
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text((d) => (d.label ? SocialPlatformMapping(d.label).label : ""));

      const dragged = (event, d) => {
        function clamp(x, lo, hi) {
          return x < lo ? lo : x > hi ? hi : x;
        }
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
        .call(d3.drag().on("drag", dragged));

      const circle = nodeContainer
        .append("circle")
        .attr("class", "node")
        .attr("stroke-width", 2)
        .attr("r", (d) => (d.isIdentity ? IdentityNodeSize : NFTNodeSize))
        .attr("stroke", (d) => SocialPlatformMapping(d.platform).color)
        .attr("fill", (d) =>
          d.isIdentity ? "#fff" : SocialPlatformMapping(PlatformType.ens).color
        )
        .on("click", (e, i) => {
          e.preventDefault();
          e.stopPropagation();
          if (!i.isIdentity) {
            setCurrentNode(null);
            return;
          }
          setCurrentNode(i);
          // edgePath
          //   .attr("stroke-width", 1.5)
          //   .filter((l) => l.source.id === i.id || l.target.id === i.id)
          //   .attr("stroke-width", 3);
          circle
            .attr("fill", (d) =>
              d.isIdentity
                ? "#fff"
                : SocialPlatformMapping(PlatformType.ens).color
            )
            .filter((l) => l.id === i.id)
            .attr("fill-opacity", 0.1)
            .attr("fill", SocialPlatformMapping(i.platform).color || "#fff");
        });

      const { displayName, identity, identityBadge, identityIcon, ensBadge } =
        updateNodes(nodeContainer);
      const ticked = () => {
        edgePath.attr("d", (d) => {
          const dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
          const delta = calcTranslationExact(4, d.source, d.target);
          const rightwardSign = d.target.x > d.source.x ? 2 : -2;
          return (
            "M" +
            (d.source.x + rightwardSign * delta.dx) +
            "," +
            (d.source.y + -rightwardSign * delta.dy) +
            "L" +
            (d.target.x + rightwardSign * delta.dx) +
            "," +
            (d.target.y + -rightwardSign * delta.dy)
          );
        });

        circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        displayName
          .attr("dx", (d) => d.x)
          .attr("dy", (d) => (d.isIdentity ? d.y : d.y + NFTNodeSize * 2))
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

        ensBadge
          // offset half the icon size
          .attr("x", (d) => d.x - 9)
          .attr("y", (d) => d.y - 10);
      };
      d3.timeout(() => {
        for (
          var i = 0,
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
      const res = resolveGraphData(data);
      chart = generateGraph({ nodes: res.nodes, links: res.edges });
    }
    return () => {
      const svg = d3.select(".svg-canvas");
      svg.selectAll("*").remove();
    };
  }, [data?.length]);
  return (
    <div
      className="identity-graph-modal"
      ref={tooltipContainer}
      onClick={onClose}
    >
      {data && (
        <div
          className="graph-container"
          ref={graphContainer}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <svg
            onClick={() => {
              setCurrentNode(null);
            }}
            className="svg-canvas"
          />

          {currentNode && (
            <div
              className="web3bio-tooltip"
              style={{
                top: currentNode.y,
                left: currentNode.x,
              }}
            >
              {currentNode.isIdentity ? (
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
                  {(currentNode.address && (
                    <li>
                      <span className="text-gray">Address: </span>
                      {currentNode.address}
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
                    {currentNode.platform || ""}
                  </li>
                  <li>
                    <span className="text-gray">Owner: </span>
                    {currentNode.holder || ""}
                  </li>
                </ul>
              )}
            </div>
          )}
          <div className="graph-header">
            <div className="graph-title">
              <SVG src={"/icons/icon-view.svg"} width="20" height="20" />
              <span className="ml-2">
                Identity Graph for<strong className="ml-1">{title}</strong>
              </span>
            </div>
            <div className="btn btn-close" onClick={onClose}>
              <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
