import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, formatText } from "../../utils/utils";
import _ from "lodash";

export const resolveIdentityGraphData = (source) => {
  const nodes = new Array<any>();
  const edges = new Array<any>();
  source.nodes.forEach((x) => {
    const resolvedPlatform = SocialPlatformMapping(x.platform);
    nodes.push({
      id: x.id,
      label:
        x.platform === PlatformType.ens
          ? formatText(x.id)
          : formatText(x.displayName || x.identity),
      platform: resolvedPlatform.key || x.platform,
      displayName: x.profile?.displayName || x.displayName || x.id,
      identity: x.profile?.identity || x.identity || x.id,
      uid: x.uid,
      address: x.profile?.address || x.ownedBy?.identity,
      isIdentity: x.platform === PlatformType.ens ? false : true,
    });
    if (x.nft?.length > 0) {
      x.nft.forEach((i) => {
        edges.push({
          source: x.id,
          target: i.id,
          id: `${x.id}*${i.id}`,
        });
      });
    }
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
};
