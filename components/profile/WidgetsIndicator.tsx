import { WidgetState } from "../../state/widgets/reducer";
import { WidgetInfoMapping, WidgetTypes } from "../../utils/widgets";
interface WidgetsIndicatorInterface {
  states: WidgetState;
}
export default function WidgetsIndicator(props: WidgetsIndicatorInterface) {
  const { states } = props;
  const arr = Object.entries(states).filter(
    (x) => x[1].loaded && !x[1].isEmpty
  );
  return (
    arr.length > 0 && (
      <div className="widgets-indicator">
        {arr.map((x) => {
          const type = x[0] as WidgetTypes;
          return (
            <a
              key={WidgetInfoMapping(type).icon + x[0]}
              href={`#${x[0]}`}
              className="widget-indicator-item"
              title={""}
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
