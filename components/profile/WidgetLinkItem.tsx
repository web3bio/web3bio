import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, colorMod } from "../../utils/utils";

const WidgetItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const { item, displayName } = props;
  const [isCopied, setIsCopied] = useState(false);
  const WidgetContent = (() => {
    return (
      <>
        {item.verified && <div className="verified-icon">✅</div>}
        {item.platform === PlatformType.website ? (
          <div className="platform-icon website">
            <Image
              src={`https://icon.horse/icon/${item.handle.split("/")[0]}`}
              alt={`${item.handle} Website Favicon`}
              loading="lazy"
              height={24}
              width={24}
            />
          </div>
        ) : (
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(item.platform)?.icon}`}
              width={20}
              height={20}
            />
          </div>
        )}

        <div className="platform-content">
          <h3 className="text-assistive">{`${displayName} ${
            SocialPlatformMapping(item.platform)?.label
          }`}</h3>
          <div className="platform-title">
            {SocialPlatformMapping(item.platform)?.label}
          </div>
          <div className="platform-handle text-ellipsis">{item.handle}</div>
        </div>
        {isCopied && <div className="tooltip-copy">COPIED</div>}
        <div className="platform-action">
          <div className="btn btn-sm btn-link">
            <SVG
              src={item.link ? "icons/icon-open.svg" : "icons/icon-copy.svg"}
              width={20}
              height={20}
            />
          </div>
        </div>
      </>
    );
  })();
  return item.link ? (
    <Link
      href={item.link}
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
  switch (item.platform) {
    case PlatformType.website:
      return (
        <Link
          href={item.link}
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
              10
            ),
          }}
        >
          <div className="platform-icon website">
            <Image
              src={`https://icon.horse/icon/${item.handle.split("/")[0]}`}
              alt={`${item.handle} Website Favicon`}
              loading="lazy"
              height={24}
              width={24}
            />
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
          <div className="platform-action">
            <div className="btn btn-sm btn-link">
              <SVG src="icons/icon-open.svg" width={20} height={20} />
            </div>
          </div>
        </Link>
      );
    case PlatformType.discord:
      return (
        <>
          {item.link ? (
            <Link
              href={item.link}
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
                  10
                ),
              }}
            >
              <div
                className="platform-icon"
                style={{
                  background: SocialPlatformMapping(item.platform)?.color,
                }}
              >
                <SVG
                  src={`../${SocialPlatformMapping(item.platform)?.icon}`}
                  width={20}
                  height={20}
                />
              </div>
              <div className="platform-content">
                <h3 className="text-assistive">{`${displayName} ${
                  SocialPlatformMapping(item.platform)?.label
                }`}</h3>
                <div className="platform-title">
                  {SocialPlatformMapping(item.platform)?.label}
                </div>
                <div className="platform-handle text-ellipsis">
                  {item.handle}
                </div>
              </div>
              <div className="platform-action">
                <div className="btn btn-sm btn-link">
                  <SVG src="icons/icon-open.svg" width={20} height={20} />
                </div>
              </div>
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
              <div
                className="platform-icon"
                style={{
                  background: SocialPlatformMapping(item.platform)?.color,
                }}
              >
                <SVG
                  src={`../${SocialPlatformMapping(item.platform)?.icon}`}
                  width={20}
                  height={20}
                />
              </div>
              <div className="platform-content">
                <h3 className="text-assistive">{`${displayName} ${
                  SocialPlatformMapping(item.platform)?.label
                }`}</h3>
                <div className="platform-title">
                  {SocialPlatformMapping(item.platform)?.label}
                </div>
                <div className="platform-handle text-ellipsis">
                  {item.handle}
                </div>
              </div>
              {isCopied && <div className="tooltip-copy">COPIED</div>}
              <div className="platform-action">
                <div className="btn btn-sm btn-link">
                  <SVG src="icons/icon-copy.svg" width={20} height={20} />
                </div>
              </div>
            </Clipboard>
          )}
        </>
      );
    default:
      return (
        <Link
          href={item.link}
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
              10
            ),
          }}
        >
          <div
            className="platform-icon"
            style={{ background: SocialPlatformMapping(item.platform)?.color }}
          >
            <SVG
              src={`../${SocialPlatformMapping(item.platform)?.icon}`}
              width={20}
              height={20}
            />
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
          <div className="platform-action">
            <div className="btn btn-sm btn-link">
              <SVG src="icons/icon-open.svg" width={20} height={20} />
            </div>
          </div>
        </Link>
      );
  }
};

export const RenderWidgetItem = memo(WidgetItem);
