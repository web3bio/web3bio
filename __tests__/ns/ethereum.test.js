import { queryClient } from "../../components/utils/utils";


describe("Test For Ethereum Profile API", () => {
  it("It should response 200 for sio.eth", async () => {
    const res = await queryClient("/ns/ethereum/luc.eth");
    const json = await res.json();
    expect(json.identity).toBeTruthy();
  });
  it("It should response 200 for planetable.eth", async () => {
    const res = await queryClient("/ns/ethereum/planetable.eth");
    const json = await res.json();
    expect(json.address).toBe("0x18deee9699526f8c8a87004b2e4e55029fb26b9a");
    expect(json.platform).toBe("ens");
  });
  it("It should response 200 for 0x7241DDDec3A6aF367882eAF9651b87E1C7549Dff", async () => {
    const res = await queryClient(
      "/ns/ethereum/0x7241DDDec3A6aF367882eAF9651b87E1C7549Dff"
    );
    const json = await res.json();
    const res2 = await queryClient(
      "/ns/ens/0x7241DDDec3A6aF367882eAF9651b87E1C7549Dff"
    );
    const json2 = await res2.json();
    expect(json.displayName).toBe(json2.displayName);
  });
});
