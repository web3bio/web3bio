export const GUILD_XYZ_ENDPOINT = "https://api.guild.xyz/v2";
export const GuildFetcher = async (url) => {
  console.time("Guild API call");
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
      },
      next: { revalidate: 86400 },
    });
    console.timeEnd("Guild API call");
    if (res.status != 200) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};
