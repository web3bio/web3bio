import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { colorMod } from "../utils/utils";

const WidgetItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const { item, displayName, openModal } = props;
  const [isCopied, setIsCopied] = useState(false);
  const WidgetContent = (() => {
    return (
      <>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(item.platform)?.icon}`}
            width={20}
            height={20}
            title={"Social Icon"}
          />
          {item.verified && (
            <div className="icon-verified">
              <SVG
                src={`icons/icon-badge.svg`}
                fill={"#fff"}
                width={20}
                height={20}
                title={"Verified Social Link"}
              />
            </div>
          )}
        </div>

        <div className="platform-content">
          <h3 className="text-assistive">{`${displayName} ${
            SocialPlatformMapping(item.platform)?.label
          }`}</h3>
          <div className="platform-title">
            {SocialPlatformMapping(item.platform)?.label}
          </div>
          <div className="platform-handle text-ellipsis">{item.handle}</div>
        </div>
        <div className={`platform-action${item.hasDetail ? " active" : ""}`}>
          <div className="btn btn-sm btn-action">
            {item.hasDetail ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              : 
              <SVG
                src={
                  item.link
                    ? "icons/icon-open.svg"
                    : !isCopied
                    ? "icons/icon-copy.svg"
                    : "icons/icon-check.svg"
                }
                width={20}
                height={20}
              />
            }
          </div>
          {isCopied && <div className="tooltip-copy">COPIED</div>}
        </div>
      </>
    );
  })();
  return item.link ? (
    <Link
      href={!item.hasDetail ? item.link : ""}
      onClick={(e) => {
        if (item.hasDetail) {
          e.preventDefault();
          e.stopPropagation();
          openModal(item);
        }
      }}
      className={`profile-widget profile-widget-link ${item.platform}`}
      title={`Open ${displayName} ${
        SocialPlatformMapping(item.platform)?.label
      }`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ["--widget-primary-color" as string]: SocialPlatformMapping(
          item.platform
        )?.color,
        ["--widget-bg-color" as string]: colorMod(
          SocialPlatformMapping(item.platform)?.color,
          15
        ),
      }}
    >
      {WidgetContent}
    </Link>
  ) : (
    <Clipboard
      component="div"
      data-clipboard-text={item.handle}
      onSuccess={onCopySuccess}
      className={`profile-widget profile-widget-link ${item.platform}`}
      style={{
        ["--widget-primary-color" as string]: SocialPlatformMapping(
          item.platform
        )?.color,
        ["--widget-bg-color" as string]: colorMod(
          SocialPlatformMapping(item.platform)?.color,
          10
        ),
      }}
    >
      {WidgetContent}
    </Clipboard>
  );
};

export const RenderWidgetItem = memo(WidgetItem);
