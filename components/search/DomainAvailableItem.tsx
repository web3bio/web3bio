import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import _ from "lodash";

enum DomainStatus {
  taken = "taken",
  available = "available",
  protected = "protected",
}

const PROFILE_PLATFORMS_SUPPORTED = [
  PlatformType.ens,
  PlatformType.farcaster,
  PlatformType.lens,
  PlatformType.unstoppableDomains,
  PlatformType.ethereum,
  PlatformType.sns,
  PlatformType.dotbit,
];

const RenderDomainAvailableItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const { data } = props;
  const [isCopied, setIsCopied] = useState(false);
  const shouldOpenProfile =
    data.status === DomainStatus.taken &&
    PROFILE_PLATFORMS_SUPPORTED.includes(data.platform);
  return (
    <div className="social-item">
      <div className="social-main">
        <Link href={""} target="_blank" className="social">
          <div className="icon">
            <SVG
              fill={SocialPlatformMapping(data.platform)?.color}
              src={SocialPlatformMapping(data.platform)?.icon || ""}
              width={20}
              height={20}
            />
          </div>
          <div className="title">{data.name}</div>
          <div className={`domain-status ${data.status}`}>{data.status}</div>
        </Link>
        <div className={`actions ${shouldOpenProfile ? "active" : ""}`}>
          <Clipboard
            component="button"
            className="btn btn-sm btn-link action"
            data-clipboard-text={data.name}
            onSuccess={onCopySuccess}
          >
            <SVG
              src={
                isCopied ? "../icons/icon-check.svg" : "../icons/icon-copy.svg"
              }
              width={20}
              height={20}
            />
            <span className="hide-xs">Copy</span>
          </Clipboard>
          <Link
            target={"_blank"}
            className="btn btn-sm btn-link action "
            href={
              shouldOpenProfile
                ? `/${data.name}`
                : `${SocialPlatformMapping(data.platform)?.urlPrefix}${
                    data.name
                  }`
            }
            prefetch={false}
            title={
              shouldOpenProfile
                ? `Open ${data.name} Profile Page`
                : `Obtain ${data.name}`
            }
            rel="noopener noreferrer"
          >
            <SVG src="icons/icon-open.svg" width={20} height={20} />
            <span className="hide-xs">
              {shouldOpenProfile ? "Profile" : "Obtain"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const DomainAvailableItem = memo(RenderDomainAvailableItem);
