import { memo, useEffect, useRef, useState } from "react";
import { PlatformType } from "../../utils/platform";
import useSWR from "swr";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";
import { _fetcher } from "../apis/ens";
import { SIMPLE_HASH_URL } from "../apis/simplehash";

function useCollections(address: string, network: PlatformType) {
  const queryURL =
    network === PlatformType.lens
      ? `/api/v0/nfts/collections_by_wallets?chains=polygon&wallet_addresses=${address}`
      : `/api/v0/nfts/collections_by_wallets?chains=ethereum&wallet_addresses=${address}`;
  const { data, error } = useSWR<any>(SIMPLE_HASH_URL + queryURL, _fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
function useNFTs(address: string, network: PlatformType) {
  const queryURL =
    network === PlatformType.lens
      ? `/api/v0/nfts/owners?chains=polygon&wallet_addresses=${address}`
      : `/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${address}`;
  const { data, error } = useSWR<any>(SIMPLE_HASH_URL + queryURL, _fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollectionWidget = (props) => {
  const { identity, onShowDetail, network } = props;
  const { data: collectionsData } = useCollections(
    identity.addresses?.eth ?? identity.owner,
    network
  );
  const { data: nftsData } = useNFTs(
    identity.addresses?.eth ?? identity.owner,
    network
  );
  const [renderData, setRenderData] = useState([]);
  const [expand, setExpand] = useState(false);
  const scrollContainer = useRef(null);

  useEffect(() => {
    if (collectionsData && collectionsData.collections.length > 0) {
      setRenderData(
        collectionsData.collections.reduce((pre, x) => {
          if (x.spam_score <= 60) {
            pre.push({
              ...x,
              assets: [],
            });
          }
          return pre;
        }, [])
      );
    }
    if (nftsData && nftsData.nfts.length > 0) {
      const _data = JSON.parse(JSON.stringify(renderData));
      nftsData.nfts.forEach((x) => {
        const index = _data.findIndex(
          (i) => i.id.toLowerCase() === x.collection.collection_id
        );
        if (index !== -1) {
          if (
            _data[index].assets.findIndex((y) => y.token_id === x.token_id) !==
            -1
          )
            return;
          _data[index].assets.push(x);
        }
      });
      setRenderData(_data.filter((x) => x.assets.length > 0));
    }
  }, [collectionsData, nftsData]);

  if (!renderData.length) return null;
  return (
    <div
      ref={scrollContainer}
      className={`${
        collectionsData.collections.length > 8
          ? "profile-widget-full"
          : "profile-widget-half"
      }`}
      id="nft"
    >
      <div
        className={`profile-widget profile-widget-nft${
          expand ? " active" : ""
        }`}
      >
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
            }, 400);
          }}
          parentScrollRef={scrollContainer}
          expand={expand}
          data={renderData}
          onShowDetail={onShowDetail}
        />
      </div>
    </div>
  );
};

export const NFTCollectionWidget = memo(RenderNFTCollectionWidget);
