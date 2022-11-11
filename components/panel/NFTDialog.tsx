import { memo } from "react";
import SVG from "react-inlinesvg";
import useSWR from "swr";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { NFTSCANFetcher, NFTSCAN_BASE_API_ENDPOINT } from "../apis/nftscan";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
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
  const { onClose, asset } = props;
  const { data, isLoading, isError } = useAsset(
    asset.asset.contract_address,
    asset.asset.token_id
  );
  const resolveOpenseaLink = `https://opensea.io/assets/ethereum/${asset.asset.contract_address}/${asset.asset.token_id}`;

  if (isError) return <Error text={isError} />;
  if (!data) return <Empty />;
  const _asset = data.data;
  const metadata = JSON.parse(_asset.metadata_json);
  const mediaurl =
    resolveIPFS_URL(asset.mediaURL) || metadata
      ? resolveIPFS_URL(metadata.image)
      : null;
  return (
    <div className="panel-container" style={{ overflow: "hidden auto" }}>
      <div className="close-icon-box" onClick={onClose}>
        <SVG className="close-icon" src="icons/icon-close.svg" />
      </div>

      <div className="nft-dialog-basic">
        <NFTAssetPlayer
          type={_asset.content_type || 'image/png'}
          className="nft-dialog-asset-player"
          src={mediaurl}
        />
        <div className="nft-dialog-info">
          <div className="nft-dialog-collection">
            <picture>
              <source srcSet={asset.collection.url} />
              <img
                className="avatar"
                src={asset.collection.url}
                alt="collection"
              />
            </picture>
            <div className="title">{asset.collection.name}</div>
          </div>
          <div className="nft-name">
            {asset.asset.name || `#${asset.asset.token_id}`}
          </div>
          <button
            onClickCapture={() => window.open(resolveOpenseaLink, "_blank")}
            className="form-button btn "
            style={{ position: "relative" }}
          >
            <SVG
              src={"/icons/social-opensea.svg"}
              width={24}
              height={24}
              className="icon"
            />
          </button>
        </div>
      </div>
      {isLoading || !metadata ? (
        <Loading />
      ) : (
        <div className="nft-dialog-scroll-box">
          <div className="nft-dialog-des-box">
            <div className="common-title">Description</div>
            <div className="description-content">
              {metadata && metadata.description ? (
                metadata.description
              ) : (
                <Empty text="No Description" />
              )}
            </div>
          </div>

          {metadata.attributes && metadata.attributes.length > 0 && (
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
      )}
    </div>
  );
};

export const NFTDialog = memo(NFTDialogRender);
