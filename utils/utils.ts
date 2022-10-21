export const formatText = (string, length?) => {
  const len = length ?? 12;
  if (string.length <= len) {
    return string;
  }
  if (string.startsWith("0x")) {
    const oriAddr = string,
      chars = 4;
    return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(
      oriAddr.length - chars
    )}`;
  } else {
    if (string.length > len) {
      return `${string.substr(0, len)}...`;
    }
  }
  return string;
};

export function getEnumAsArray<T extends object>(enumObject: T) {
  return (
      Object.keys(enumObject)
          // Leave only key of enum
          .filter((x) => Number.isNaN(Number.parseInt(x)))
          .map((key) => ({ key, value: enumObject[key as keyof T] }))
  )
}