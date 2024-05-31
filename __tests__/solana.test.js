import { queryClient } from "../components/utils/queries";

describe("Test For Solana Profile API", () => {
  it("It should response 200 for sujiyan.sol", async () => {
    const res = await queryClient("/profile/solana/sujiyan.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("2E3k7otC558kJJsK8wV8oehXf2VxPRQA3LtyW2mvF6w5");
    expect(json.platform).toBe("sns");
  });
  it("It should response 200 for 46YaTaa8Xa1xFEVDxPa4CVJpzsNADocgixS51HLNCS4Y", async () => {
    const res = await queryClient("/profile/solana/46YaTaa8Xa1xFEVDxPa4CVJpzsNADocgixS51HLNCS4Y");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("46YaTaa8Xa1xFEVDxPa4CVJpzsNADocgixS51HLNCS4Y");
    expect(json.platform).toBe("sns");
  });

});
