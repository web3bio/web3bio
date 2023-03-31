import { ApolloError } from "@apollo/client";
import SVG from "react-inlinesvg";
import { RetryButton } from "../panel/components/RetryButton";
interface ErrorProps {
  text: ApolloError;
  retry?: () => void;
}

export const Error = (props: ErrorProps) => {
  const { text, retry } = props;
  return (
    <div className="empty">
      <p>Error {text ? text.message : "Unknown Reason"}</p>
      <RetryButton retry={retry} />
    </div>
  );
};
