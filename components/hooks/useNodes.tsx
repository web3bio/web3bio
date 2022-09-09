export const useNodes = (rawData) => {
  return rawData.reduce((pre, cur, curIdx) => {
    pre.push({
      id: cur.identity.uuid,
      label: cur.identity.displayName,
      type: cur.sources ? cur.sources[0] : "unkown",
      // ...cur.identity,
      // type: cur.sources ?? [],
      // size: curIdx === 0 ? 30 : 15,
    });
    if (cur.identity.nft) {
      cur.identity.nft.forEach((x) => {
        pre.push({
          id: x.uuid,
          label: x.id,
          cluster: curIdx + 1,
          type: x.category,
          chain: x.chain,
        });
      });
    }
    return pre;
  }, []);
};
