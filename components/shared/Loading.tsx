import { useEffect, useState } from "react";
import { counter } from "../../utils/utils";
import { RetryButton } from "../panel/components/RetryButton";

interface LoadingProps {
  retry?: () => void;
}

export const Loading = (props: LoadingProps) => {
  const { retry } = props;
  const [isTimeout, setIsTimeout] = useState(false);
  useEffect(() => {
    counter(5, () => {
      setIsTimeout(true);
    });
  }, []);
  return (
    <div className="loading-container">
      <div className="loading"></div>
      {retry && isTimeout && (
        <div>
          <p>Currently loading slow, Click Retry</p>
          <RetryButton retry={retry} />
        </div>
      )}
    </div>
  );
};
