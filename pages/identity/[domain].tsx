import { memo } from "react";

const RenderDomainPanel = (props) => {
  const { identity } = props;
  return <div>{identity}</div>;
};

export default memo(RenderDomainPanel);

