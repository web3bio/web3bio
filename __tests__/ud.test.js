import { queryClient } from "../components/utils/utils";

describe("Test For Unstoppable Domains Profile API", () => {
  it("It should response 200 for nykma.blockchain", async () => {
    const res = await queryClient("/profile/unstoppabledomains/nykma.blockchain");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.twitter.handle).toBe("bgm38");
    expect(json.address).toBe("0x0da0ee86269797618032e56a69b1aad095c581fc");
  });
  it("It should response 200 for sandy.x", async () => {
    const res = await queryClient("/profile/unstoppabledomains/sandy.nft");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.youtube.handle).toBe("@sandycarter3993");
  });
  it("It should response 200 for al.x", async () => {
    const res = await queryClient("/profile/unstoppabledomains/al.x");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("0x2ccff304ef578b238ee82e1d1d53c34e80b48ad6");
    expect(json.contenthash).toBeTruthy();
  });
  it("It should response 200 for sujiyan.eth", async () => {
    const res = await queryClient("/profile/unstoppabledomains/sujiyan.eth");
    expect(res.status).toBe(200);
  });
  it("It should response 200 for 2024.hi", async () => {
    const res = await queryClient("/profile/unstoppabledomains/2024.hi");
    expect(res.status).toBe(200);
  });
});
