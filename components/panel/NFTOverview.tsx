import { memo } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { useRouter } from "next/router";
import { TabsMap } from "./IdentityPanel";

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
  const router = useRouter();
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.data) return null;

  return (
    <div className="nft-collection-container">
      <div className="nft-list">
        {isLoading ? (
          <Loading />
        ) : (
          data.data.map((x, idx) => {
            return (
              <NFTAssetPlayer
                onClick={() => {
                  router.replace({
                    pathname: "",
                    query: {
                      s: router.query.s,
                      d: router.query.d,
                      t: TabsMap.nfts.key,
                      a: x.contract_address,
                    },
                  });
                }}
                key={idx}
                className="collection-nft-item"
                src={resolveIPFS_URL(x.logo_url)}
                alt={x.contract_name}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export const NFTOverview = memo(RenderNFTOverview);
