import SVG from 'react-inlinesvg'
import { NFTAssetPlayer } from '../shared/NFTAssetPlayer';
import Link from 'next/link'
export default function PoapsModalContent({onClose,asset}) {
  return (
    <>
      <div id="nft-dialog" className="nft-preview">
        <div className="preview-container">
          <div
            className="preview-overlay"
            style={{
              backgroundImage: "url(" + asset.mediaURL + ")",
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
              src={asset.mediaURL}
              alt={asset.asset.event.name}
              placeholder={true}
            />
          </div>
          <div className="preview-content">
            <div className="panel-widget">
              <div className="panel-widget-content">
                <div className="nft-header-collection collection-title mb-4">
                  <SVG
                    className="collection-logo"
                    src="../icons/icon-poap.svg"
                    width={24}
                    height={24}
                    color={"#5E58A5"}
                  />
                  <div className="collection-name text-ellipsis" style={{color: "#5E58A5"}}>POAP</div>
                </div>
                <div className="nft-header-name h4">{asset.asset.event.name}</div>
                <div className="nft-header-description mt-2 mb-4">
                  {asset.asset.event.description}
                </div>
                {asset.asset.event.event_url && (
                  <div className="panel-widget-content mt-4">
                    <Link
                      href={asset.asset.event.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      <SVG src={`../icons/icon-web.svg`} fill="#121212" width={20} height={20} />
                      <span className="ml-1">Website</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="panel-widget">
              <div className="panel-widget-title">Attributes</div>
              <div className="panel-widget-content">
                <div className="panel-widget-list">
                  <div className="widget-list-item">
                    <div className="list-item-left">Event Start</div>
                    <div className="list-item-right">
                      {asset.asset.event.start_date}
                    </div>
                  </div>
                  {(asset.asset.event.city || asset.asset.event.country) && (
                    <div className="widget-list-item">
                      <div className="list-item-left">Event Location</div>
                      <div className="list-item-right">
                        {asset.asset.event.city} {asset.asset.event.country}
                      </div>
                    </div>
                  )}
                  <div className="widget-list-item">
                    <div className="list-item-left">Chain</div>
                    <div className="list-item-right">
                      {asset.asset.chain}
                    </div>
                  </div>
                  <div className="widget-list-item">
                    <div className="list-item-left">POAP Supply</div>
                    <div className="list-item-right">
                      {asset.asset.event.supply}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );;
}
