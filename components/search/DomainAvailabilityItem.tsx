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
  const shouldOpenProfile =
    data.status === DomainStatus.taken &&
    PROFILE_PLATFORMS_SUPPORTED.includes(data.platform);
  const formattedExpiredAt = data.status === DomainStatus.taken && (data.expiredAt ? new Date(parseInt(data.expiredAt) * 1000).toLocaleDateString() : false);
  const shouldDisplayRegister =
    data.status === DomainStatus.available &&
    data.expiredAt
  

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
                : `Register ${data.name}`
            }
            rel="noopener noreferrer"
          >
            <SVG src="icons/icon-open.svg" width={20} height={20} />
            <span className="hide-xs">
              {shouldOpenProfile ? "Profile" : "Register"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const DomainAvailableItem = memo(RenderDomainAvailabilityItem);
