import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import Link from "next/link";
import useSWR from "swr";
import { SIMPLEHASH_URL, SimplehashFetcher } from "../apis/simplehash";
import { useEffect, useState } from "react";
import PoapNFTOwner from "../profile/PoapNFTOwner";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import { ProfileInterface } from "../utils/profile";
import _ from "lodash";
import { isSameAddress } from "../utils/utils";
export default function PoapsModalContent({ onClose, asset }) {
  const [owners, setOwners] = useState(new Array());
  const { data: poapDetail } = useSWR(
    `${SIMPLEHASH_URL}/api/v0/nfts/poap_event/` + asset.asset.event.id,
    SimplehashFetcher
  );
  useEffect(() => {
    if (poapDetail?.nfts?.length > 0) {
      const sliced = poapDetail.nfts.slice(0, 6);
      setOwners(sliced.map((x) => x.owners?.[0]));
    }
  }, [poapDetail]);
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));

  return (
    <>
      <div id="nft-dialog" className="nft-preview">
        <div className="preview-container">
          <div
            className="preview-overlay"
            style={{
              backgroundImage: "url(" + asset.mediaURL + ")",
            }}
            onClick={onClose}
          ></div>
          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
          <div className="preview-image preview-image-poap">
            <NFTAssetPlayer
              className={"img-container"}
              type={"image/png"}
              src={asset.mediaURL}
              alt={asset.asset.event.name}
              placeholder={true}
            />
          </div>
          <div className="preview-main">
            <div className="preview-content">
              <div className="panel-widget">
                <div className="panel-widget-content">
                  <div className="nft-header-collection collection-title mb-4">
                    <SVG
                      className="collection-logo"
                      src="../icons/icon-poap.svg"
                      width={24}
                      height={24}
                      fill={"#5E58A5"}
                    />
                    <div
                      className="collection-name text-ellipsis"
                      style={{ color: "#5E58A5" }}
                    >
                      POAP
                    </div>
                  </div>
                  <div className="nft-header-name h4">
                    {asset.asset.event.name}
                  </div>
                  <div className="nft-header-description mt-4 mb-4">
                    {asset.asset.event.description}
                  </div>

                  <div className="btn-group mt-4">
                    {asset.asset.tokenId && (
                      <Link
                        href={`https://collectors.poap.xyz/token/${asset.asset.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                      >
                        <SVG
                          src={`../icons/icon-poap.svg`}
                          fill="#121212"
                          width={20}
                          height={20}
                        />
                        <span className="ml-1">POAP</span>
                      </Link>
                    )}
                    {asset.asset.event.event_url && (
                      <Link
                        href={asset.asset.event.event_url}
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
                        <span className="ml-1">Website</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

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
          </div>
        </div>
      </div>
    </>
  );
}
