export const useNodes = (rawData) => {
  return rawData.reduce((pre, cur, curIdx) => {
    pre.push({
      id: cur.identity.uuid,
      ...cur.identity,
      type: cur.sources ?? [],
      size: curIdx === 0 ? 30 : 15,
    });
    return pre;
  }, []);
};
