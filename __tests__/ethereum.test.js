import { queryClient } from "../components/utils/queries";

describe("Test For Ethereum Profile API", () => {
  it("It should response 200 for sio.eth", async () => {
    const res = await queryClient("/profile/ethereum/sio.eth");
    const json = await res.json();
    const res2 = await queryClient("/profile/ens/sio.eth");
    const json2 = await res2.json();
    expect(json.address).toBe(json2.address);
  });
  it("It should response 200 for 0xf4844a06d4f995c4c03195afcb5aa59dcbb5b4fc", async () => {
    const res = await queryClient(
      "/profile/ethereum/0xf4844a06d4f995c4c03195afcb5aa59dcbb5b4fc"
    );
    const json = await res.json();
    const res2 = await queryClient("/profile/wijuwiju.eth");
    const json2 = await res2.json();
    expect(json.address).toBe(json2.find((x) => x.platform === "ens").address);
  });
  it("It should response 200 for gamedb.eth", async () => {
    const res = await queryClient("/profile/ethereum/gamedb.eth");
    const json = await res.json();
    expect(json.address).toBe("0x18deee9699526f8c8a87004b2e4e55029fb26b9a");
  });
  it("It should response 200 for 0x18deee9699526f8c8a87004b2e4e55029fb26b9a", async () => {
    const res = await queryClient(
      "/profile/ethereum/0x18deee9699526f8c8a87004b2e4e55029fb26b9a"
    );
    const json = await res.json();
    expect(json.identity).toBe("planetable.eth");
  });
  it("It should response 200 for yisiliu.eth", async () => {
    const res = await queryClient("/profile/ethereum/yisiliu.eth");
    const json = await res.json();
    expect(json.platform).toBe("ens");
  });
  it("It should response 404 for taoli.eth", async () => {
    const res = await queryClient("/profile/ethereum/taoli.eth");
    expect(res.status).toBe(404);
  });
});
