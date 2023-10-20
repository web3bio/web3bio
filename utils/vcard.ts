export function createVCardString(vCard) {
  let vCardString = "";

  vCardString += "BEGIN:VCARD\n";
  vCardString += "VERSION:3.0\n";

  for (const [key, value] of Object.entries(vCard)) {
    vCardString += `${key}:${value}\n`;
  }

  vCardString += "END:VCARD\n";

  return vCardString;
}

export function fetchAndConvertToBase64(url) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }