import { memo, useRef, useState } from "react";
import { PlatformType } from "../../utils/platform";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
  NFTSCAN_POLYGON_BASE_API,
} from "../apis/nftscan";
import useSWR from "swr";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";

function useCollections(address: string, network: PlatformType) {
  const baseURL =
    network === PlatformType.lens
      ? NFTSCAN_POLYGON_BASE_API
      : NFTSCAN_BASE_API_ENDPOINT;
  const { data, error } = useSWR<any>(
    baseURL + `account/own/all/${address}?show_attribute=true`,
    NFTSCANFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollectionWidget = (props) => {
  const { identity, onShowDetail, network } = props;
  const { data } = useCollections(
    identity.addresses?.eth ?? identity.owner,
    network
  );
  const [expand, setExpand] = useState(false);
  const scrollContainer = useRef(null);

  if (!data || !data.data || !data.data.length) return null;

  return (
    <div
      ref={scrollContainer}
      className="profile-widget-full"
      id="nft"
    >
      <div className={`profile-widget profile-widget-nft${expand? ' active': ''}`}>
        <ExpandController
          expand={expand}
          onToggle={() => {
            setExpand(!expand);
          }}
        />
        <div className="profile-widget-title">
          <span className="emoji-large mr-2">🖼</span>
          NFT Collections
        </div>
        <NFTCollections
          handleScrollToAsset={(ref, v) => {
            setExpand(true);
            setTimeout(() => {
              if (ref) {
                const anchorElement = document.getElementById(v);
                if (!anchorElement) return;
                const top = anchorElement.offsetTop;
                ref.current.scrollTo({
                  top: top,
                  behavior: "smooth",
                });
              }
            }, 100);
          }}
          parentScrollRef={scrollContainer}
          expand={expand}
          data={data}
          onShowDetail={onShowDetail}
        />
      </div>
    </div>
  );
};

export const NFTCollectionWidget = memo(RenderNFTCollectionWidget);
