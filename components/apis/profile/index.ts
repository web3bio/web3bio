export const ProfileFetcher = async (url: string, options?) => {
  try {
    // console.time("Profile API call");
    const res = await fetch(url, options).then((res) => res.json());
    // console.timeEnd("Profile API call");
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};
