import React from "react"

export const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  )
};

export const Empty = () => {
  return (
    <div className="empty">
      <div className="empty-icon h1">🙀</div>
      <p className="empty-title h4">No results found</p>
      <p className="empty-subtitle">Please try different identity keyword.</p>
    </div>
  )
};

export const FormatAddress = ({address}) => {
  if (!address) {
    return <></>
  }
  const oriAddr = address,
        chars = 4
  return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(oriAddr.length - chars)}`
};
