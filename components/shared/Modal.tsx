import { useCallback, useRef, useEffect } from "react";

import SVG from "react-inlinesvg";

export default function Modal(props) {
  const { onDismiss, children } = props;
  const overlay = useRef();
  const wrapper = useRef();

  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div ref={overlay} className="web3bio-mask-cover" onClick={onClick}>
      <div className="close-icon" onClick={onDismiss}>
        <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
      </div>
      <div ref={wrapper} className="web3bio-modal-container">
        {children}
      </div>
    </div>
  );
}
