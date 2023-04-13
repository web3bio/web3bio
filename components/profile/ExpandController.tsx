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
      className="expand-icon"
      onClick={() => {
        onToggle(!expand);
      }}
    >
      {(expand && (
        <SVG src="/icons/icon-close.svg" width="16" height="16" />
      )) || <SVG src="/icons/switch.svg" width="16" height="16" />}
    </div>
  );
};

export const ExpandController = memo(RenderExpandController);
