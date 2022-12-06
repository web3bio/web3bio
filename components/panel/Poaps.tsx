import { memo } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { POAPFetcher, POAP_END_POINT } from "../apis/poap";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { Empty } from "../shared/Empty";

function usePoaps(address: string) {
  const { data, error } = useSWR<any>(
    `${POAP_END_POINT}${address}`,
    POAPFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderPoaps = (props) => {
  const { identity } = props;
  const { data, isLoading, isError } = usePoaps(identity.identity);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.length) return <Empty text="there is no poap" />;
  return (
    <div className="nft-collection-container">
      <div className="nft-list">
        {isLoading ? (
          <Loading />
        ) : (
          data.map((x, idx) => {
            return (
              <NFTAssetPlayer
                key={idx}
                className="collection-nft-item"
                src={resolveIPFS_URL(x.event.image_url)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export const Poaps = memo(RenderPoaps);
