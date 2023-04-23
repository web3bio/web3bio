import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/platform";

const WidgetItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const {item, displayName} = props;
  const [isCopied, setIsCopied] = useState(false);

  switch (item.platform) {
    case PlatformType.twitter:
      return (
        <div className="profile-widget-item">
          <Link
            href={item.link}
            className={`profile-widget ${item.platform}`}
            title={`Open ${displayName} (${item.handle}) Twitter`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div 
              className="platform-icon"
              style={{"background": SocialPlatformMapping(item.platform)?.color}}
            >
              <SVG src="../icons/icon-twitter.svg" width={24} height={24} />
            </div>
            <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
            <div className="platform-handle">@{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} (${item.handle}) Twitter`}</h3>
            <div className="platform-action active">
              <div className="btn btn-sm">Follow</div>
            </div>
          </Link>
        </div>
      );
    case PlatformType.website:
      return (
        <div className="profile-widget-item">
          <Link
            href={item.link}
            className={`profile-widget ${item.platform}`}
            title={`Open ${displayName} (${item.handle}) Website`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div 
              className="platform-icon website"
            >
              <img 
                src={`https://icon.horse/icon/${item.handle}`} 
                alt={`${item.handle} Website Favicon`} 
                loading="lazy"
              />
            </div>
            <div className="platform-title">Website</div>
            <div className="platform-handle">{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} (${item.handle}) Website`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Open</div>
            </div>
          </Link>
        </div>
      );
    case PlatformType.github:
      return (
        <div className="profile-widget-item">
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
            <h3 className="text-assistive">{`${displayName} (${item.handle}) GitHub`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Follow</div>
            </div>
          </Link>
        </div>
      );
    case PlatformType.telegram:
      return (
        <div className="profile-widget-item">
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
            <h3 className="text-assistive">{`${displayName} (${item.handle}) Telegram`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Message</div>
            </div>
          </Link>
        </div>
      );
    case PlatformType.discord:
      return (
        <div className="profile-widget-item">
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
            <h3 className="text-assistive">{`${displayName} (${item.handle}) Discord`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">
                Copy
                {isCopied && <div className="tooltip-copy">COPIED</div>}
              </div>
            </div>
          </Clipboard>
        </div>
      );
    case PlatformType.reddit:
      return (
        <div className="profile-widget-item">
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
            <h3 className="text-assistive">{`${displayName} (${item.handle}) Reddit`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Open</div>
            </div>
          </Link>
        </div>
      );
    case PlatformType.linkedin:
      return (
        <div className="profile-widget-item">
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
            <h3 className="text-assistive">{`${displayName} (${item.handle}) LinkedIn`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Open</div>
            </div>
          </Link>
        </div>
      );
    case PlatformType.farcaster:
      return (
        <div className="profile-widget-item">
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
            <h3 className="text-assistive">{`${displayName} (${item.handle}) Farcaster`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Open</div>
            </div>
          </Link>
        </div>
      );
    default:
      return null;
  }
};

export const RenderWidgetItem = memo(WidgetItem);
