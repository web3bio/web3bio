import { memo, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { PlatformType } from "../../../utils/type";
import { resolveMediaURL } from "../../../utils/utils";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
  NFTSCAN_POLYGON_BASE_API
} from "../../apis/nftscan";
import { Empty } from "../../shared/Empty";
import { Error } from "../../shared/Error";
import { Loading } from "../../shared/Loading";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import { CollectionSwitcher } from "./CollectionSwitcher";

function useCollections(address: string, network: string, initialData) {
  const baseURL =
    network === PlatformType.lens
      ? NFTSCAN_POLYGON_BASE_API
      : NFTSCAN_BASE_API_ENDPOINT;
  const url = baseURL + `account/own/all/${address}?erc_type=erc721`;
  const { data, error } = useSWR<any>(url, NFTSCANFetcher, {
    fallbackData: initialData,
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollections = (props) => {
  const { onShowDetail, identity, network, initialData } = props;
  const [collections, setCollections] = useState([]);
  const [anchorName, setAnchorName] = useState("");
  const { data, isLoading, isError } = useCollections(
    network === PlatformType.lens ? identity.ownedBy : identity.identity,
    network,
    initialData
  );
  const [renderData, setRenderData] = useState([]);

  const [activeCollection, setActiveCollection] = useState(null);
  const scrollContainer = useRef(null);
  useEffect(() => {
    setRenderData(
      initialData && initialData.length > 0 ? initialData : data.data
    );

    const container = scrollContainer.current;
    if (renderData) {
      setCollections(
        renderData.map((x) => ({
          key: x.contract_address,
          name: x.contract_name,
          url: x.logo_url,
        }))
      );
      const _anchor = localStorage.getItem("nft_anchor");
      if (_anchor) {
        setAnchorName(_anchor);
        setActiveCollection(_anchor);
        localStorage.removeItem("nft_anchor");
      }

      if (anchorName) {
        const anchorElement = document.getElementById(anchorName);
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
      const judgeActiveCollection = () => {
        if (renderData) {
          const nav_contentRect = container.getBoundingClientRect();
          const groupList = Array.from(
            renderData.map((x) => document.getElementById(x.contract_address))
          );
          if (nav_contentRect) {
            groupList.map((item: any) => {
              const itemReact = item.getBoundingClientRect();
              if (itemReact.y <= 250 && itemReact.y + itemReact.height > 250) {
                if (activeCollection !== item.id) {
                  setActiveCollection(item.id);
                }
              }
            });
          }
          // todo: to improve
          const swticherContainer = document.getElementById(
            "collection-switcher-box"
          );
          const activeElement = document.getElementById(
            `collection_${activeCollection}`
          );
          if (!swticherContainer || !activeElement) return;
          const activeIndex = collections.findIndex(
            (x) => x.key === activeCollection
          );
          swticherContainer.scrollTo({
            left: activeIndex * activeElement.getBoundingClientRect().width,
            behavior: "smooth",
          });
        }
      };

      if (container) {
        container.addEventListener("wheel", judgeActiveCollection);
      }
      return () =>
        container.removeEventListener("wheel", judgeActiveCollection);
    }
  }, [initialData, anchorName, activeCollection, data]);

  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!renderData) return <Empty />;
  return (
    <>
      {collections && collections.length > 0 && (
        <CollectionSwitcher
          collections={collections}
          currentSelect={activeCollection ?? collections[0].key}
          onSelect={(v) => {
            setActiveCollection(v);
            setAnchorName(v);
          }}
        />
      )}
      <div ref={scrollContainer} className="nft-collection">
        <div className="nft-collection-list">
          {renderData.map((x, idx) => {
            return (
              <div
                className="nft-collection-item"
                key={idx}
                id={x.contract_address}
              >
                <div className="collection-title">
                  <NFTAssetPlayer
                    type={"image/png"}
                    className="collection-logo"
                    src={x.logo_url}
                    alt={x.contract_name}
                  />
                  <div className="collection-name text-ellipsis">
                    {x.contract_name}
                  </div>
                </div>
                <div className="nft-list">
                  {x.assets.map((y, ydx) => {
                    const mediaURL = resolveMediaURL(y.image_uri);
                    const contentURL = resolveMediaURL(y.content_uri);
                    return (
                      <div
                        key={ydx}
                        className="nft-container c-hand"
                        onClick={() =>
                          onShowDetail({
                            collection: {
                              url: x.logo_url,
                              name: x.contract_name,
                            },
                            asset: y,
                            mediaURL: mediaURL,
                            contentURL: contentURL,
                          })
                        }
                      >
                        <div className="nft-item">
                          <NFTAssetPlayer
                            className={"img-container"}
                            type={y.content_type}
                            src={mediaURL}
                            contentUrl={contentURL}
                            alt={x.contract_name + " - " + y.name}
                          />
                          <div className="collection-name">
                            {x.contract_name}
                          </div>
                          <div className="nft-name">{y.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const NFTCollections = memo(RenderNFTCollections);
