import { queryClient } from "../components/utils/utils";

describe("Test For Avatar Service API", () => {
  it("It should response 200 for vitalik.eth", async () => {
    const res = await queryClient("/avatar/vitalik.eth");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.startsWith("https"));
  });
  it("It should response 200 for bonfida.sol", async () => {
    const res = await queryClient("/avatar/bonfida.sol");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.startsWith("<svg"));
  });
  it("It should response 200 for xxxxx.xxxxx", async () => {
    const res = await queryClient("/avatar/xxxxx.xxxxx");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.startsWith("<svg"));
  });
  it("It should response 200 for 46YaTaa8Xa1xFEVDxPa4CVJpzsNADocgixS51HLNCS4Y", async () => {
    const res = await queryClient(
      "/avatar/46YaTaa8Xa1xFEVDxPa4CVJpzsNADocgixS51HLNCS4Y"
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.startsWith("https"));
  });
  it("It should response 200 for suji.eth", async () => {
    const res = await queryClient(
      "/avatar/suji.eth"
    );
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.startsWith("<svg"));
  });
});
