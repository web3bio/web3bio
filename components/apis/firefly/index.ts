export const FIREFLY_ENDPOINT_DEV = "https://api-dev.firefly.land";

export const FireflyFetcher = async ([url, body]) => {
  console.time("Firefly API call");
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      next: { revalidate: 86400 },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.status.toString().startsWith("20")) return [];
    console.timeEnd("Firefly API call");
    return res.json();
  } catch (e) {
    return [];
  }
};
