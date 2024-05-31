import { queryClient } from "../../components/utils/queries";


describe("Test For Lens NS API", () => {
  it("It should response 200 for sujiyan.lens", async () => {
    const res = await queryClient("/ns/lens/sujiyan.lens");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("0x934b510d4c9103e6a87aef13b816fb080286d649");
  });
  it("It should response 200 for stani.lens", async () => {
    const res = await queryClient("/ns/lens/stani.lens");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.displayName).toBe("Stani");
    expect(json.address).toBe("0x7241dddec3a6af367882eaf9651b87e1c7549dff");
  });
  it("It should response 200 for 0x934b510d4c9103e6a87aef13b816fb080286d649", async () => {
    const res = await queryClient(
      "/ns/lens/0x934b510d4c9103e6a87aef13b816fb080286d649"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.identity).toBe("sujiyan.lens");
  });
  it("It should response 404 for 0xxxxxxxxxx", async () => {
    const res = await queryClient("/ns/lens/0xxxxxxxxxx");
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Invalid Identity or Domain");
  });

  it("It should response 404 for sujiyan.eth", async () => {
    const res = await queryClient("/ns/lens/sujiyan.eth");
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("Invalid Identity or Domain");
  });
  it("It should response 200 for sujidaily.lens", async () => {
    const res = await queryClient("/ns/lens/sujidaily.lens");
    expect(res.status).toBe(200);
    expect((await res.json()).avatar).toBeTruthy()
  });
});
