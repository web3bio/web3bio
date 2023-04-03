import { useEffect, useState } from "react";
import { RetryButton } from "../panel/components/RetryButton";

interface LoadingProps {
  retry?: () => void;
}

const TIMEOUT_SECOND = 2;

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
    <div className="loading-container">
      <div className="loading"></div>
      {retry && second >= TIMEOUT_SECOND && (
        <div>
          <p>Currently loading slow, Click Retry</p>
          <RetryButton retry={retry} />
        </div>
      )}
    </div>
  );
};
