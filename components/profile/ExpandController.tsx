import { memo } from "react";

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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
      )) || (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>)}
    </div>
  );
};

export const ExpandController = memo(RenderExpandController);
