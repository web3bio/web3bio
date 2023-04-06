import React, { useState, useEffect } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { RenderWidgetItem } from "../../components/profile/WidgetItem";
import { LinksItem } from "../../utils/api";

const NewProfile = ({data}) => {
  const [copied, setCopied] = useState(null);
  const linksData = Object.entries(data.links).map(([key, value]) => {
    return {
      platform: key,
      ...value as LinksItem,
    };
  });
  console.log(linksData);

  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const backgroundCover = {
    backgroundImage: 'url(' + data.header + ')'
  };

  return (
    <div className="web3-profile container">
      <div className="web3bio-custom" style={ backgroundCover }></div>
        <div className="columns">
          <div className="column col-4 col-md-12">
            <div className="profile-avatar">
              {data.avatar ? <img src={data.avatar} className="avatar" /> : <></>}
            </div>
            <div className="profile-name">
              {data.displayName}
            </div>
            <div className="profile-identity">
              {data.identity}
              <Clipboard
                component="div"
                className="action"
                data-clipboard-text={data.identity}
                onSuccess={onCopySuccess}
              >
                <SVG src="../icons/icon-copy.svg" width={20} height={20} />
                {copied && <div className="tooltip-copy">COPIED</div>}
              </Clipboard>
            </div>
            <div className="profile-description">
              {data.description}
            </div>
          </div>
          <div className="column col-8 col-md-12">
            <div className="web3-profile-widgets">
              {linksData.map((item, idx) => {
                return (
                  <RenderWidgetItem key={idx} item={item} />
                );
              })}
            </div>
          </div>
        </div>
    </div>
  )
}

export async function getServerSideProps({params}) {
  const res = await fetch(`https://web3.bio/api/profile/ens/${params.domain}`)
  const data = await res.json()

  return { props: { data } }
}

export default NewProfile;