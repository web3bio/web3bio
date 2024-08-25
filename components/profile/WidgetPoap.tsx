"use client";
import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
import { resolveIPFS_URL } from "../utils/ipfs";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { WidgetType } from "../utils/widgets";
import { updatePoapsWidget } from "../state/widgets/reducer";
import { POAP_ENDPOINT, POAPFetcher } from "../utils/api";

function usePoaps(address: string) {
  const { data, error, isValidating } = useSWR(
    `${POAP_ENDPOINT}${address}`,
    POAPFetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data: data || [],
    isLoading: isValidating,
    isError: error,
  };
}

export default function WidgetPOAP({ address, openModal }) {
  const { data, isLoading } = usePoaps(address);
  const dispatch = useDispatch();
  const getBoundaryRender = useCallback(() => {
    if (isLoading)
      return (
        <div className="widget-loading">
          <Loading />
        </div>
      );
    return null;
  }, [isLoading]);
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updatePoapsWidget({ isEmpty: !data?.length, initLoading: false })
      );
    }
  }, [data, isLoading, dispatch]);

  const memoizedPOAPItems = useMemo(() => {
    if (!data || !data.length) return null;

    return data.map(({event, tokenId, chain}) => (
      <div
        key={tokenId}
        className="poap-item c-hand"
        onClick={() => {
          openModal({
            asset: {  
              event,
              tokenId,
              chain,
            },
          });
        }}
      >
        <NFTAssetPlayer
          className="img-container"
          src={`${resolveIPFS_URL(event.image_url)}?size=small`}
          alt={event.name}
          height={64}
          width={64}
          placeholder={true}
        />
        <div className="text-assistive">{event.name}</div>
      </div>
    ));
  }, [data, openModal]);

  if (!data || !data.length) {
    return null;
  }

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("POAP Data:", data);
  // }

  return (
    <div className="profile-widget-full" id={WidgetType.poaps}>
      <div className="profile-widget profile-widget-poap">
        <div className="profile-widget-header">
          <h2
            className="profile-widget-title"
            title="Proof of Attendance Protocol (POAP)"
          >
            <span className="emoji-large mr-2">🔮 </span>
            POAPs
          </h2>
          <h3 className="text-assistive">
            POAP is a curated ecosystem for the preservation of memories. By
            checking-in at different events, POAP collectors build a digital
            scrapbook where each POAP is an anchor to a place and space in time.
          </h3>
          <div className="widget-action">
            <div className="action-icon">
              <Link
                className="btn btn-sm btn-action"
                title="More on POAPs"
                href={`https://app.poap.xyz/scan/${address}`}
                rel="noopener noreferrer"
                target={"_blank"}
              >
                <SVG src="icons/icon-open.svg" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="widget-poap-list noscrollbar">
          {getBoundaryRender() || memoizedPOAPItems}
        </div>
      </div>
    </div>
  );
}
