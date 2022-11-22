import { memo, useEffect, useState } from "react";
import useSWR from "swr";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { CollectionSwitcher } from "./CollectionSwitcher";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { Loading } from "../shared/Loading";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { isValidJson } from "../../utils/utils";

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

  useEffect(() => {
    if (data && data.data) {
      setCollections(
        data.data.map((x) => ({
          key: x.contract_address,
          name: x.contract_name,
          url: x.logo_url,
        }))
      );
      if (anchorName) {
        const anchorElement = document.getElementById(anchorName);
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    }
  }, [data, anchorName]);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.data) return <Empty />;

  const resolveMediaURL = (asset) => {
    if (asset && asset.metadata_json && isValidJson(asset.metadata_json)) {
      const json = JSON.parse(asset.metadata_json);
      const origin = json.image || json.content_uri;
      if (origin) {
        return origin.includes("base64")
          ? origin
          : resolveIPFS_URL(origin);
      }
    }
    if (asset && ["text/mp4"].includes(asset.content_type)) {
      return resolveIPFS_URL(asset.content_uri ?? asset.image_uri);
    }
    return resolveIPFS_URL(asset.image_uri ?? asset.content_uri);
  };
  console.log(data.data, "collections");
  return (
    <>
      {collections && collections.length && (
        <CollectionSwitcher
          collections={collections}
          currentSelect={activeCollection ?? collections[0]}
          onSelect={(v) => {
            setActiveCollection(v);
            setAnchorName(v.key);
          }}
        />
      )}
      <div className="nft-collection">
        <div className="nft-collection-list">
          {data.data.map((x, idx) => {
            return (
              <div className="nft-collection-item" key={idx} id={x.contract_address}>
                <div className="collection-title">
                  <NFTAssetPlayer
                    type={"image/png"}
                    className="collection-logo"
                    src={x.logo_url}
                  />
                  <div className="collection-name"> {x.contract_name}</div>
                </div>
                <div className="nft-list">
                  {x.assets.map((y, ydx) => {
                    const mediaURL = resolveMediaURL(y);
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
                          })
                        }
                      >
                        <div className="nft-item">
                          <NFTAssetPlayer
                            className={"img-container"}
                            type={"image/png"}
                            src={mediaURL}
                          />
                          <div className="collection-name">{x.contract_name}</div>
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
