import { memo } from "react";
import SVG from "react-inlinesvg";

interface ExpandControllerProps {
  onToggle: (v: boolean) => void;
  expand: boolean;
}
const RenderExpandController = (props: ExpandControllerProps) => {
  const { onToggle, expand } = props;
  return (
    <div
      className="action-icon"
      onClick={() => {
        onToggle(!expand);
      }}
    >
      {expand ? (
        <div className="btn btn-sm btn-action" title="Collapse">
          <span className="action-icon-label text-assistive">Collapse</span>
          <SVG
            src="../icons/icon-collapse.svg"
            width={18}
            height={18}
          />
        </div>
      ) : (
        <div className="btn btn-sm btn-action" title="Expand">
          <span className="action-icon-label text-assistive">Expand</span>
          <SVG
            src="../icons/icon-expand.svg"
            width={18}
            height={18}
          />
        </div>
      )}
    </div>
  );
};

export const ExpandController = memo(RenderExpandController);
