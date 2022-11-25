import { memo } from "react";

const RenderDomainPanel = (props) => {
  const { identity } = props;
  return <div>{identity}</div>;
};

export async function getStaticPaths() {
  const data = {};
  return {
    data,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = params;
  return {
    props: {
      data: postData,
    },
  };
}
export default memo(RenderDomainPanel);
