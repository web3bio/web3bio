import { useState } from "react";
import SVG from "react-inlinesvg";
import ShareModal from "./ShareModal";
export default function ShareButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="btn action btn-link"
        title="Share this page"
        onClick={() => setOpen(true)}
      >
        <SVG src="icons/icon-open.svg" width={20} height={20} />
        Share
      </button>
      {open && <ShareModal onClose={() => setOpen(false)} />}
    </>
  );
}
