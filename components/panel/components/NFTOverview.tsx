import { memo } from "react";
import useSWR from "swr";
import { resolveIPFS_URL } from "../../../utils/ipfs";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../../apis/nftscan";
import { Error } from "../../shared/Error";
import { Loading } from "../../shared/Loading";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

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

const RenderNFTOverview = (props) => {
  const { identity, toNFT } = props;
  const { data, isLoading, isError } = useCollections(identity.identity);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.data) return null;

  return (
    <div className="profile-widget widget-nft">
      <div className="profile-widget-title">NFT COLLECTIONS</div>
      <div className="profile-widget-container">
        <div className="collection-switcher">
          <div className="collection-list">
            {data.data.map((x, idx) => (
              <div
                onClick={()=>toNFT(x.contract_address)}
                className="collection-item"
                key={idx}
              >
                <NFTAssetPlayer className="collection-img" src={resolveIPFS_URL(x.logo_url)} alt={x.contract_name} />
                <div className="collection-name text-assistive">{x.contract_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NFTOverview = memo(RenderNFTOverview);
