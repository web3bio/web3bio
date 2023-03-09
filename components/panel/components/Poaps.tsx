import { memo } from "react";
import useSWR from "swr";
import { resolveIPFS_URL } from "../../../utils/ipfs";
import { POAPFetcher, POAP_END_POINT } from "../../apis/poap";
import { Error } from "../../shared/Error";
import { Loading } from "../../shared/Loading";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

function usePoaps(address: string, initialData) {
  const { data, error } = useSWR<any>(
    `${POAP_END_POINT}${address}`,
    POAPFetcher,
    {
      fallbackData: initialData,
    }
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderPoaps = (props) => {
  const { identity, onShowDetail, initialData } = props;
  const { data, isLoading, isError } = usePoaps(identity.identity, initialData);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.length) return null;
  return (
    <div className="profile-widget widget-poap">
      <div className="profile-widget-title">POAPS</div>
      <div className="profile-widget-container">
        <div className="nft-collection-list">
          <div className="nft-list">
            {data.map((x, idx) => {
              return (
                <div
                  key={idx}
                  className="nft-container c-hand"
                  onClick={() => {
                    onShowDetail({
                      collection: {
                        url: "",
                        name: "",
                      },
                      address: x.owner,
                      tokenId: x.tokenId,
                      asset: x,
                      mediaURL: resolveIPFS_URL(x.event.image_url),
                      contentURL: resolveIPFS_URL(x.event.image_url),
                    });
                  }}
                >
                  <div className="nft-item">
                    <NFTAssetPlayer
                      className="img-container"
                      src={resolveIPFS_URL(x.event.image_url)}
                      alt={x.event.name}
                    />
                    <div className="collection-name">{x.event.start_date}</div>
                    <div className="nft-name">{x.event.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Poaps = memo(RenderPoaps);
