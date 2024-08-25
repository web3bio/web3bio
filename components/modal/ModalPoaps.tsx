import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import Link from "next/link";
import _ from "lodash";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

export default function PoapsModalContent({ onClose, asset }) {
  const { event, tokenId, chain } = asset;

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <div
        className="modal-header"
        style={{
          ["--widget-primary-color" as string]: SocialPlatformMapping(
            PlatformType.poap
          ).color,
        }}
      >
        <div className="modal-cover poaps"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.poap).icon}`}
            fill="#fff"
            width={14}
            height={14}
          />
        </div>
        <span className="modal-header-title">{SocialPlatformMapping(PlatformType.poap).label}</span>
      </div>
      <div className="modal-body">
        <div className="mt-2 mb-2">
          <NFTAssetPlayer
            className={"img-container"}
            type={"image/png"}
            height={240}
            width={240}
            src={event.image_url}
            alt={event.name}
            placeholder={true}
          />
        </div>
        <div className="d-flex mt-2" style={{ alignItems: "center", lineHeight: 1.25 }}>
          <strong className="h4 text-bold">{event.name}</strong>
        </div>
        <div className="text-gray mt-1 mb-2">
          <span>#{tokenId}</span>
          {event.supply && (
            <>
              <span> · </span>
              <span>{event.supply} Supply</span>
            </>
          )}
          {chain && (
            <>
              <span> · </span>
              <span>{chain === "xdai" ? "Gnosis Chain" : `${chain} Chain`}</span>
            </>
          )}
        </div>
        <div className="mt-2 mb-2">{event.description}</div>
        {event.city || event.country ? (
          <div className="mt-2 mb-2">
            📍 {event.city} {event.country}
          </div>
        ) : null}
        {event.start_date || event.end_date ? (
          <div className="mt-2 mb-2">
            📅 {event.start_date}{" "}
            {event.end_date && event.start_date !== event.end_date && `- ${event.end_date}`}
          </div>
        ) : null}
      </div>
      <div className="modal-footer">
        <div className="btn-group btn-group-block">
          {tokenId && (
            <Link
              href={`https://collectors.poap.xyz/token/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              <span>Open in POAP</span>
            </Link>
          )}

          {event.event_url && (
            <Link
              href={event.event_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <SVG
                src={`../icons/icon-web.svg`}
                fill="#121212"
                width={20}
                height={20}
              />
              <span>Website</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
