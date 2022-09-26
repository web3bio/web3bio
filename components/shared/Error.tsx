import { ApolloError } from "@apollo/client";
import React from "react";

interface ErrorProps {
  text: ApolloError;
}

export const Error = (props: ErrorProps) => {
  const { text } = props;
  return <div className="empty">Error {text.message}</div>;
};
