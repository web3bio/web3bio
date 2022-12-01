import { memo } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";

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
  const { identity } = props;
  const { data, isLoading, isError } = useCollections(identity.identity);

  if (isError) return <Error text={isError} />;
  if (!data || !data.data) return null;
  console.log(data, "ggg");

  return (
    <div className="nft-collection-container">
      <div className="nft-collection-title">COLLECTIONS</div>

      <div className="nft-list">
        {isLoading ? (
          <Loading />
        ) : (
          data.data.map((x, idx) => {
            return (
              <NFTAssetPlayer
                key={idx}
                className="collection-nft-item"
                src={resolveIPFS_URL(x.logo_url)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export const NFTOverview = memo(RenderNFTOverview);
