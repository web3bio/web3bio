export const useNodes = (rawData) => {
  return rawData.reduce((pre, cur) => {
    pre.push({
      id: cur.identity.uuid,
      ...cur.identity,
      type: cur.sources ?? [],
    });
    return pre;
  }, []);
};
