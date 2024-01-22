import { WidgetTypes } from "../../utils/profile";
import { Loading } from "../shared/Loading";

export default function LoadingSkeleton(props) {
  const { type, height } = props;
  const renderContent = (() => {
    switch (type) {
      case WidgetTypes.nft:
        return (
          <div className="profile-widget profile-widget-nft">
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">🖼 </span>
                Loading Collections
              </h2>
            </div>

            <div className="profile-widget-loading-content">
              <Loading />
            </div>
          </div>
        );
      case WidgetTypes.poaps:
        return (
          <div className="profile-widget profile-widget-poap">
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">🔮 </span>
                Loading Poaps...
              </h2>
            </div>
            <div className="profile-widget-loading-content">
              <Loading />
            </div>
          </div>
        );
      case WidgetTypes.feeds:
        return (
          <div className="profile-widget profile-widget-feeds">
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">🌈 </span>
                Loading Feeds...
              </h2>
            </div>
            <div className="profile-widget-loading-content">
              <Loading />
            </div>
          </div>
        );
      case WidgetTypes.rss:
        return (
          <div className="profile-widget profile-widget-rss">
            <div className="profile-widget-header">
              <h2 className="profile-widget-title">
                <span className="emoji-large mr-2">📰 </span>
                Loading Website...
              </h2>
            </div>
            <div className="profile-widget-loading-content">
              <Loading />
            </div>
          </div>
        );
      case WidgetTypes.degen:
        return <div>degen loading state</div>;
      case WidgetTypes.phi:
        return <div>phi loading state</div>;
      default:
        return <div>Loading state</div>;
    }
  })();
  return (
    <div
      className="profile-widget-full"
      style={{
        height: height,
      }}
    >
      {renderContent}
    </div>
  );
}
