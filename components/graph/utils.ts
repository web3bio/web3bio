import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { formatText, isSameAddress } from "../utils/utils";
import _ from "lodash";

const IdentitySizePlatforms = [
  PlatformType.ethereum,
  PlatformType.lens,
  PlatformType.clusters,
  PlatformType.farcaster,
  PlatformType.bitcoin,
  PlatformType.solana,
  PlatformType.crossbell,
];

export const resolveIdentityGraphData = (source) => {
  const nodes = new Array<any>();
  const edges = new Array<any>();

  const generateVerticesStruct = (x) => {
    const ownerAddress = x.ownerAddress?.[0].address;
    const resolvedAddress =
      x.platform === PlatformType.ethereum
        ? x.identity
        : x.resolveAddress?.[0].address;
    return {
      id: x.id,
      label: [PlatformType.ens, PlatformType.sns].includes(x.platform)
        ? formatText(x.id)
        : formatText(x.displayName || x.identity),
      platform: x.platform,
      displayName: x.profile?.displayName || x.displayName || x.identity,
      identity: x.profile?.identity || x.identity,
      uid: x.uid,
      uuid: x.uuid,
      address: x.profile?.address || resolvedAddress,
      isIdentity: IdentitySizePlatforms.includes(x.platform),
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
  source.nodes
    .filter((x) => {
      if (x.platform === PlatformType.ens) {
        return isSameAddress(
          x.ownerAddress?.[0]?.address,
          x.resolveAddress?.[0].address
        );
      } else {
        return true;
      }
    })
    .forEach((x) => {
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

  return {
    nodes: _.sortBy(
      _nodes.map((x) => ({
        ...x,
        group: x.isIdentity
          ? 1
          : [PlatformType.sns, PlatformType.ens].includes(x.platform)
          ? 2
          : 3,
      })),
      "group"
    ),
    edges: _edges,
  };
};
