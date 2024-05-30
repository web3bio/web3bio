export const WALLET_LABELS_END_POINT = "https://api-c.walletlabels.xyz";
const apiKey = process.env.NEXT_PUBLIC_WALLET_LABELS_API_KEY;
export const walletLabelsFetcher = async (url) => {
  console.time("WalletLabels API call");
  try {
    const res = await fetch(url, {
      headers: {
        ["Content-Type"]: "application/json",
        "x-api-key": apiKey || "",
      },
      next: { revalidate: 86400 },
    });

    console.timeEnd("WalletLabels API call");
    if (res.status != 200) return [];
    return (await res.json())?.data;
  } catch (e) {
    return [];
  }
};
