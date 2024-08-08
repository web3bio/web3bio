"use client";
import { Error } from "@/components/shared/Error";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <Error retry={()=>window.location.reload()} msg={error.message} />;
}
