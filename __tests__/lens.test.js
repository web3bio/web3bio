import { queryClient } from "../components/utils/test-utils";

describe("Test For Lens Profile API", () => {
  it("It should response 200 for sujiyan.lens", async () => {
    const res = await queryClient("/profile/lens/sujiyan.lens");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.lens.handle).toBe("sujiyan");
    expect(json.address).toBe("0x934b510d4c9103e6a87aef13b816fb080286d649");
  }, 200000);
  it("It should response 200 for stani.lens", async () => {
    const res = await queryClient("/profile/lens/stani.lens");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.links.lens.handle).toBe("stani");
    expect(json.displayName).toBe('Stani')
    expect(json.address).toBe("0x7241dddec3a6af367882eaf9651b87e1c7549dff");
  });
  it("It should response 200 for 0x934b510d4c9103e6a87aef13b816fb080286d649", async () => {
    const res = await queryClient(
      "/profile/lens/0x934b510d4c9103e6a87aef13b816fb080286d649"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("sujiyan.lens");
    expect(json.links.lens.handle).toBe("sujiyan");
  });
  it("It should response 404 for 0xxxxxxxxxx", async () => {
    const res = await queryClient("/profile/lens/0xxxxxxxxxx");
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Invalid Identity or Domain");
  });
  it("It should response 404 for 0xc0074d4F69F4281d7a8EB4D266348BA9F7599E0A", async () => {
    const res = await queryClient(
      "/profile/lens/0xc0074d4F69F4281d7a8EB4D266348BA9F7599E0A"
    );
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Not Found");
  });
  it("It should response 404 for sujiyan.eth", async () => {
    const res = await queryClient("/profile/lens/sujiyan.eth");
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Invalid Identity or Domain");
  });
});
