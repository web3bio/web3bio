import { WidgetState } from "../../state/widgets/reducer";
interface WidgetsControlInterface {
  states: WidgetState;
}
export default function WidgetsControl(props: WidgetsControlInterface) {
  const { states } = props;
  const arr = Object.values(states).filter((x) => x.icon && !x.isEmpty);
  return (
    arr.length > 0 && (
      <div className="widgets-control">
        {arr.map((x) => {
          return (
            <a
              key={x.icon + x.key}
              href={`#${x.key}`}
              className="widget-control-item"
            >
              {x.icon}
            </a>
          );
        })}
      </div>
    )
  );
}
