import Link from "next/link";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../utils/platform";
export default function ResultAccountItemAction(props) {
  const { classes, title, disable, isActive, href, text, prefetch, platform } =
    props;
  return !disable ? (
    <div className={`actions ${isActive && "active"} ${classes ? classes : ""}`}>
      <Link
        target={"_blank"}
        className="btn btn-sm btn-link action"
        href={encodeURI(href)}
        prefetch={prefetch}
        title={
          title || `Open ${SocialPlatformMapping(platform).label} Profile Page`
        }
        rel="noopener noreferrer"
      >
        <SVG src="icons/icon-open.svg" width={20} height={20} />
        <span className="hide-xs">{text || "Open"}</span>
      </Link>
    </div>
  ) : null;
}
