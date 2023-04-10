import React, { useState, useEffect } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { RenderWidgetItem } from "../../components/profile/WidgetItem";
import { NextSeo } from "next-seo";
import { LinksItem } from "../../utils/api";
import { NFTCollectionWidget } from "../../components/profile/NFTCollectionWidget";
import { PoapWidget } from "../../components/profile/PoapsWidget";
import {
  NFTDialog,
  NFTDialogType,
} from "../../components/panel/components/NFTDialog";
import { PlatformType } from "../../utils/platform";

const NewProfile = ({ data }) => {
  const [copied, setCopied] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [curAsset, setCurAsset] = useState(null);
  const [dialogType, setDialogType] = useState(NFTDialogType.NFT);
  const linksData = Object.entries(data.links).map(([key, value]) => {
    return {
      platform: key,
      ...(value as LinksItem),
    };
  });

  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const backgroundCover = {
    backgroundImage: "url(" + data.header + ")",
  };

  return (
    <div className="web3-profile container">
      <NextSeo
        title={`${data.displayName} (${data.identity}) - Web3.bio`}
        description={data.description}
        openGraph={{
          images: [
            {
              url: data.avatar
                ? data.avatar
                : `${process.env.NEXT_PUBLIC_BASE_URL}/img/web3bio-social.jpg`,
            },
          ],
        }}
      />
      <div className="web3bio-custom" style={backgroundCover}></div>
      <div className="columns">
        <div className="column col-4 col-md-12">
          <div className="profile-avatar">
            {data.avatar ? <img src={data.avatar} className="avatar" /> : <></>}
          </div>
          <div className="profile-name">{data.displayName}</div>
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
          <div className="profile-description">{data.description}</div>
        </div>
        <div className="column col-8 col-md-12">
          <div className="web3-profile-widgets">
            {linksData.map((item, idx) => {
              return <RenderWidgetItem key={idx} item={item} />;
            })}
          </div>
          <div className="web3-profile-widgets">
            <NFTCollectionWidget
              onShowDetail={(v) => {
                setDialogType(NFTDialogType.NFT);
                setCurAsset(v);
                setDialogOpen(true);
              }}
              identity={data}
            />
          </div>
          <div className="web3-profile-widgets">
            <PoapWidget
              onShowDetail={(v) => {
                setDialogType(NFTDialogType.POAP);
                setCurAsset(v);
                setDialogOpen(true);
              }}
              identity={data}
            />
          </div>
        </div>
      </div>
      {dialogOpen && curAsset && (
        <NFTDialog
          address={
            dialogType === NFTDialogType.NFT
              ? curAsset.asset.contract_address
              : curAsset.address
          }
          tokenId={
            dialogType === NFTDialogType.NFT
              ? curAsset.asset.token_id
              : curAsset.tokenId
          }
          asset={curAsset}
          open={dialogOpen}
          onClose={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setDialogOpen(false);
          }}
          network={PlatformType.ens}
          poap={curAsset}
          type={dialogType}
        />
      )}
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://web3.bio/api/profile/ens/${params.domain}`);
  const data = await res.json();

  return { props: { data } };
}

export default NewProfile;
