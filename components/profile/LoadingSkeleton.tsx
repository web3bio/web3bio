import { WidgetTypes } from "../../utils/profile";

export default function LoadingSkeleton(props) {
  const { type, height } = props;
  const renderContent = (() => {
    switch (type) {
      case WidgetTypes.nft:
        return <div>nft loading state</div>;
      case WidgetTypes.poaps:
        return <div>poaps loading state</div>;
      case WidgetTypes.feeds:
        return <div>feeds loading state</div>;
      case WidgetTypes.rss:
        return <div>rss loading state</div>;
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
      style={{
        height: height,
      }}
    >
      {renderContent}
    </div>
  );
}
