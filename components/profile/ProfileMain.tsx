import React, { useState, useEffect } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { RenderWidgetItem } from "../profile/WidgetItem";
import { LinksItem } from "../../utils/api";
import { PoapWidget } from "../profile/PoapsWidget";
import { NFTDialog, NFTDialogType } from "../panel/components/NFTDialog";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { Error } from "../shared/Error";
import Avatar from "boring-avatars";
import { formatText } from "../../utils/utils";
import { NFTCollectionWidget } from "../profile/NFTCollectionWidget";

export default function ProfileMain(props) {
  const { data, pageTitle = "default", platform } = props;
  const [copied, setCopied] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [curAsset, setCurAsset] = useState(null);
  const [linksData, setLinkData] = useState([]);
  const [dialogType, setDialogType] = useState(NFTDialogType.NFT);

  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  useEffect(() => {
    if (data && data.links) {
      setLinkData(
        Object.entries(data.links).map(([key, value]) => {
          return {
            platform: key,
            ...(value as LinksItem),
          };
        })
      );
    }
  }, [data]);

  if (!data || data.error) {
    return (
      <div className="web3-profile container">
        <Error
          retry={() => window.location.reload()}
          msg={data.error || "Error"}
        />
      </div>
    );
  }
  return (
    <>
      <div
        className="web3bio-custom"
        style={{ backgroundImage: "url(" + data.header + ")" }}
      ></div>
      <div className="columns">
        <div className="column col-4 col-md-12">
          <div className="web3-profile-base">
            <div className="profile-avatar">
              {data.avatar ? (
                <img
                  src={data.avatar}
                  className="avatar"
                  loading="lazy"
                  alt={`${pageTitle} Avatar / Profile Photo`}
                />
              ) : (
                <Avatar
                  size={180}
                  name={data.identity}
                  variant="marble"
                  colors={[
                    "#FBF4EC",
                    "#ECD7C8",
                    "#EEA4BC",
                    "#BE88C4",
                    "#9186E7",
                    "#92C9F9",
                    "#92C9F9",
                  ]}
                />
              )}
            </div>
            <h1 className="text-assistive">{`${pageTitle} ${
              SocialPlatformMapping(platform).label
            } Web3 Profile`}</h1>
            <h2 className="text-assistive">{`${pageTitle} Web3 identity profile info, description, addresses, social links, NFT collections, POAPs, Web3 social feeds, crypto assets etc on the Web3.bio Link in bio page.`}</h2>
            <div className="profile-name">{data.displayName}</div>
            {data.identity == data.displayName ? (
              <div className="profile-identity">
                {formatText(data.owner)}
                <Clipboard
                  component="div"
                  className="action"
                  data-clipboard-text={data.owner}
                  onSuccess={onCopySuccess}
                >
                  <SVG src="../icons/icon-copy.svg" width={20} height={20} />
                  {copied && <div className="tooltip-copy">COPIED</div>}
                </Clipboard>
              </div>
            ) : (
              <div className="profile-identity" title={data.owner}>
                {data.identity}
                {" · "}
                {formatText(data.owner)}
                <Clipboard
                  component="div"
                  className="action"
                  data-clipboard-text={data.owner}
                  onSuccess={onCopySuccess}
                >
                  <SVG src="../icons/icon-copy.svg" width={20} height={20} />
                  {copied && <div className="tooltip-copy">COPIED</div>}
                </Clipboard>
              </div>
            )}
            {data.description && (
              <h2 className="profile-description">{data.description}</h2>
            )}
            {data.location && (
              <div className="profile-location">📍 {data.location}</div>
            )}
            {data.email && (
              <div className="profile-email">
                ✉️ <a href={`mailto:${data.email}`}>{data.email}</a>
              </div>
            )}
          </div>
        </div>
        <div className="column col-8 col-md-12">
          <div className="web3-section-widgets">
            {linksData.map((item, idx) => {
              return (
                <RenderWidgetItem
                  key={idx}
                  displayName={pageTitle}
                  item={item}
                />
              );
            })}
          </div>
          <div
            className="web3-section-widgets"
            style={{ flexDirection: "column" }}
          >
            <NFTCollectionWidget
              onShowDetail={(v) => {
                setDialogType(NFTDialogType.NFT);
                setCurAsset(v);
                setDialogOpen(true);
              }}
              identity={data}
            />
          </div>
          <div className="web3-section-widgets">
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
    </>
  );
}
