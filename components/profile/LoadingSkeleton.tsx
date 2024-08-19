import { WidgetInfoMapping, WidgetType } from "../utils/widgets";

export default function LoadingSkeleton(props) {
  const { type } = props;
  const renderContent = (() => {
    switch (type) {
      case WidgetType.nft:
        return (
          <div className={`profile-widget profile-widget-loading ${type}`}>
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">🖼 </span>
                NFT Collections
              </h2>
            </div>
            <div className="profile-widget-body">
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
            </div>
          </div>
        );
      case WidgetType.poaps:
        return (
          <div className={`profile-widget profile-widget-loading ${type}`}>
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">🔮 </span>
                POAPs
              </h2>
            </div>
            <div className="profile-widget-body">
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
            </div>
          </div>
        );
      case WidgetType.feeds:
        return (
          <div className={`profile-widget profile-widget-loading ${type}`}>
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">🌈 </span>
                Activity Feeds
              </h2>
            </div>
            <div className="profile-widget-body">
              <div className="widget-feeds-container">
                <div className="feeds-list">
                  <div className={`feed-item`}>
                    <div className="feed-item-icon img-loading"></div>
                    <div className="feed-item-content">
                      <div className="feed-item-name">
                        <div className="feed-item-text img-loading">vitalik.eth</div>
                      </div>
                      <div className="item-body">
                        <div className="feed-content">
                          <div className="feed-item-text img-loading">Make Ethereum Cypherpunk Again</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`feed-item`}>
                    <div className="feed-item-icon img-loading"></div>
                    <div className="feed-item-content">
                      <div className="feed-item-name">
                        <div className="feed-item-text img-loading">vitalik.eth</div>
                      </div>
                      <div className="item-body">
                        <div className="feed-content">
                          <div className="feed-item-text img-loading">Exit games for EVM validiums: the return of Plasma</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`feed-item`}>
                    <div className="feed-item-icon img-loading"></div>
                    <div className="feed-item-content">
                      <div className="feed-item-name">
                        <div className="feed-item-text img-loading">vitalik.eth</div>
                      </div>
                      <div className="item-body">
                        <div className="feed-content">
                          <div className="feed-item-text img-loading">Should Ethereum be okay with enshrining more things in the protocol?</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={`profile-widget profile-widget-loading ${type}`}>
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">{WidgetInfoMapping(type).icon} </span>
                Loading
              </h2>
            </div>
            <div className="profile-widget-body">
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
              <div className="img-loading"></div>
            </div>
          </div>
        );
    }
  })();
  return (
    <div className="profile-widget-full">
      {renderContent}
    </div>
  );
}
