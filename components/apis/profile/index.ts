export const profileFetcher = async (url: string, options?) => {
  try {
    console.time("Profile api call");
    const res = await fetch(url, options).then((res) => res.json());
    console.timeEnd("Profile api call");
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};
