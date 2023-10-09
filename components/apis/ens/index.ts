export const _fetcher = async (url: string, options?) => {
  const res = await fetch(url, options);
  return res.json();
};
