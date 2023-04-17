import { memo, useCallback, useState } from "react";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/platform";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTPanel } from "./NFTPanel";
import { Empty } from "../shared/Empty";
import { ExpandController } from "./ExpandController";

function useCollections(address: string) {
  const { data, error } = useSWR<any>(
    NFTSCAN_BASE_API_ENDPOINT + `account/own/all/${address}?erc_type=erc721`,
    NFTSCANFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollectionWidget = (props) => {
  const { identity, onShowDetail } = props;
  const { data, isLoading, isError } = useCollections(
    identity.addresses?.eth ?? identity.owner
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
  if (!data || !data.data) return null;
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
          <NFTPanel
            onShowDetail={onShowDetail}
            address={identity.owner}
            network={PlatformType.ens}
          />
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
