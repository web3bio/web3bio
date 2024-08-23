import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import Link from "next/link";
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
          <div className="modal-actions">
            <button className="btn btn-close" onClick={onClose}>
              <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
            </button>
          </div>
          <div className="preview-image">
            <NFTAssetPlayer
              className={"img-container"}
              type={"image/png"}
              src={data.imageurl}
              alt={data.name}
              placeholder={false}
            />
          </div>
          <div className="preview-main">
            <div className="preview-content">
              <div className="panel-section">
                <div className="panel-section-content">
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
                      fill={"#000"}
                      width={24}
                      height={32}
                    />
                    <div className="collection-name text-ellipsis">Phi</div>
                  </div>
                  <div className="nft-header-name h4">{profile.displayName} - Phi Land</div>
                  <div className="btn-group mt-4">
                    <Link
                      href={`https://land.philand.xyz/${profile.identity}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      <SVG src={`../icons/icon-phi.svg`} fill="#121212" width={20} height={20} />
                      <span className="ml-1">Visit Land</span>
                    </Link>
                  </div>
                </div>
              </div>

              {!!data?.links.length && (
                <div className="panel-section">
                  <div className="panel-section-title">Phi links</div>
                  <div className="panel-section-content">
                    <div className="panel-section-list">
                      {data?.links?.map((x) => {
                        return (
                          <div key={x.url} className="widget-list-item">
                            <div className="list-item-left text-bold">{x.title}</div>
                            <Link
                              href={x.url}
                              target="_blank"
                              className="list-item-right"
                            >
                              Link
                              <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
                            </Link>
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
      </div>
    </>
  );
}
