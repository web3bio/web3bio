import { memo } from "react";

const LensProfileTabRender = (props) => {
  const { profile } = props;
  console.log(profile,'sss')
  return <div>{
    'profile'}</div>;
};

export const LensProfileTab = memo(LensProfileTabRender);
