import { queryClient } from "../components/utils/queries";

describe("Test For Dotbit Profile API", () => {
  it("It should response 404 for jeffx.bit", async () => {
    const res = await queryClient("/profile/dotbit/jeffx.bit");
    expect(res.status).toBe(404);
  });
  it("It should response 404 for 0x42e573b38e41cfa26be5d85235368e596dc6d12b", async () => {
    const res = await queryClient(
      "/profile/dotbit/0x42e573b38e41cfa26be5d85235368e596dc6d12b"
    );
    expect(res.status).toBe(404);
  });
  it("It should response 404 for suji.bit", async () => {
    const res = await queryClient("/profile/dotbit/suji.bit");
    expect(res.status).toBe(404);
  });
  it("It should response 404 for 0x0000000000000000000000000000000000000001", async () => {
    const res = await queryClient(
      "/profile/dotbit/0x0000000000000000000000000000000000000001"
    );
    expect(res.status).toBe(404);
  });
  it("It should response 404 for mitchatmask.bit", async () => {
    const res = await queryClient("/profile/dotbit/mitchatmask.bit");
    expect(res.status).toBe(404);
  });
  it("It should response 200 for satoshi.bit", async () => {
    const res = await queryClient("/profile/dotbit/satoshi.bit");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("0xee8738e3d3e80482526b33c91dd343caef68e41a");
  });
  it("It should response 200 for phone.bit", async () => {
    const res = await queryClient("/profile/dotbit/phone.bit");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.address).toBe("tbrkixogyva7xmysduyis6asvapxkkk8ra");
  });
  it("It should response 200 for kingsgam.bit", async () => {
    const res = await queryClient("/profile/dotbit/kingsgam.bit");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.avatar).toBeTruthy();
  });
  it("It should response 200 for bestcase.bit", async () => {
    const res = await queryClient("/profile/dotbit/bestcase.bit");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.contenthash).toBeTruthy();
  });
});
