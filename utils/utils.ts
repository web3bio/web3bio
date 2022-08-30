export const formatAddress = ({address}) => {
    if (!address) {
      return ''
    }
    const oriAddr = address,
          chars = 4
    return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(oriAddr.length - chars)}`
  };