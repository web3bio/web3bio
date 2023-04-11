import { memo, useCallback } from "react";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/platform";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { POAPFetcher, POAP_END_POINT } from "../apis/poap";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
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

const RenderPoapWidget = (props) => {
  const { identity, onShowDetail } = props;
  const { data, isLoading, isError } = usePoaps(
    identity.addresses?.eth ?? identity.owner
  );

  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;
    if (!data || !data.length) return <Empty />;
    return null;
  }, [data, isLoading, isError]);

  return (
    <div className="profile-widget profile-poaps-widgets">
      <div
        className="platform-icon"
        style={{
          background: SocialPlatformMapping(PlatformType.instagram)?.color,
        }}
      >
        <SVG src="/icons/icon-view.svg" width={24} height={24} />
      </div>
      <div className="platform-title">Poaps</div>
      <div className="platform-handle">{identity.displayName}</div>
      <div className="widgets-collection-list">
        {getBoundaryRender() ||
          data.map((x, idx) => {
            return (
              <div
                key={idx}
                className="nft-container c-hand"
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
  );
};

export const PoapWidget = memo(RenderPoapWidget);
