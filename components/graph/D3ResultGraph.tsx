import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatText, SocialPlatformMapping } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";
import _ from "lodash";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";

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

const IdentityNodeSize = 50;
const NFTNodeSize = 15;

export default function D3ResultGraph(props) {
  const { data, onClose, title } = props;
  const [loading, setLoading] = useState(true);
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

      // Create a simulation with several forces.
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "charge",
          d3
            .forceManyBody()
            .strength((d) => (d.isIdentity ? -100 : -50))
            .distanceMax([2000])
        )
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance((d) => (d.isIdentity ? 300 : 100))
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

      const svg = d3
        .select(".svg-canvas")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      // Add a line for each link, and a circle for each node.
      const link = svg
        .append("g")
        .attr("stroke-opacity", 0.3)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke", (d) => SocialPlatformMapping(d.label)?.color || "#999")
        .attr("stroke-width", 1.5);
      // nodeContainer

      const nodeContainer = svg
        .append("g")
        .attr("stroke-width", 2)
        .selectAll(".node")
        .data(nodes, (d) => d.id)
        .attr("class", "node")
        .join("g");

      const circle = nodeContainer
        .append("circle")
        .attr("r", (d) => (d.isIdentity ? IdentityNodeSize : NFTNodeSize))
        .attr("stroke", (d) => SocialPlatformMapping(d.platform).color)
        .attr("class", "circle")
        .attr("fill", (d) =>
          d.isIdentity ? "#fff" : SocialPlatformMapping(PlatformType.ens).color
        );

      const identityBadge = nodeContainer
        .append("circle")
        .attr("class", "identity-badge")
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

      nodeContainer.call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
      // Set the position attributes of links and nodes each time the simulation ticks.
      function ticked() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

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

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
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
          }}
        >
          <svg className="svg-canvas" />
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
