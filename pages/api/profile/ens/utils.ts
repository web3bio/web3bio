import { resolveSocialMediaLink } from "../../../../utils/utils";

export const getSocialMediaLink = (url: string, type: string) => {
  let resolvedURL = "";
  if(!url) return null
  if (url.startsWith("https")) {
    resolvedURL = url;
  } else {
    resolvedURL = resolveSocialMediaLink(url, type);
  }

  return resolvedURL;
};
