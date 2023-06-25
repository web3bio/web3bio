"use client";
import { Error } from "../components/shared/Error";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Error retry={reset} msg={error.message} />
      </body>
    </html>
  );
}
