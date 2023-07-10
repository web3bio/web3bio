import { usePathname } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";

import SVG from "react-inlinesvg";

export default function Modal(props) {
  const { onDismiss, children } = props;
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const pathName = usePathname()
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
    const newPathName = pathName.replaceAll("/profile", "");
    window.history.replaceState(null, "", newPathName);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div ref={overlay} className="web3bio-mask-cover" onClick={onClick}>
      <div ref={wrapper} className="web3bio-modal-container">
        <div className="btn btn-close modal-close-icon" onClick={onDismiss}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
        {children}
      </div>
    </div>
  );
}
