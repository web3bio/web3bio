import Link from "next/link";
import { memo, useCallback } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../utils/platform";
import { colorMod } from "../utils/utils";
import toast from "react-hot-toast";

const WidgetItem = (props) => {
  const { item, displayName, openModal } = props;
  const handleCopySuccess = useCallback(() => {
    toast.custom(
      <div className="toast">
        <SVG
          src="../icons/icon-copy.svg"
          width={24}
          height={24}
          className="action mr-2"
        />
        Copied to clipboard
      </div>
    );
  }, []);

  const WidgetContent = (() => {
    return (
      <>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(item.platform)?.icon}`}
            fill={"#fff"}
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
              <SVG
                src="../icons/icon-expand.svg"
                width={20}
                height={20}
                className=""
              />
              : 
              <SVG
                src={
                  item.link
                    ? "icons/icon-open.svg"
                    : "icons/icon-copy.svg"
                }
                width={20}
                height={20}
              />
            }
          </div>
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
      onSuccess={handleCopySuccess}
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
