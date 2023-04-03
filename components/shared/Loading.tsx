import { useEffect, useState } from "react";

interface LoadingProps {
  retry?: () => void;
}

const TIMEOUT_SECOND = 15;

export const Loading = (props: LoadingProps) => {
  const { retry } = props;
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
      <div className="loading-container">
        <div className="loading"></div>
      </div>
      {retry && second >= TIMEOUT_SECOND && (
        <>
          <div className="empty">
            <p className="empty-title h4">Fetching information...</p>
            <p className="empty-subtitle">Slow connection? Please wait or try again.</p>
            <button className="btn btn-primary mt-4" onClick={retry}>
              Try again
            </button>
          </div>
        </>
      )}
    </>
  );
};
