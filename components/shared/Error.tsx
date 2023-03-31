import { ApolloError } from "@apollo/client";
import SVG from "react-inlinesvg";
interface ErrorProps {
  text: ApolloError;
  retry?: () => void;
}

export const Error = (props: ErrorProps) => {
  const { text, retry } = props;
  return (
    <div className="empty">
      <p>Error {text ? text.message : "Unknown Reason"}</p>
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
    </div>
  );
};
