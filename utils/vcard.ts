import { PlatformData, PlatformType } from "./platform";
import _ from "lodash";

const generateVCardData = (profile) => {
  const obj = {
    FN: profile.displayName,
    EMAIL: profile.email || "",
    URL:
      _.find(
        profile.links,
        (x) =>
          x.platform === PlatformType.website || x.platform === PlatformType.url
      )?.link || "",
    ["PHOTO;VALUE=URL"]: profile.avatar,
    NOTE: profile.description || "",
    ["X-SOCIALPROFILE;type=Web3bio"]:
      window.location.origin + "/" + profile.identity,
  };
  profile.links.forEach((x) => {
    const platform = PlatformData[x.platform];
    const prefix = "X-SOCIALPROFILE;" + `type=${platform.label}`;
    if (platform) {
      obj[prefix] = x.handle || x.link;
    }
  });
  return obj;
};

export function createVCardString(profile) {
  let vCardString = "";
  const PHOTO = getFormattedPhoto("PHOTO", profile.avatar, "JPEG");
  const vCard = generateVCardData(profile);
  vCardString += "BEGIN:VCARD\n";
  vCardString += "VERSION:3.0\n";

  for (const [key, value] of Object.entries(vCard)) {
    vCardString += `${key}:${value}\n`;
  }
  vCardString += PHOTO;
  vCardString += "END:VCARD\n";

  return vCardString;
}

export function fetchAndConvertToBase64(url) {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
}

function getFormattedPhoto(photoType, url, mediaType, base64?) {
  const params = base64 ? ";ENCODING=b;TYPE=" : ";TYPE=";
  var formattedPhoto = photoType + params + mediaType + ":" + e(url) + nl();
  return formattedPhoto;
}

function nl() {
  return "\r\n";
}

function e(value) {
  if (value) {
    if (typeof value !== "string") {
      value = "" + value;
    }
    return value
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }
  return "";
}
