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

  const colorMod = (hex, opacity = 100) => {
    const tempHex = hex.replace('#', '');
    const r = parseInt(tempHex.substring(0, 2), 16);
    const g = parseInt(tempHex.substring(2, 4), 16);
    const b = parseInt(tempHex.substring(4, 6), 16);
  
    return `rgba(${r},${g},${b},${opacity / 100})`;
  }

  switch (item.platform) {
    case PlatformType.twitter:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(item.platform)?.color,
            ["--widget-bg-color" as string]: colorMod(SocialPlatformMapping(item.platform)?.color, 15)
          }}
        >
          <div className="platform-icon">
            <SVG src={`../${SocialPlatformMapping(item.platform)?.icon}`} width={24} height={24} />
          </div>
          <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
          <div className="platform-handle">@{item.handle}</div>
          <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
          <div className="platform-action">
            <div className="btn btn-sm">Follow</div>
          </div>
        </Link>
      );
    case PlatformType.website:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(item.platform)?.color,
            ["--widget-bg-color" as string]: colorMod(SocialPlatformMapping(item.platform)?.color, 10)
          }}
        >
          <div 
            className="platform-icon website"
          >
            <img 
              src={`https://icon.horse/icon/${item.handle}`} 
              alt={`${item.handle} Website Favicon`} 
              loading="lazy"
              height={24}
              width={24}
            />
          </div>
          <div className="platform-title">{SocialPlatformMapping(item.platform)?.label}</div>
          <div className="platform-handle">{item.handle}</div>
          <h3 className="text-assistive">{`${displayName} ${SocialPlatformMapping(item.platform)?.label}`}</h3>
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
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(item.platform)?.color,
            ["--widget-bg-color" as string]: colorMod(SocialPlatformMapping(item.platform)?.color, 10)
          }}
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
      );
    default:
      return (
        <Link
          href={item.link}
          className={`profile-widget ${item.platform}`}
          title={`Open ${displayName} ${SocialPlatformMapping(item.platform)?.label}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(item.platform)?.color,
            ["--widget-bg-color" as string]: colorMod(SocialPlatformMapping(item.platform)?.color, 10)
          }}
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
            <div className="btn btn-sm">Open</div>
          </div>
        </Link>
      );
  }
};

export const RenderWidgetItem = memo(WidgetItem);
