import { WidgetState } from "../../state/widgets/reducer";
interface WidgetsIndicatorInterface {
  states: WidgetState;
}
export default function WidgetsIndicator(props: WidgetsIndicatorInterface) {
  const { states } = props;
  const arr = Object.values(states).filter((x) => x.icon && !x.isEmpty);
  return (
    arr.length > 0 && (
      <div className="widgets-indicator">
        {arr.map((x) => {
          return (
            <a
              key={x.icon + x.key}
              href={`#${x.key}`}
              className="widget-indicator-item"
              title={""}
            >
              <div className="indicator-dot"></div>
              {x.icon}
            </a>
          );
        })}
      </div>
    )
  );
}
