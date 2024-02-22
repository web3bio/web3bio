import _ from "lodash";
const enum SocialActionType {
  // todo: expand action type
  follow = 1,
  followedBy = 2,
  followedEach = 3,
  transferOut = 5,
  transferIn = 6,
}

const SocialActionEdgeLabelMap = {
  [SocialActionType.follow]: "Followed",
  [SocialActionType.followedBy]: "Followed by",
  [SocialActionType.followedEach]: "Followed Each",
  [SocialActionType.transferOut]: "Transfer out to",
  [SocialActionType.transferIn]: "Get transfer in",
};

export const useInitialPackingSocialGraphData = (data) => {
  const nodes = new Array();
  const edges = new Array();
  if (!data) return { nodes: [], edges: [] };
  data.socialFollows.followerTopology.forEach((x) => {
    if (
      !nodes.some(
        (i) => i.platform === x.dataSource && i.id === x.originalTarget.id
      )
    ) {
      nodes.push({
        ...x.originalTarget,
        graphId: x.target,
        children: [],
      });
    }
    const parent = nodes.find((i) => i.id === x.originalTarget.id);

    if (parent) {
      parent.children.push({
        ...x.originalSource,
        graphId: x.source,
        type: SocialActionType.followedBy,
      });
    }
  });

  data.socialFollows.followingTopology.forEach((x) => {
    if (
      !nodes.some(
        (i) => i.platform === x.dataSource && i.id === x.originalSource.id
      )
    ) {
      nodes.push({
        ...x.originalSource,
        graphId: x.source,
        children: [],
      });
    }
    const parent = nodes.find((i) => i.id === x.originalSource.id);

    if (parent) {
      parent.children.push({
        ...x.originalTarget,
        graphId: x.target,
        type: SocialActionType.follow,
      });
    }
  });

  const _nodes = nodes.reduce((pre, cur) => {
    if (cur.children?.length) {
      pre.push({
        id: cur.id + ",social",
        displayName: `items:${cur.children.length}`,
        platform: cur.platform,
        amount: cur.children.length,
        parent: cur.id,
        cluster: true,
      });
    }
    pre.push(cur);
    return pre;
  }, []);
  _nodes.forEach((x) => {
    if (x.children) {
      edges.push({
        source: x.id,
        target: _nodes.find((i) => i.platform === x.platform)?.id,
        platform: x.platform,
        label: x.platform,
        id: `${x.id}*${_nodes.find((i) => i.platform === x.platform)?.id}`,
      });
    }
  });
  return {
    nodes: _nodes,
    edges,
  };
};

export const useIdentitySocialGraphData = (data) => {
  if (!data) return { nodes: [], edges: [] };
  return {
    nodes: data.queryIdentityGraph?.[0]?.vertices || [],
    edges: data.queryIdentityGraph?.[0]?.edges || [],
  };
};

const isSingleEdge = (data, d) => {
  if (
    data.find((x) => d.source === x.target) &&
    data.find((x) => d.target === x.source)
  )
    return false;
  return true;
};

export const usePlatformSocialGraphData = (data) => {
  if (!data || !data.children?.length) return { nodes: [], edges: [] };
  const _data = JSON.parse(JSON.stringify(data));
  const _nodes = [..._.uniqBy(_data.children, (i) => i.id).map((x) => x)];
  const _edges = [
    ...data.children.map((x) => ({
      source: x.type === SocialActionType.follow ? x.id : data.id,
      target: x.type === SocialActionType.follow ? data.id : x.id,
      type: x.type,
      label: SocialActionEdgeLabelMap[x.type],
      id: `${x.id}*${data.id}`,
    })),
  ];
  delete _data.children;
  _nodes.push(data);
  const resolvedEdges = _edges.map((d) => ({
    ...d,
    isSingle: isSingleEdge(_edges, d),
    label: isSingleEdge(_edges, d)
      ? d.label
      : SocialActionEdgeLabelMap[SocialActionType.followedEach],
  }));
  return {
    nodes: _nodes,
    edges: resolvedEdges,
  };
};
