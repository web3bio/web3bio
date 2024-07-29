export const TALENT_API_ENDPOINT = "https://api.talentprotocol.com/api/v2/";
const auth = process.env.NEXT_PUBLIC_TALENT_API_KEY || "";
export const talentFetcher = async (url: string) => {
  try {
    console.time("Talent API call");
    const res = await fetch(url, {
      headers: {
        "x-api-key": auth,
      },
    }).then((res) => res.json());
    console.timeEnd("Talent API call");
    return res;
  } catch (e) {
    return null;
  }
};
