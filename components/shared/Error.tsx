import { ApolloError } from "@apollo/client";
interface ErrorProps {
  msg?: string;
  text?: ApolloError;
  retry?: () => void;
}

export const Error = (props: ErrorProps) => {
  const { text, retry, msg } = props;
  return (
    <div className="empty">
      <div className="empty-icon h1">😵</div>
      <p className="empty-title h4">Something went wrong! </p>
      {text || msg ? (
        <p className="empty-subtitle">{text?.message || msg}</p>
      ) : (
        "Please try again"
      )}
      <button className="btn btn-primary mt-4" onClick={retry}>
        Try again
      </button>
    </div>
  );
};
