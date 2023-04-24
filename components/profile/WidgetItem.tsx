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
            title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div 
              className="platform-icon"
              style={{"background": SocialPlatformMapping(item.platform)?.color}}
            >
              <SVG src={`../${SocialPlatformMapping(item.platform)?.icon}`} width={24} height={24} />
            </div>
            <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
            <div className="platform-handle">@{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
            <div className="platform-action">
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
            title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
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
            <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
            <div className="platform-handle">{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Open</div>
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
            title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div 
              className="platform-icon"
              style={{"background": SocialPlatformMapping(item.platform)?.color}}
            >
              <SVG src={`../${SocialPlatformMapping(item.platform)?.icon}`} width={24} height={24} />
            </div>
            <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
            <div className="platform-handle">{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
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
              <SVG src={`../${SocialPlatformMapping(item.platform)?.icon}`} width={24} height={24} />
            </div>
            <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
            <div className="platform-handle">{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">
                Copy
                {isCopied && <div className="tooltip-copy">COPIED</div>}
              </div>
            </div>
          </Clipboard>
        </div>
      );
    default:
      return (
        <div className="profile-widget-item">
          <Link
            href={item.link}
            className={`profile-widget ${item.platform}`}
            title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div 
              className="platform-icon"
              style={{"background": SocialPlatformMapping(item.platform)?.color}}
            >
              <SVG src={`../${SocialPlatformMapping(item.platform)?.icon}`} width={24} height={24} />
            </div>
            <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
            <div className="platform-handle">@{item.handle}</div>
            <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
            <div className="platform-action">
              <div className="btn btn-sm">Open</div>
            </div>
          </Link>
        </div>
      );
  }
};

export const RenderWidgetItem = memo(WidgetItem);
