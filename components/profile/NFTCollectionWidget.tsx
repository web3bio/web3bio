import { memo, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";
import { _fetcher } from "../apis/ens";
import { SIMPLE_HASH_URL } from "../apis/simplehash";
import _ from "lodash";

function useNFTs(address: string) {
  const { data, error } = useSWR<any>(
    SIMPLE_HASH_URL +
      `/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${address}`,
    _fetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollectionWidget = (props) => {
  const { identity, onShowDetail } = props;
  const [collections, setCollections] = useState([]);
  const { data: nftsData } = useNFTs(identity.addresses?.eth ?? identity.owner);
  const [expand, setExpand] = useState(false);
  const scrollContainer = useRef(null);

  useEffect(() => {
    if (nftsData && nftsData.nfts.length > 0) {
      const unionCollections = nftsData.nfts.reduce((pre, x) => {
        if (x.collection.spam_score <= 75) {
          pre.push({
            ...x.collection,
            id: x.collection.collection_id,
            assets: [],
          });
        }
        return pre;
      }, []);
      setCollections(_.uniqBy(unionCollections, "collection_id"));
    }
  }, [nftsData]);

  useEffect(() => {
    if (collections.length > 0) {
      nftsData.nfts.forEach((i) => {
        const idx = collections.findIndex(
          (x) => x.id.toLowerCase() === i.collection.collection_id.toLowerCase()
        );
        if (idx === -1) return;
        if (_.some(collections[idx].assets, i)) return;
        collections[idx].assets.push(i);
      });
    }
  }, [collections]);

  if (!collections.length) return null;
  return (
    <div
      ref={scrollContainer}
      className={`${
        collections.length > 8 ? "profile-widget-full" : "profile-widget-half"
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
          data={collections}
          onShowDetail={onShowDetail}
        />
      </div>
    </div>
  );
};

export const NFTCollectionWidget = memo(RenderNFTCollectionWidget);
