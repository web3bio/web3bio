import { queryClient } from "../components/utils/test-utils";

describe("Test For Universal Profile API", () => {
  it("It should response 200 data for 0x028f936e528de34fc95179780751ec21256825ce604950580978a8961c5af03e50", async () => {
    const res = await queryClient(
      "/profile/0x028f936e528de34fc95179780751ec21256825ce604950580978a8961c5af03e50"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBeTruthy();
  });
  it("It should response 200 data for 0x02731b4bd27eb1234049ecb082c4dc1f3640bb93d8d9736c898c69ad385dc66a7e", async () => {
    const res = await queryClient(
      "/profile/0x02731b4bd27eb1234049ecb082c4dc1f3640bb93d8d9736c898c69ad385dc66a7e"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBeTruthy();
  });
  it("It should response 200 data for 0x7cbba07e31dc7b12bb69a1209c5b11a8ac50acf5", async () => {
    const res = await queryClient(
      "/profile/0x7cbba07e31dc7b12bb69a1209c5b11a8ac50acf5"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].address).toBe("0x7cbba07e31dc7b12bb69a1209c5b11a8ac50acf5");
    expect(json[0].displayName).toBe("0x7cbb...acf5");
  });
  it("It should response 200 data for lilgho.lens", async () => {
    const res = await queryClient("/profile/lilgho.lens");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBe("lilgho.lens");
    expect(json[0].avatar).toBeTruthy()
    expect(json[1].avatar).toBeTruthy();
    expect(json.length).toBe(11);
  });
  it("It should response 200 data for 0x7241dddec3a6af367882eaf9651b87e1c7549dff", async () => {
    const res = await queryClient(
      "/profile/0x7241dddec3a6af367882eaf9651b87e1c7549dff"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBe("stani.lens");
  });
  it("It should response 200 data for noun124.eth", async () => {
    const res = await queryClient("/profile/noun124.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBe("noun124.eth");
  });
  it("It should response 200 data for 0x3ddfa8ec3052539b6c9549f12cea2c295cff5296", async () => {
    const res = await queryClient(
      "/profile/0x3ddfa8ec3052539b6c9549f12cea2c295cff5296"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].address).toBe("0x3ddfa8ec3052539b6c9549f12cea2c295cff5296");
    expect(json.length).toBe(1);
  });

  it("It should response 200 for sujiyan.eth", async () => {
    const res = await queryClient("/profile/sujiyan.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(
      json.find((x) => x.platform === "lens")?.address ===
        json.find((x) => x.platform === "ens")?.address
    );
  });
  it("It should response 404 for mcdonalds.eth", async () => {
    const res = await queryClient("/profile/mcdonalds.eth");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Not Found");
  });
  it("It should response 200 data for stani.lens", async () => {
    const res = await queryClient("/profile/stani.lens");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBe("stani.lens");
  });
  it("It should response 200 data for brantly.eth", async () => {
    const res = await queryClient("/profile/brantly.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    const linksOBJ = json.find((x) => x.platform === "ens").links;
    const links = Object.keys(linksOBJ);
    const isValidHandle = (() => {
      for (let i in linksOBJ) {
        if (linksOBJ[i]?.handle.includes("@")) return false;
        return true;
      }
    })();
    expect(links.length).toBe(6);
    expect(isValidHandle).toBe(true);
  });
  it("It should response 200 data for 0xd8da6bf26964af9d7eed9e03e53415d37aa96045", async () => {
    const res = await queryClient(
      "/profile/0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
    );
    expect(res.status).toBe(200);
  });
  it("It should response 200 data for 0x934b510d4c9103e6a87aef13b816fb080286d649", async () => {
    const res = await queryClient(
      "/profile/0x934b510d4c9103e6a87aef13b816fb080286d649"
    );
    expect(res.status).toBe(200);
  });
  it("It should response 200 data for 0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c", async () => {
    const res = await queryClient(
      "/profile/0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.filter((x) => x.platform === "lens").length > 1);
  });
  it("It should response 404 data for jeffx.bit", async () => {
    const res = await queryClient("/profile/jeffx.bit");
    expect(res.status).toBe(404);
  });
  it("It should response 200 data for 0x638b1350920333d23a7a7472c00aa5c38c278b90", async () => {
    const res = await queryClient(
      "/profile/0x638b1350920333d23a7a7472c00aa5c38c278b90"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.find((x) => x.platform === "ens")).toBeTruthy();
  });
  it("It should response 200 data for gamedb.eth", async () => {
    const res = await queryClient("/profile/gamedb.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.find((x) => x.platform === "ens").identity).toBe("gamedb.eth");
  });
  it("It should response 200 data for livid.farcaster", async () => {
    const res = await queryClient("/profile/livid.farcaster");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.find((x) => x.platform === "farcaster").identity).toBe("livid");
  });
  it("It should response 200 data for аррӏе.eth", async () => {
    const res = await queryClient("/profile/аррӏе.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.find((x) => x.platform === "farcaster").identity).toBe(
      "bdl.eth"
    );
    expect(json.length > 1).toBeTruthy();
  });
  it("It should response 404 data for sujiyan.bnb", async () => {
    const res = await queryClient("/profile/sujiyan.bnb");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Invalid Identity or Domain");
  });
  it("It should response 200 data for shoni.eth", async () => {
    const res = await queryClient("/profile/shoni.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].identity).toBe("shoni.eth");
  });
  it("It should response 200 data for ggomagang.eth", async () => {
    const res = await queryClient("/profile/ggomagang.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.find(x=>x.platform === 'farcaster').identity).toBe("undefined");
  });
});
