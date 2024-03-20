import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, formatText } from "../../utils/utils";
import _ from "lodash";

export const resolveIdentityGraphData = (source) => {
  const nodes = new Array<any>();
  const edges = new Array<any>();

  const findENSOwner = (ens: string) => {
    return source.edges
      .find(
        (i) =>
          i.target === `${PlatformType.ens},${ens}` && i.edgeType === "Hold"
      )
      ?.source?.slice(9);
  };

  const findENSResolvedAddress = (ens: string) => {
    return source.edges
      .find(
        (i) =>
          i.target === `${PlatformType.ens},${ens}` &&
          ["Reverse_Resolve", "Resolve", "Hold"].includes(i.edgeType)
      )
      ?.source?.slice(9);
  };

  source.nodes.forEach((x) => {
    const resolvedPlatform = SocialPlatformMapping(x.platform);
    nodes.push({
      id: x.id,
      label:
        x.platform === PlatformType.ens
          ? formatText(x.id)
          : formatText(x.displayName || x.identity),
      platform: resolvedPlatform.key || x.platform,
      displayName: x.profile?.displayName || x.displayName || x.identity,
      identity: x.profile?.identity || x.identity || x.id,
      uid: x.uid,
      address: x.profile?.address || x.identity,
      isIdentity: x.platform === PlatformType.ens ? false : true,
      owner: x.platform === PlatformType.ens ? findENSOwner(x.identity) : null,
      resolvedAddress:
        x.platform === PlatformType.ens
          ? findENSResolvedAddress(x.identity)
          : null,
    });
  });
  source.edges.forEach((x) => {
    const resolvedPlatform = SocialPlatformMapping(x.dataSource);
    edges.push({
      source: x.source,
      target: x.target,
      label: x.label
        ? x.label
        : resolvedPlatform
        ? resolvedPlatform.label
        : x.dataSource,
      id: `${x.source}*${x.target}`,
    });
  });
  const _nodes = _.uniqBy(nodes, "id");
  const _edges = _.uniqBy(edges, "id");
  const resolvedEdges = _edges.map((x) => ({
    ...x,
    isSingle: isSingleEdge(_edges, x),
  }));
  return { nodes: _nodes, edges: resolvedEdges };
};
export const isSingleEdge = (data, d) => {
  if (
    data.find((x) => d.source === x.target) &&
    data.find((x) => d.target === x.source)
  )
    return false;
  return true;
}
export function calcTranslation(targetDistance, point0, point1) {
  let x1_x0 = point1.x - point0.x,
    y1_y0 = point1.y - point0.y,
    x2_x0,
    y2_y0;
  if (y1_y0 === 0) {
    x2_x0 = 0;
    y2_y0 = targetDistance;
  } else {
    let angle = Math.atan(x1_x0 / y1_y0);
    x2_x0 = -targetDistance * Math.cos(angle);
    y2_y0 = targetDistance * Math.sin(angle);
  }
  return {
    dx: x2_x0,
    dy: y2_y0,
  };
}
