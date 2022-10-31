import { resolve } from "node:path/win32";
import { memo } from "react";
import SVG from "react-inlinesvg";
import useSWR from "swr";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
function useAsset(address: string, tokenId: string | number) {
  const { data, error } = useSWR<any>(
    NFTSCAN_BASE_API_ENDPOINT + `assets/${address}/${tokenId}`,
    NFTSCANFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
const NFTDialogRender = (props) => {
  const { open, onClose, asset } = props;
  const { data, isLoading, isError } = useAsset(
    asset.asset.contract_address,
    asset.asset.token_id
  );

  if (isLoading || !data)
    return <div className="panel-container">Loading...</div>;
  if (isError) return <div className="panel-container">failed to load</div>;

  const _asset = data.data;
  const metadata = JSON.parse(_asset.metadata_json);
  const mediaurl = resolveIPFS_URL(metadata.image);
  console.log(metadata, "metadata");
  return (
    <div className="panel-container" style={{ overflow: "hidden auto" }}>
      <div className="close-icon-box" onClick={onClose}>
        <SVG className="close-icon" src="icons/icon-close.svg" />
      </div>

      <div className="nft-dialog-basic">
        <img className="nft-dialog-asset-player" src={mediaurl} alt="avatar" />
        <div className="nft-dialog-info">
          <div className="nft-dialog-collection">
            <img
              className="avatar"
              src={asset.collection.url}
              alt="collection"
            />
            <div className="title">{asset.collection.name}</div>
          </div>
          <div className="nft-name">{metadata.name}</div>
          <button className="form-button btn " style={{ position: "relative" }}>
            <SVG
              src={"/icons/social-opensea.svg"}
              width={24}
              height={24}
              className="icon"
            />
          </button>
        </div>
      </div>
      <div className="nft-dialog-scroll-box">
        <div className="nft-dialog-des-box">
          <div className="common-title">Description</div>
          <div className="description-content">{metadata.description}</div>
        </div>
        {metadata.attributes && (
          <div className="nft-dialog-des-box">
            <div className="common-title">Attributes</div>
            <div className="traits-box">
              {metadata.attributes.map((x, idx) => {
                return (
                  <div key={idx} className="traits-card">
                    <div className="trait-type">{x.trait_type}</div>
                    <div className="trait-value">{x.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const NFTDialog = memo(NFTDialogRender);
