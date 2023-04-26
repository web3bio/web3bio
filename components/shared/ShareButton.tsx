import { useState } from "react";
import SVG from "react-inlinesvg";
import ShareModal from "./ShareModal";
export default function ShareButton(props) {
  const { url, shareText } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className="share_wrapper">
      <button className="btn " title="Share thi page" onClick={()=>setOpen(true)}>
        <SVG src="icons/icon-open.svg" width={20} height={20} />
        Share
      </button>
      {open && <ShareModal onClose={()=>setOpen(false)} />}
    </div>
  );
}
