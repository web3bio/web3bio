import { ApolloError } from "@apollo/client";
import SVG from "react-inlinesvg";
interface ErrorProps {
  text: ApolloError;
  retry?: () => void;
}

export const Error = (props: ErrorProps) => {
  const { text } = props;
  return (
    <div className="empty">
      <p>Error {text.message}</p>
      <button className="form-button btn" onClick={props.retry}>
        <SVG
          src="icons/icon-search.svg"
          width={24}
          height={24}
          className="icon"
        />
      </button>
    </div>
  );
};
