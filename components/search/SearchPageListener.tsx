import { useEffect, useCallback } from "react";

export default function SearchPageListener({ inputRef }) {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      window.scrollTo(0, 0);
      inputRef.current?.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (inputRef?.current) {
      document.body.addEventListener("keydown", onKeyDown);
      return () => document.body.removeEventListener("keydown", onKeyDown);
    }
  }, [inputRef, onKeyDown]);

  return null;
}