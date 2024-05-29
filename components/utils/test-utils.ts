export const baseURL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
export const queryClient = async (path: string) => {
  return await fetch(baseURL + "/api" + path);
};
