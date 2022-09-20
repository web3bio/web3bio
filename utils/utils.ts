export const formatAddress = ({address}) => {
    if (!address) {
      return ''
    }
    const oriAddr = address,
          chars = 4
    return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(oriAddr.length - chars)}`
  };

export const formatText = (text, length = 15, elipsis = "..") => {
  if (!text) return "";
  if (text.length > length) {
    return `${text.substr(0, length)}${elipsis}`;
  }
  return text;
};