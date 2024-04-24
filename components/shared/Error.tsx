import { ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";
import { fallbackEmoji } from "../utils/utils";
interface ErrorProps {
  msg?: string;
  text?: ApolloError;
  buttonText?: string;
  retry?: () => void;
}

export const Error = (props: ErrorProps) => {
  const { text, retry, msg, buttonText = "Try again" } = props;
  const [emoji, setEmoji] = useState("");
  useEffect(() => {
    setEmoji(fallbackEmoji[Math.floor(Math.random() * fallbackEmoji.length)]);
  }, []);
  return (
    <div className="empty">
      <div className="empty-icon h1" style={{ fontSize: "72px" }}>
        {emoji}
      </div>
      <p className="empty-title h4">Something went wrong! </p>
      {text || msg ? (
        <p className="empty-subtitle">{text?.message || msg}</p>
      ) : (
        "Please try again"
      )}
      <button className="btn btn-primary mt-4" onClick={retry}>
        {buttonText}
      </button>
    </div>
  );
};
