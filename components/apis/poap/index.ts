const AUTHENTICATION = process.env.NEXT_PUBLIC_POAP_API_KEY;
export const POAP_END_POINT =
  "https://api.poap.tech/actions/scan/";
export const POAPFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      "x-api-key":
        "vrqPYmHPuIhgdO45vvS8uqlcfgWE7aFoMw1Vkw3b88fxMkGOFEvEoKAZTdbhRLqNri2Crw0XhMsuhow04n9T7dTAABkfNy3OHtWzBAGVZIJTl9AxrNXJ9QAd1AeZQs2i",
      accept: "application/json",
    },
  });
  console.log(res, "response");
  return res.json();
};
