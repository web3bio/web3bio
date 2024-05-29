import { queryClient } from "../components/utils/test-utils";

describe("Test For ENS Profile API", () => {
  it("It should response 200 for brantly.eth", async () => {
    const res = await queryClient("/profile/ens/brantly.eth");
    const json = await res.json();
    expect(json.address).toBeTruthy();
    expect(json.links.twitter.handle).toBe("brantlymillegan");
    expect(json.links.twitter.link).toBe("https://twitter.com/brantlymillegan");
    expect(json.links.discord.link).toBe("");
    expect(json.links.discord.handle).toBeTruthy();
    expect(res.status).toBe(200);
  });
  it("It should response 404 for mcdonalds.eth", async () => {
    const res = await queryClient("/profile/ens/mcdonalds.eth");
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Invalid Resolved Address");
  });
  it("It should response 200 for dr3a.eth", async () => {
    const res = await queryClient("/profile/ens/dr3a.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.hey).toBeTruthy();
    expect(json.links.farcaster).toBeTruthy();
  });
  it("It should response 404 for xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.eth", async () => {
    const res = await queryClient(
      "/profile/ens/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.eth"
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.address).toBe(null);
    expect(json.error).toBe("Invalid Resolved Address");
  });
  it("It should response 404 for solperdev.eth", async () => {
    const res = await queryClient("/profile/ens/solperdev.eth");
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Invalid Resolved Address");
  });
  it("It should response 200 for sujiyan.eth", async () => {
    const res = await queryClient("/profile/ens/sujiyan.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.website.handle).toBe("mask.io");
    expect(json.contenthash.startsWith("ipns")).toBeTruthy();
  });
  it("It should response 200 for vitalik.eth", async () => {
    const res = await queryClient("/profile/ens/vitalik.eth");
    expect(res.status).toBe(200);
  });
  it("It should response 200 for ricmoo.eth", async () => {
    const res = await queryClient("/profile/ens/ricmoo.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.github.handle).toBe("ricmoo");
  });
  it("It should response 200 for tartu.eth", async () => {
    const res = await queryClient("/profile/ens/tartu.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("0x161ea288055b58fb182f72b124a5d0f367b099e4");
  });
  it("It should response 404 for 0xcee81f7dd39d817f699a5c9eb93e3e6520f5b996", async () => {
    const res = await queryClient(
      "/profile/ens/0xcee81f7dd39d817f699a5c9eb93e3e6520f5b996"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("0xcee81f7dd39d817f699a5c9eb93e3e6520f5b996");
  });
  it("It should response 200 for 0x934b510d4c9103e6a87aef13b816fb080286d649", async () => {
    const res = await queryClient(
      "/profile/ens/0x934b510d4c9103e6a87aef13b816fb080286d649"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("sujiyan.eth");
  });
  it("It should response 404 for 0x000000000000000000000000000000000000dEaD", async () => {
    const res = await queryClient(
      "/profile/ens/0x000000000000000000000000000000000000dEaD"
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Invalid Identity or Domain");
  });
  it("It should response 404 for sujiyan.lens", async () => {
    const res = await queryClient("/profile/ens/sujiyan.lens");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Invalid Identity or Domain");
  });
  it("It should response 404 for gothgorl.eth", async () => {
    const res = await queryClient("/profile/ens/gothgorl.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.website.handle).toBe("linktr.ee/starcaster12");
  });
  it("It should response 200 for offchainexample.eth", async () => {
    const res = await queryClient("/profile/ens/offchainexample.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    expect(json.email).toBeTruthy();
  });
});
