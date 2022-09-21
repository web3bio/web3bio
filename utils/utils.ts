export const formatAddress = (address) => {
    if (address.startsWith('0x')) {
      const oriAddr = address,
      chars = 4
      return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(oriAddr.length - chars)}`
    } else {
      if (address.length > 15) {
        return `${address.substr(0, 15)}...`;
      }
    }
    return address;
  };

export const formatText = (text, length = 15, elipsis = "...") => {
  if (!text) return "";
  if (text.length > length) {
    return `${text.substr(0, length)}${elipsis}`;
  }
  return text;
};