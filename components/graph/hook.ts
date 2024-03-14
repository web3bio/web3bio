import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, formatText } from "../../utils/utils";

export const resolveIdentityGraphData = (source) => {
  const nodes = new Array<any>();
  const edges = new Array<any>();
  source.nodes.forEach((x) => {
    const resolvedPlatform = SocialPlatformMapping(x.platform);
    nodes.push({
      id: x.id,
      label: formatText(x.displayName || x.identity),
      platform: resolvedPlatform.key || x.platform,
      displayName: x.profile?.displayName || x.displayName,
      identity: x.profile?.identity || x.identity,
      uid: x.uid,
      address: x.profile?.address || x.ownedBy?.identity,
      isIdentity: x.platform === PlatformType.ens ? false : true,
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
