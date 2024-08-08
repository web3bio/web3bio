import { SocialPlatformMapping } from "./platform";

const generateVCardData = (profile) => {
  let vCardString = "";
  vCardString += "BEGIN:VCARD\r\n";
  vCardString += "VERSION:3.0\r\n";
  vCardString += `FN:${profile.displayName}\r\n`;
  if (profile.email) vCardString += `EMAIL:${profile.email}\r\n`;
  if (profile.avatar) vCardString += `PHOTO;VALUE=uri:${profile.avatar}\r\n`;
  if (profile.description) vCardString += `NOTE:${profile.description}\r\n`;
  vCardString += `X-SOCIALPROFILE;type=Web3;x-user=${profile.identity}:https://web3.bio/${profile.identity}\r\n`;
  profile.links.forEach((x) => {
    const platform = SocialPlatformMapping(x.platform);
    vCardString += `X-SOCIALPROFILE;type=${platform.label};x-user=${x.handle}${
      x.link ? ":" + x.link : ""
    }\r\n`;
  });
  vCardString += "END:VCARD\r\n";
  return vCardString;
};
const createDownloadLink = (data, filename) => {
  var blob = new Blob([data], { type: "text/vcard" });

  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  return link;
};
export const downloadVCard = (_profile) => {
  const vCardData = generateVCardData(_profile);
  const downloadLink = createDownloadLink(
    vCardData,
    `${_profile.identity}.vcard`
  );
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
