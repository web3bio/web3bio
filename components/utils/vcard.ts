import { SocialPlatformMapping } from "./platform";

const escapeVCardValue = (value: string): string => {
  return value.replace(/[\\,;]/g, (match) => '\\' + match);
};
const generateVCardData = (profile): string => {
  const vCardLines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(profile.displayName)}`,
  ];

  if (profile.email) vCardLines.push(`EMAIL:${escapeVCardValue(profile.email)}`);
  if (profile.avatar) vCardLines.push(`PHOTO;VALUE=uri:${escapeVCardValue(profile.avatar)}`);
  if (profile.description) vCardLines.push(`NOTE:${escapeVCardValue(profile.description)}`);

  vCardLines.push(`X-SOCIALPROFILE;type=Web3;x-user=${escapeVCardValue(profile.identity)}:https://web3.bio/${encodeURIComponent(profile.identity)}`);

  profile.links.forEach(({ platform, handle, link }) => {
    const mappedPlatform = SocialPlatformMapping(platform);
    vCardLines.push(`X-SOCIALPROFILE;type=${escapeVCardValue(mappedPlatform.label)};x-user=${escapeVCardValue(handle)}${link ? ':' + escapeVCardValue(link) : ''}`);
  });

  vCardLines.push('END:VCARD');

  return vCardLines.join('\r\n');
};

const createDownloadLink = (data: string, filename: string): HTMLAnchorElement => {
  const blob = new Blob([data], { type: "text/vcard" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  return link;
};

export const downloadVCard = (profile): void => {
  const vCardData = generateVCardData(profile);
  const downloadLink = createDownloadLink(vCardData, `${profile.identity}.vcard`);
  
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  }, 100);
};
