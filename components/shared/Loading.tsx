'use client'
import React, { useEffect, useState } from "react";
interface LoadingProps {
  styles?: React.CSSProperties;
  retry?: () => void;
  placeholder?: string;
}

const TIMEOUT_SECOND = 15;

export const Loading = (props: LoadingProps) => {
  const { retry, styles, placeholder } = props;
  const useCount = (num: number) => {
    const [second, setSecond] = useState(num);
    useEffect(() => {
      setTimeout(() => {
        if (second > 0) {
          setSecond((c) => c + 1);
        }
      }, 1000);
    }, [second]);
    return [second];
  };
  const [second, setSecond] = useCount(1);
  return (
    <>
      <div className="loading-container" style={styles}>
        <div className="loading"></div>
        {placeholder && <div className="loading-subtitle mt-4">{placeholder}</div>}
      </div>
      {retry && second >= TIMEOUT_SECOND && (
        <>
          <div className="empty">
            <p className="empty-title h4">Fetching information...</p>
            <p className="empty-subtitle">
              Slow connection? Please wait or try again.
            </p>
            <button className="btn btn-primary mt-4" onClick={retry}>
              Try again
            </button>
          </div>
        </>
      )}
    </>
  );
};
