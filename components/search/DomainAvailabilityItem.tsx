import Link from "next/link";
import { memo } from "react";
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

const RenderDomainAvailabilityItem = (props) => {
  const { data } = props;
  
  const formattedExpiredAt = data.status === DomainStatus.taken && (data.expiredAt ? new Date(parseInt(data.expiredAt) * 1000).toLocaleDateString() : false);
  const shouldOpenProfile =
    data.status === DomainStatus.taken &&
    PROFILE_PLATFORMS_SUPPORTED.includes(data.platform);
  const shouldDisplayRegister =
    data.status === DomainStatus.available &&
    Boolean(SocialPlatformMapping(data.platform).registerlink);
  
  return (
    <div className={`social-item ${data.status}`}>
      <div className="social-main">
        <div className="social">
          <div
            className="icon"
            style={{
              background: SocialPlatformMapping(data.platform)
                .color,
              color: "#fff",
            }}
          >
            <SVG
              src={SocialPlatformMapping(data.platform)?.icon || ""}
              fill={"#fff"}
              width={20}
              height={20}
            />
          </div>
          <div className="title">{data.name}</div>
          <div className={`domain-status ${data.status}`}>{data.status}</div>
          {formattedExpiredAt && <div className="domain-status">
            <div className="domain-status-key text-gray">
              Expiry
            </div>
            <div className="domain-status-value">
              {formattedExpiredAt}
            </div>
          </div>}
        </div>
        <div className={`actions active`}>
          {shouldDisplayRegister && (
            <Link
              className="btn btn-sm btn-link action "
              href={`${SocialPlatformMapping(data.platform).registerlink}${data.name}`}
              prefetch={false}
              title={`Register ${data.name}`}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-wallet.svg" width={20} height={20} />
              <span className="hide-xs">Register</span>
            </Link>
          )}
          {shouldOpenProfile && (
            <Link
              className="btn btn-sm btn-link action "
              href={`/${data.name}`}
              prefetch={false}
              title={`Open ${data.name} Profile Page`}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} />
              <span className="hide-xs">Profile</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const DomainAvailableItem = memo(RenderDomainAvailabilityItem);
