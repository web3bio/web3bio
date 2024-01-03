import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import Link from "next/link";
import { formatText } from "../../utils/utils";
export default function PhilandModalContent({ data, onClose, profile }) {
  return (
    <>
      <div id="nft-dialog" className="nft-preview">
        <div className="preview-container">
          <div
            className="preview-overlay"
            style={{
              backgroundImage: "url(" + data.imageurl + ")",
            }}
            onClick={onClose}
          ></div>
          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
          <div className="preview-image preview-image-poap">
            <NFTAssetPlayer
              className={"img-container"}
              type={"image/png"}
              src={data.imageurl}
              alt={data.name}
              placeholder={true}
            />
          </div>
          <div className="preview-content">
            <div className="panel-widget">
              <div className="panel-widget-content">
                <div
                  className="nft-header-collection collection-title mb-4"
                  style={{
                    gap: ".25rem",
                    alignItems: "center",
                  }}
                >
                  <SVG
                    className="collection-logo"
                    src="../icons/icon-phi.svg"
                    width={24}
                    height={32}
                  />
                  <div className="collection-name text-ellipsis">Phi Land</div>
                </div>
                <div className="nft-header-name h4">{data.name}</div>
                <div className="nft-header-description mt-4 mb-4">
                  {profile.description}
                </div>
                {data.rank.rank && (
                  <div className="phi-rank">
                    <div className="icon">&#127942;</div>
                    <div className="rank-label">
                      <strong>{data.rank.rank}</strong> # {data.rank.tokenid}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="panel-widget">
              <div className="panel-widget-title">Phi Land links</div>
              <div className="panel-widget-content">
                <div className="panel-widget-list">
                  {data.links.map((x) => {
                    return (
                      <div key={x.url} className="widget-list-item">
                        <div className="list-item-left">{x.title}</div>
                        <Link
                          href={x.url}
                          target="_blank"
                          className="list-item-right"
                        >
                          {formatText(x.url, 15)}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
