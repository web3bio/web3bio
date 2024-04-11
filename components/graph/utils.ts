import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, formatText } from "../../utils/utils";
import _ from "lodash";

export const resolveIdentityGraphData = (source) => {
  const nodes = new Array<any>();
  const edges = new Array<any>();

  const generateVerticesStruct = (x) => {
    const resolvedPlatform = SocialPlatformMapping(x.platform);
    const ownerAddress = x.ownerAddress?.[0].address;
    const resolvedAddress =
      x.platform === PlatformType.ethereum
        ? x.identity
        : x.resolveAddress?.[0].address;
    return {
      id: x.id,
      label:
        [PlatformType.ens, PlatformType.sns].includes(x.platform)
          ? formatText(x.id)
          : formatText(x.displayName || x.identity),
      platform: resolvedPlatform.key || x.platform,
      displayName: x.profile?.displayName || x.displayName || x.identity,
      identity: x.profile?.identity || x.identity,
      uid: x.uid,
      uuid: x.uuid,
      address: x.profile?.address || resolvedAddress,
      isIdentity: [PlatformType.ens, PlatformType.sns].includes(x.platform)
        ? false
        : true,
      owner: ownerAddress,
      resolvedAddress: resolvedAddress,
    };
  };

  const generateNFTENSStruct = (ens, owner) => {
    return {
      id: `${PlatformType.ens},${ens.id}`,
      label: ens.id,
      platform: PlatformType.ens,
      displayName: ens.id,
      identity: ens.id,
      uuid: ens.uuid,
      isIdentity: false,
      owner,
      resolvedAddress: null,
    };
  };
  source.nodes.forEach((x) => {
    nodes.push(generateVerticesStruct(x));
    if (x.nft?.length > 0) {
      x.nft.forEach((i) => {
        if (!source.nodes.some((j) => j.identity === i.id)) {
          nodes.push(generateNFTENSStruct(i, x.identity));
          const source = `${PlatformType.ethereum},${x.identity}`;
          const target = `${PlatformType.ens},${i.id}`;
          edges.push({
            source,
            target,
            label: "",
            id: `${source}*${target}`,
          });
        }
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
