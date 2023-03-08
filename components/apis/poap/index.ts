import axios from "axios";
const AUTHENTICATION = process.env.NEXT_PUBLIC_POAP_API_KEY;
export const POAP_END_POINT = "https://api.poap.tech/actions/scan/";
export const POAPFetcher = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: {
        "x-api-key": AUTHENTICATION,
        accept: "application/json",
      },
    });
    console.log(res,'res')
    return res.data;
  } catch (e) {
    console.log(e, "error");
    return [];
  }
};
