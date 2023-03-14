import { ApolloError } from "@apollo/client";

interface ErrorProps {
  text: ApolloError;
}

export const Error = (props: ErrorProps) => {
  const { text } = props;
  return <div className="empty">Error {text.message}</div>;
};
