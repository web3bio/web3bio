import { queryClient } from "../../components/utils/utils";


describe("Test For Farcaster NS API", () => {
  it("It should response 200 for suji", async () => {
    const res = await queryClient("/ns/farcaster/suji");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("suji");
  });
  it("It should response 200 for 0x934b510d4c9103e6a87aef13b816fb080286d649", async () => {
    const res = await queryClient(
      "/ns/farcaster/0x934b510d4c9103e6a87aef13b816fb080286d649"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("suji");
    expect(json.address).toBe("0x934b510d4c9103e6a87aef13b816fb080286d649");
  });

  it("It should response 404 for dwr", async () => {
    const res = await queryClient("/ns/farcaster/dwr");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.displayName).toBe("Dan Romero");
    expect(json.address).toBeTruthy();
  });
  it("It should response 200 for dwr.eth", async () => {
    const res = await queryClient("/ns/farcaster/dwr.eth");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBeTruthy();
  });
  it("It should response 200 for fid:3", async () => {
    const res = await queryClient("/ns/farcaster/fid:3");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("dwr.eth");
    expect(json.address).toBeTruthy();
  });
});
