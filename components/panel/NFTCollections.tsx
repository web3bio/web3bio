import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import fallbackIcon from "/logo-web5bio.png";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { CollectionSwitcher } from "./CollectionSwitcher";
import { resolveIPFS_URL } from "../../utils/ipfs";

function useNFTCollections(address: string) {
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

export const NFTCollections = (props) => {
  const { onShowDetail } = props;
  const [collections, setCollections] = useState([]);
  const { data, isLoading, isError } = useNFTCollections(
    "0x934b510d4c9103e6a87aef13b816fb080286d649"
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>failed to load</div>;

  return (
    <div className="nft-collection-container">
      <CollectionSwitcher
        collections={collections}
        currentSelect={collections[0]}
        onSelect={(e) => console.log("onSelect:", encodeURI)}
      />

      <div className="nft-collection-list">
        {data.data.map((x, idx) => {
          return (
            <div className="collection-item" key={idx}>
              <div className="nft-collection-title-box">
                <img className="collection-logo" src={x.logo_url} alt="" />
                <div className="nft-collection-title"> {x.contract_name}</div>
              </div>
              <div className="nft-item-coantiner">
                {x.assets.map((y, ydx) => {
                  console.log(y, "asset_url", x);
                  const mediaURL = resolveIPFS_URL(
                    y.image_uri ?? y.content_uri
                  );
                  return (
                    <div
                      key={ydx}
                      className="detail-item"
                      onClick={() => onShowDetail({
                        collection:{
                          url: x.logo_url,
                          name:x.contract_name
                        },
                        asset:y
                      })}
                    >
                      <div className="img-container">
                        <img src={mediaURL} alt="nft-icon" />
                      </div>
                      <div className="collection-name">{x.contract_name}</div>
                      <div className="nft-name">{y.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
