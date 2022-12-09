import { memo, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { CollectionSwitcher } from "./CollectionSwitcher";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { throttle } from "../../utils/utils";
import { Loading } from "../shared/Loading";
import { useRouter } from "next/router";

function useCollections(address: string) {
  const { data, error } = useSWR<any>(
    NFTSCAN_BASE_API_ENDPOINT + `account/own/all/${address}?erc_type=erc721`,
    NFTSCANFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderNFTCollections = (props) => {
  const { onShowDetail, identity } = props;
  const [collections, setCollections] = useState([]);
  const [anchorName, setAnchorName] = useState("");
  const { data, isLoading, isError } = useCollections(identity.identity);
  const [activeCollection, setActiveCollection] = useState(null);
  const scrollContainer = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const container = scrollContainer.current;
    if (data && data.data) {
      setCollections(
        data.data.map((x) => ({
          key: x.contract_address,
          name: x.contract_name,
          url: x.logo_url,
        }))
      );
      if (router.isReady && router.query.a) {
        setAnchorName(router.query.a as string);
        setActiveCollection(router.query.a as string);
      }

      if (anchorName) {
        const anchorElement = document.getElementById(anchorName);
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
          if (router.query.a) {
            router.replace({
              pathname: "",
              query: {
                domain: router.query.domain,
              },
            });
          }
        }
      }
      const lazyLoad = () => {
        const lazyloadImages = container.querySelectorAll("img");
        const imageObserver = new IntersectionObserver(function (
          entries,
          overver
        ) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const img = entry.target as any;
              img.src = img.dataset.src;
              imageObserver.unobserve(img);
            }
          });
        });
        lazyloadImages.forEach(function (image) {
          imageObserver.observe(image);
        });
      };
      if (container) {
        container.addEventListener("scroll", () => throttle(lazyLoad, 100));
      }
      lazyLoad();
      return () =>
        container.removeEventListener("scroll", () => throttle(lazyLoad, 100));
    }
  }, [data, anchorName, router]);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.data) return <Empty />;

  const resolveMediaURL = (asset) => {
    if (asset) {
      return asset.startsWith("data:", "https:")
        ? asset
        : resolveIPFS_URL(asset);
    }
    return "";
  };

  return (
    <>
      {collections && collections.length > 0 && (
        <CollectionSwitcher
          collections={collections}
          currentSelect={activeCollection ?? collections[0]}
          onSelect={(v) => {
            setActiveCollection(v);
            setAnchorName(v);
          }}
        />
      )}
      <div ref={scrollContainer} className="nft-collection">
        <div className="nft-collection-list">
          {data.data.map((x, idx) => {
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
