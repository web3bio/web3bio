import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatText, SocialPlatformMapping } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";
import _ from "lodash";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";

const IdentityNodeSize = 55;
const NFTNodeSize = 15;

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

export default function D3ResultGraph(props) {
  const { data, onClose, title } = props;
  const [loading, setLoading] = useState(true);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const tooltipContainer = useRef(null);
  const graphContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart = null;
    const chartContainer = graphContainer?.current;
    const generateGraph = (_data) => {
      const width = chartContainer?.offsetWidth || 960;
      const height = chartContainer?.offsetHeight || 480;
      const links = _data.links.map((d) => ({ ...d }));
      const nodes = _data.nodes.map((d) => ({ ...d }));
      // const zoom = d3.zoom().on("zoom", (e) => {
      //   d3.select(".svg-canvas").attr("transform", e.transform);
      // });
      const svg = d3
        .select(".svg-canvas")
        .attr("width", "100%")
        .attr("height", "100%");
      // .call(zoom);

      // Per-type markers, as they don't inherit styles.
      svg
        .append("defs")
        .selectAll("marker")
        .data(Array.from(new Set(links.map((d) => d.label))))
        .join("marker")
        .attr("id", (d) => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", (d) => (d ? 72 : 25))
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", (d) => (d ? SocialPlatformMapping(d).color : "#cecece"))
        .attr("d", "M0,-5L10,0L0,5");

      const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.3)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", (d) => SocialPlatformMapping(d.label)?.color || "#999")
        .attr("marker-end", (d) => {
          console.log(d);
          return `url(#arrow-${d.label})`;
        });

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "charge",
          d3
            .forceManyBody()
            .strength((d) => (d.isIdentity ? -350 : -150))
            .distanceMax([200])
        )
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance((d) => (d.isIdentity ? 300 : 100))
        )
        .force(
          "collision",
          d3
            .forceCollide()
            .radius((d) =>
              d.isIdentity ? IdentityNodeSize * 1.2 : NFTNodeSize * 2
            )
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

      // nodeContainer
      const nodeContainer = svg
        .append("g")
        .attr("class", "node")
        .attr("stroke-width", 2)
        .selectAll(".node")
        .data(nodes, (d) => d.id)
        .join("g")
        .call(d3.drag().on("start", dragstarted).on("drag", dragged));

      const circle = nodeContainer
        .append("circle")
        .attr("r", (d) => (d.isIdentity ? IdentityNodeSize : NFTNodeSize))
        .attr("stroke", (d) => SocialPlatformMapping(d.platform).color)
        .attr("fill", (d) =>
          d.isIdentity ? "#fff" : SocialPlatformMapping(PlatformType.ens).color
        )
        .on("click", (e, i) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentNode(i);
          // link
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

      const identityBadge = nodeContainer
        .append("circle")
        .attr("r", 16)
        .attr("fill", (d) => SocialPlatformMapping(d.platform).color)
        .attr("style", (d) => `display:${d.isIdentity ? "normal" : "none"}`);

      const identityIcon = nodeContainer
        .append("svg:image")
        .attr("width", 20)
        .attr("height", 20)
        .attr("xlink:href", (d) => SocialPlatformMapping(d.platform).icon)
        .attr("style", (d) => `display:${d.isIdentity ? "normal" : "none"}`);

      const ensBadge = nodeContainer
        .append("svg:image")
        .attr("width", 20)
        .attr("height", 24)
        .attr("class", "ens-icon")
        .attr("xlink:href", SocialPlatformMapping(PlatformType.ens).icon)
        .attr("style", (d) => `display:${d.isIdentity ? "none" : "normal"}`);

      const displayName = nodeContainer
        .append("text")
        .style("font-size", 14)
        .style("font-weight", 400)
        .text((d) => formatText(d.displayName || d.identity));

      const identity = nodeContainer
        .append("text")
        .style("display", (d) => (d.isIdentity ? "normal" : "none"))
        .style("font-size", 12)
        .style("font-weight", 300)
        .text((d) =>
          d.displayName !== d.identity && d.displayName !== ""
            ? formatText(d.identity)
            : ""
        );

      function ticked() {
        link.attr(
          "d",
          (d) =>
            `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
        );
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
          .attr("x", (d) => d.x - 10)
          .attr("y", (d) => d.y - 12);
      }

      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      return svg.node();
    };
    if (!chart && chartContainer) {
      const res = resolveGraphData(data);
      chart = generateGraph({ nodes: res.nodes, links: res.edges });
      setLoading(false);
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
            setCurrentNode(null);
          }}
        >
          <svg className="svg-canvas" />

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
          {loading && (
            <div className="loading-mask">
              <Loading />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
