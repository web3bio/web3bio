export const ArticlesFetcher = async (url) => {
  console.time("Articles API call");
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (res.status != 200) return [];
    console.timeEnd("Articles API call");
    return res.json();
  } catch (e) {
    return [];
  }
};
