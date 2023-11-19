import { PlatformData } from "./platform";

export const generateVCardData = (profile) => {
  let vCardString = "";
  vCardString += "BEGIN:VCARD\r\n";
  vCardString += "VERSION:3.0\r\n";
  vCardString += `FN:${profile.displayName}\r\n`;
  if (profile.email) vCardString += `EMAIL:${profile.email}\r\n`;
  if (profile.avatar) vCardString += `PHOTO;VALUE=uri:${profile.avatar}\r\n`;
  if (profile.description) vCardString += `NOTE:${profile.description}\r\n`;
  vCardString += `X-SOCIALPROFILE;type=Web3;x-user=${profile.identity}:https://web3.bio/${profile.identity}\r\n`;
  profile.links.forEach((x) => {
    const platform = PlatformData[x.platform];
    vCardString += `X-SOCIALPROFILE;type=${platform.label};x-user=${x.handle}${x.link ? ":" + x.link : ""}\r\n`;
  });
  vCardString += "END:VCARD\r\n";
  return vCardString;
};

// export function fetchAndConvertToBase64(url) {
//   return fetch(url)
//     .then((response) => response.blob())
//     .then((blob) => {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//     });
// }
