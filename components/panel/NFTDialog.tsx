import { memo } from "react";
import SVG from "react-inlinesvg";
import useSWR from "swr";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { isValidJson } from "../../utils/utils";
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
  const { onClose, asset} = props;
  const { data, isLoading, isError } = useAsset(
    asset.asset.contract_address,
    asset.asset.token_id
  );
  const resolveOpenseaLink = `https://opensea.io/assets/ethereum/${asset.asset.contract_address}/${asset.asset.token_id}`;

  if (isError) return <Error text={isError} />;
  if (!data) return null;
  const _asset = data.data;
  const metadata = isValidJson(_asset.metadata_json)
    ? JSON.parse(_asset.metadata_json)
    : null;
  
  console.log("current asset", asset);
  return (
    <>
      <div className="nft-panel">
        <div className="panel-container">
          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
          <div className="panel-header">
            <NFTAssetPlayer
              className={"img-container"}
              type={asset.asset.content_type}
              src={asset.mediaURL}
              contentUrl={asset.contentURL}
              alt={asset.asset.name}
            />
            <div className="panel-header-content">
              <div className="nft-header-collection collection-title">
                <NFTAssetPlayer
                  type={"image/png"}
                  className="collection-logo"
                  src={asset.collection.url}
                  alt={asset.collection.name}
                />
                <div className="collection-name text-ellipsis"> {asset.collection.name}</div>
              </div>
              <div className="nft-header-name">
                {asset.asset.name || `#${asset.asset.token_id}`}
              </div>
              <div className="nft-header-actions">
                <a
                  href={resolveOpenseaLink}
                  className="btn mr-2"
                  title="Open OpenSea"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SVG
                    src={"/icons/social-opensea.svg"}
                    width={20}
                    height={20}
                    className="icon"
                  />
                  <span className="ml-1">OpenSea</span>
                </a>
                <a
                  href={`https://etherscan.io/token/${asset.asset.contract_address}?a=${asset.asset.token_id}`}
                  className="btn"
                  title="Open Etherscan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SVG
                    src={"/icons/icon-ethereum.svg"}
                    width={20}
                    height={20}
                    className="icon"
                  />
                  <span className="ml-1">Etherscan</span>
                </a>
              </div>
            </div>
            { metadata?.description && (
              <div className="panel-widget">
                <div className="panel-widget-title">Description</div>
                <div className="panel-widget-content">
                  {metadata?.description}
                </div>
              </div>
            )}
            {metadata.attributes && metadata.attributes.length > 0 && (
              <div className="panel-widget">
                <div className="panel-widget-title">Attributes</div>
                <div className="panel-widget-content">
                  <div className="traits-cards">
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
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
};

export const NFTDialog = memo(NFTDialogRender);
