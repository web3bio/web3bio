import { queryClient } from "../components/utils/test-utils";

describe("Test For Farcaster Profile API", () => {
  it("It should response 200 for suji", async () => {
    const res = await queryClient("/profile/farcaster/suji");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("suji");
  });
  it("It should response 200 for 0x934b510d4c9103e6a87aef13b816fb080286d649", async () => {
    const res = await queryClient(
      "/profile/farcaster/0x934b510d4c9103e6a87aef13b816fb080286d649"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("suji");
    expect(json.address).toBe("0x934b510d4c9103e6a87aef13b816fb080286d649");
    expect(json.links.farcaster.handle).toBe("suji");
  });
  it("It should response 200 for farcaster", async () => {
    const res = await queryClient("/profile/farcaster/farcaster");
    expect(res.status).toBe(200);
    expect((await res.json()).displayName).toBe("Farcaster");
  });
  it("It should response 404 for 💗", async () => {
    const res = await queryClient("/profile/farcaster/💗");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Invalid Identity or Domain");
  });
  it("It should response 200 for undefined", async () => {
    const res = await queryClient("/profile/farcaster/undefined");
    expect(res.status).toBe(200);
    const json = await res.json();
  });
  it("It should response 200 for dwr", async () => {
    const res = await queryClient("/profile/farcaster/dwr");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.displayName).toBe("Dan Romero");
    expect(json.address).toBeTruthy();
  });
  it("It should response 200 for dwr.eth", async () => {
    const res = await queryClient("/profile/farcaster/dwr.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBeTruthy();
  });
  it("It should response 200 for fid:3", async () => {
    const res = await queryClient("/profile/farcaster/fid:3");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("dwr.eth");
    expect(json.address).toBeTruthy();
  });
});
