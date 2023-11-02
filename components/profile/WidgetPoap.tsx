"use client";
import { useCallback, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { POAPFetcher, POAP_ENDPOINT } from "../apis/poap";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { updatePoapsWidget } from "../../state/widgets/action";

function usePoaps(address: string, fromServer: boolean) {
  const { data, error, isValidating } = useSWR(
    `${POAP_ENDPOINT}${address}`,
    POAPFetcher,
    {
      suspense: !fromServer,
      fallbackData: [],
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
  const { address, onShowDetail, fromServer } = props;

  const { data, isLoading, isError } = usePoaps(address, fromServer);
  const dispatch = useDispatch();
  const getBoundaryRender = useCallback(() => {
    if (isLoading)
      return (
        <div className="widget-loading">
          <Loading />
        </div>
      );
    if (isError) return <Error />;
    return null;
  }, [isLoading, isError]);
  useEffect(() => {
    if (!isLoading && data.length) {
      dispatch(updatePoapsWidget({ isEmpty: false }));
    }
  }, [data, isLoading, dispatch]);

  if (!data || !data.length) {
    return null;
  }

  return (
    <div className="profile-widget-full" id="poap">
      <div className="profile-widget profile-widget-poap">
        <h2
          className="profile-widget-title"
          title="Proof of Attendance Protocol (POAP)"
        >
          <span className="emoji-large mr-2">🔮 </span>
          POAPs
        </h2>
        <Link
          className="action-icon btn btn-sm"
          href={`https://app.poap.xyz/scan/${address}`}
          target={"_blank"}
        >
          <span className="action-icon-label">More</span>
          <SVG src="icons/icon-open.svg" width={20} height={20} />
        </Link>
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
                    height={64}
                    width={64}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
