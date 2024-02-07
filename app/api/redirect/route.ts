export default async function GET(req) {
  const requestURL = new URL(req.url);
  const redirectURL = requestURL.searchParams.get("redirectURL");
  return new Response("<div>redirect</div>", {
    status: 302,
    headers: {
      Location: redirectURL?.toString() || '',
    },
  });
}