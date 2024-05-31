import { queryClient } from "../../components/utils/queries";


describe("Test For SNS NS API", () => {
  it("It should response 200 for bonfida.sol", async () => {
    const res = await queryClient("/ns/sns/bonfida.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA");
  });
  it("It should response 200 for sujiyan.sol", async () => {
    const res = await queryClient("/ns/sns/sujiyan.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("2E3k7otC558kJJsK8wV8oehXf2VxPRQA3LtyW2mvF6w5");
  });
  it("It should response 200 for 0xbillys.sol", async () => {
    const res = await queryClient("/ns/sns/0xbillys.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.avatar).toBeTruthy();
  });
  it("It should response 200 for _tesla.sol", async () => {
    const res = await queryClient("/ns/sns/_tesla.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBeTruthy();
  });
  it("It should response 200 for wallet-guide-9.sol", async () => {
    const res = await queryClient("/ns/sns/wallet-guide-9.sol");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.avatar).toBeTruthy();
  });
  it("It should response 200 for 9mUxj781h7UXDFcbesr1YUfVGD2kQZgsUMc5kzpL9g65", async () => {
    const res = await queryClient(
      "/ns/sns/9mUxj781h7UXDFcbesr1YUfVGD2kQZgsUMc5kzpL9g65"
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.platform).toBe("solana");
  });
});
