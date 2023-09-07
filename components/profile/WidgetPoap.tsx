"use client";
import { useCallback } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { POAPFetcher, POAP_END_POINT } from "../apis/poap";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

function usePoaps(address: string, fromServer: boolean) {
  const { data, error } = useSWR(`${POAP_END_POINT}${address}`, POAPFetcher, {
    suspense: !fromServer,
  });
  return {
    data: data || [],
    isLoading: !error && !data,
    isError: error,
  };
}

export default function WidgetPoap(props) {
  const { address, onShowDetail, fromServer, setEmpty } = props;
  const { data, isLoading, isError } = usePoaps(address, fromServer);

  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;
    return null;
  }, [isLoading, isError]);

  if (!data || !data.length) {
    setEmpty(true);
    return null;
  }
  return (
    <div className="profile-widget-full" id="poap">
      <div className="profile-widget profile-widget-poap">
        <h2 className="profile-widget-title">
          <div className="platform-icon mr-2">
            <SVG src={`../icons/icon-poap.svg`} width={32} height={32} />
          </div>
          POAP
        </h2>
        <div className="text-assistive">
          POAP are the bookmarks for your life. Mint the most important memories
          of your life as digital collectibles (NFTs) forever on the blockchain.
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
    </div>
  );
}
