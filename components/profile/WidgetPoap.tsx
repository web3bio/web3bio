"use client";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { POAPFetcher, POAP_ENDPOINT } from "../apis/poap";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useSelector } from "react-redux";
import { AppState } from "../../state";

function usePoaps(address: string, fromServer: boolean, shouldSkip: boolean) {
  const { data, error, isValidating } = useSWR(
    shouldSkip ? null : `${POAP_ENDPOINT}${address}`,
    POAPFetcher,
    {
      suspense: !fromServer,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );
  return {
    data: data || [],
    isLoading: isValidating,
    isError: error,
  };
}

export default function WidgetPoap(props) {
  const { address, onShowDetail, fromServer, setEmpty } = props;
  const cached = useSelector<AppState, any>(
    (state) => state.widgets.data[address]?.poaps.data
  );
  const { data, isLoading, isError } = usePoaps(
    address,
    fromServer,
    cached?.length > 0
  );


  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;
    return null;
  }, [isLoading, isError]);
  useEffect(() => {
    if (!isLoading && !data.length) {
      setEmpty(true);
    }
  }, [data, isLoading, setEmpty]);
  if (!data || !data.length) return null;

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
        <div className="widget-collection-list noscrollbar">
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
