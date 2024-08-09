import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import PoapNFTOwner from "../profile/PoapNFTOwner";
import _ from "lodash";
import { isSameAddress } from "../utils/utils";
import { useProfiles } from "../hooks/useReduxProfiles";
import { SIMPLEHASH_URL, SimplehashFetcher } from "../apis";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

export default function PoapsModalContent({ onClose, asset }) {
  const [owners, setOwners] = useState(new Array());
  const { data: poapDetail } = useSWR(
    `${SIMPLEHASH_URL}/api/v0/nfts/poap_event/` + asset.asset.event.id,
    SimplehashFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    if (poapDetail?.nfts?.length > 0) {
      const sliced = poapDetail.nfts.slice(0, 6);
      setOwners(sliced.map((x) => x.owners?.[0]));
    }
  }, [poapDetail]);
  const profiles = useProfiles();

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
          )?.color,
        }}
      >
        <div className="modal-cover poaps"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.poap)?.icon}`}
            width={14}
            height={14}
          />
        </div>
        <span className="modal-header-title">POAP</span>
      </div>
      <div className="modal-body">
        <div className="mt-2 mb-2">
          <NFTAssetPlayer
            className={"img-container"}
            type={"image/png"}
            height={240}
            width={240}
            src={asset.mediaURL}
            alt={asset.asset.event.name}
            placeholder={true}
          />
        </div>
        <div className="d-flex mt-2" style={{ alignItems: "center" }}>
          <strong className="h4 text-bold">{asset.asset.event.name}</strong>
        </div>
        <div className="text-gray">
          
        </div>
        <div className="mt-2 mb-2">{asset.asset.event.description}</div>
        <div className="mt-2 mb-2 btn-group">
          {asset.asset.tokenId && (
            <Link
              href={`https://collectors.poap.xyz/token/${asset.asset.tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
            >
              <SVG
                src={`../icons/icon-poap.svg`}
                fill="#121212"
                width={18}
                height={18}
              />
              <span>POAP</span>
            </Link>
          )}
          {asset.asset.event.event_url && (
            <Link
              href={asset.asset.event.event_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
            >
              <SVG
                src={`../icons/icon-web.svg`}
                fill="#121212"
                width={18}
                height={18}
              />
              <span>Website</span>
            </Link>
          )}
        </div>

        <div className="divider mt-4 mb-4"></div>
        <div className="panel-widget">
          <div className="panel-widget-title">Attributes</div>
          <div className="panel-widget-content">
            <div className="panel-widget-list">
              <div className="widget-list-item">
                <div className="list-item-left">Event Start</div>
                <div className="list-item-right text-bold">
                  {asset.asset.event.start_date}
                </div>
              </div>
              {(asset.asset.event.city || asset.asset.event.country) && (
                <div className="widget-list-item">
                  <div className="list-item-left">Event Location</div>
                  <div className="list-item-right text-bold">
                    {asset.asset.event.city} {asset.asset.event.country}
                  </div>
                </div>
              )}
              <div className="widget-list-item">
                <div className="list-item-left">Chain</div>
                <div className="list-item-right text-bold text-uppercase">
                  {asset.asset.chain}
                </div>
              </div>
              <div className="widget-list-item">
                <div className="list-item-left">POAP Supply</div>
                <div className="list-item-right text-bold">
                  {asset.asset.event.supply}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mt-4 mb-4"></div>
        {owners?.length > 0 && (
          <div className="panel-widget">
            <div className="panel-widget-title">Owners</div>
            <div className="panel-widget-content">
              <div className="panel-widget-list">
                {owners.map((x) => {
                  return (
                    x?.owner_address && (
                      <PoapNFTOwner
                        profile={profiles.find((i) =>
                          isSameAddress(i.uuid, x.owner_address)
                        )}
                        key={x.owner_address}
                        address={x.owner_address}
                      />
                    )
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
