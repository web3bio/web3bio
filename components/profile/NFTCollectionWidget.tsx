import { memo, useCallback, useState } from "react";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/platform";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
  NFTSCAN_POLYGON_BASE_API,
} from "../apis/nftscan";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";

function useCollections(address: string, network: PlatformType) {
  const baseURL =
    network === PlatformType.lens
      ? NFTSCAN_POLYGON_BASE_API
      : NFTSCAN_BASE_API_ENDPOINT;
  const { data, error } = useSWR<any>(
    baseURL + `account/own/all/${address}?show_attribute=true`,
    NFTSCANFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollectionWidget = (props) => {
  const { identity, onShowDetail, network } = props;
  const { data, isLoading, isError } = useCollections(
    identity.addresses?.eth ?? identity.owner,
    network
  );
  const [detailMode, setDetailMode] = useState(false);
  const toCertainNFT = (address: string) => {
    localStorage.setItem("nft_anchor", address);
    setDetailMode(true);
  };

  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;

    return null;
  }, [isLoading, isError]);
  if (!data || !data.data || !data.data.length) return null;

  return (
    <>
      <div className="profile-widget profile-widget-nft">
        <ExpandController
          expand={detailMode}
          onToggle={() => setDetailMode(!detailMode)}
        />
        <div
          className="platform-icon"
          style={{
            background: SocialPlatformMapping(PlatformType.twitter)?.color,
          }}
        >
          <SVG src="/icons/icon-view.svg" width={24} height={24} />
        </div>
        <div className="platform-title">🖼 NFT Collections</div>
        {(detailMode && (
          <NFTCollections data={data} onShowDetail={onShowDetail} />
        )) || (
          <div className="widgets-collection-list">
            {getBoundaryRender() ||
              data.data.map((x, idx) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toCertainNFT(x.contract_address);
                  }}
                  className="collection-item"
                  key={idx}
                >
                  <NFTAssetPlayer
                    className="collection-img"
                    src={resolveIPFS_URL(x.logo_url)}
                    alt={x.contract_name}
                  />
                  <div className="collection-name text-assistive">
                    {x.contract_name}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export const NFTCollectionWidget = memo(RenderNFTCollectionWidget);
