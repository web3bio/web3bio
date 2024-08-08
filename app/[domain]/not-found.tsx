"use client";
import { Error } from "@/components/shared/Error";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <Error retry={()=>window.location.reload()} msg={'Not Found'} />;
}
