import { queryClient } from "../../components/utils/test-utils";


describe("Test For Solana NS API", () => {
  it("It should response 200 for bonfida.sol", async () => {
    const res = await queryClient("/ns/solana/bonfida.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA");
    expect(json.platform).toBe("sns");
  });
  it("It should response 200 for 2E3k7otC558kJJsK8wV8oehXf2VxPRQA3LtyW2mvF6w5", async () => {
    const res = await queryClient("/ns/solana/2E3k7otC558kJJsK8wV8oehXf2VxPRQA3LtyW2mvF6w5");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.platform).toBe("solana");
  });
});
