import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/platform";
import { formatText } from "../../utils/utils";

const WidgetItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const {item} = props;
  const [isCopied, setIsCopied] = useState(false);

  switch (item.platform) {
    case PlatformType.twitter:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} Twitter`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-twitter.svg" width={24} height={24} />
          </div>
          <div className="platform-title">Twitter</div>
          <div className="platform-handle">@{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    case PlatformType.website:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} Website`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon bg-pride"
          >
            <SVG src="../icons/icon-web.svg" width={24} height={24} />
          </div>
          <div className="platform-title">Website</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    case PlatformType.github:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} GitHub`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-github.svg" width={24} height={24} />
          </div>
          <div className="platform-title">GitHub</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    case PlatformType.telegram:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} Telegram`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-telegram.svg" width={24} height={24} />
          </div>
          <div className="platform-title">Telegram</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    case PlatformType.discord:
      return (
        <Clipboard
          component="div"
          data-clipboard-text={item.handle}
          onSuccess={onCopySuccess}
          className={`profile-widget ${item.platform}`}
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-discord.svg" width={24} height={24} />
          </div>
          <div className="platform-title">Discord</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">
              Copy
              {isCopied && <div className="tooltip-copy">COPIED</div>}
            </div>
          </div>
        </Clipboard>
      );
    case PlatformType.reddit:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} Reddit`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-reddit.svg" width={24} height={24} />
          </div>
          <div className="platform-title">Reddit</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    case PlatformType.linkedin:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} LinkedIn`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-linkedin.svg" width={24} height={24} />
          </div>
          <div className="platform-title">LinkedIn</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    case PlatformType.farcaster:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${item.handle} Farcaster`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="platform-icon"
            style={{"background": SocialPlatformMapping(item.platform)?.color}}
          >
            <SVG src="../icons/icon-farcaster.svg" width={24} height={24} />
          </div>
          <div className="platform-title">Farcaster</div>
          <div className="platform-handle">{item.handle}</div>
          <div className="platform-action">
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
    default:
      return null;
  }
};

export const RenderWidgetItem = memo(WidgetItem);