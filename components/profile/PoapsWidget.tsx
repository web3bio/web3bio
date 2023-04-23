import { memo, useCallback } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { POAPFetcher, POAP_END_POINT } from "../apis/poap";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

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

const RenderPoapWidget = (props) => {
  const { identity, onShowDetail } = props;
  const { data, isLoading, isError } = usePoaps(
    identity.addresses?.eth ?? identity.owner
  );

  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;
    return null;
  }, [isLoading, isError]);
  
  if (!data || !data.length) return null;
  return (
    <div className="profile-widget profile-widget-poap">
      <div className="profile-widget-title">
        <SVG src="../icons/icon-poap.svg" width={32} height={32} />
        POAP
      </div>
      <div className="widgets-collection-list noscrollbar">
        {getBoundaryRender() ||
          data.map((x, idx) => {
            return (
              <div
                key={idx}
                className="poap-item c-hand"
                onClick={(e) => {
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
                <NFTAssetPlayer
                  className="img-container"
                  src={`${resolveIPFS_URL(x.event.image_url)}?size=small`}
                  alt={x.event.name}
                  height={80}
                  width={80}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export const PoapWidget = memo(RenderPoapWidget);
