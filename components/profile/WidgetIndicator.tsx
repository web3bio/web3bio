import { WidgetState } from "../state/widgets/reducer";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
interface WidgetIndicatorInterface {
  states: WidgetState;
}
export default function WidgetIndicator(props: WidgetIndicatorInterface) {
  const { states } = props;
  const arr = Object.entries(states).filter(
    (x) => x[1].loaded && !x[1].isEmpty && !x[1].parent
  );
  return (
    arr.length > 0 && (
      <div className="widget-indicator">
        {arr.map((x) => {
          const type = x[0] as WidgetType;
          return (
            <a
              key={WidgetInfoMapping(type).icon + x[0]}
              href={`#${x[0]}`}
              className="widget-indicator-item tooltip"
              title={WidgetInfoMapping(type).title}
            >
              <div className="indicator-dot"></div>
              {WidgetInfoMapping(type).icon}
            </a>
          );
        })}
      </div>
    )
  );
}
