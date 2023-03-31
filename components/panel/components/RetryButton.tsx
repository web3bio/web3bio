import { memo } from "react";

interface RetryButtonProps {
  retry: () => void;
}
const RetryButtonRender = (props: RetryButtonProps) => {
  const { retry } = props;
  return (
    <button className="form-button btn" onClick={retry}>
      Retry
      {/* <SVG
  // todo: add retry icon
  src="icons/switch.svg"
  width={24}
  height={24}
  className="icon"
/> */}
    </button>
  );
};

export const RetryButton = memo(RetryButtonRender);
