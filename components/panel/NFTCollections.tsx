import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { CollectionSwitcher } from "./CollectionSwitcher";

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
  const {
    list = [1, 2, 3, 4, 5, 6],
    isDetail,
    detailList = [1, 2, 3, 4, 5],
  } = props;
  const [collections, setCollections] = useState([]);
  const { data, isLoading, isError } = useNFTCollections(
    "0x934b510d4c9103e6a87aef13b816fb080286d649"
  );

  useEffect(() => {
    if (!data || !data.data) return;
    setCollections(
      data.data.map((x) => ({
        logoUrl: x.logo_url,
        name: x.contract_name,
        address: x.contract_address,
      }))
    );
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>failed to load</div>;

  return (
    <div className="nft-collection-container">
      <div className="nft-collection-title">NFT COLLECTIONS</div>
      <CollectionSwitcher
        collections={collections}
        currentSelect={collections[0]}
        onSelect={(e) => console.log("onSelect:", encodeURI)}
      />
      {(isDetail && (
        <div className="nft-detail-list">
          {detailList.map((x, idx) => {
            return (
              <div key={idx} className="detail-item">
                <div className="img-container">
                  <img
                    src="https://img.seadn.io/files/04a1b99e1478e40ffbfe5a02f68ae02d.png?fit=max&w=1000"
                    alt=""
                  />
                </div>
                <div className="collection-name">BEANZ Official</div>
                <div className="nft-name">Bean #3270</div>
              </div>
            );
          })}
        </div>
      )) || (
        <div className="nft-list">
          {list.map((x, idx) => {
            return (
              <div key={idx} className="collection-nft-item">
                <img
                  src="https://img.seadn.io/files/4148fc4a3513f9297087bb7d5816d69e.png?fit=max&w=1000"
                  alt="nft-item"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
