import { useEffect } from "react";
import _ from "lodash";
export default function IndexPageListener({ inputRef }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey && e.keyCode === 75) || (e.metaKey && e.keyCode === 75)) {
        window.scrollTo(0, 0);
        inputRef.current.focus();
      }
    };

    const debounced = _.debounce(onKeyDown, 200, { maxWait: 500 });

    if (inputRef?.current) {
      document.body.addEventListener("keydown", debounced);
    }

    return () => document.body.removeEventListener("keydown", debounced);
  }, [inputRef]);
  return null;
}
