const AUTHENTICATION =
  process.env.POAP_API_KEY ||
  "vrqPYmHPuIhgdO45vvS8uqlcfgWE7aFoMw1Vkw3b88fxMkGOFEvEoKAZTdbhRLqNri2Crw0XhMsuhow04n9T7dTAABkfNy3OHtWzBAGVZIJTl9AxrNXJ9QAd1AeZQs2i";
export const POAP_END_POINT = "https://api.poap.tech/actions/scan/";
export const POAPFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      "x-api-key": AUTHENTICATION,
      accept: "application/json",
    },
  });
  return res.json();
};
