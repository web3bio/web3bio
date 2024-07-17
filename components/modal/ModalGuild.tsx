import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import useSWR from "swr";
import { SimplehashFetcher } from "../apis/simplehash";
import _ from "lodash";
import { GUILD_XYZ_ENDPOINT } from "../apis/guild";
import Link from "next/link";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
export default function GuildModalContent({ onClose, guild }) {
  const { data: guildDetail } = useSWR(
    `${GUILD_XYZ_ENDPOINT}/guilds/guild-page/${guild.urlName}`,
    SimplehashFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div id="nft-dialog" className="nft-preview">
        <div className="preview-container">
          <div
            className="preview-overlay"
            style={{
              backgroundImage: "url(" + guild.imageUrl + ")",
            }}
            onClick={onClose}
          ></div>
          <div className="preview-image preview-image-guild">
            <NFTAssetPlayer
              className={"img-container"}
              type={"image/png"}
              width={240}
              height={240}
              src={guild.imageUrl}
              alt={guild.name}
              placeholder={true}
            />
          </div>
          {guildDetail && (
            <div className="preview-main">
              <div className="preview-content">
                <div className="panel-widget">
                  <div className="panel-widget-content">
                    <div className="nft-header-name h4">{guildDetail.name}</div>
                    <div className="nft-header-description mt-2 mb-2">
                      {guildDetail.description}
                    </div>

                    {guildDetail.socialLinks && (
                      <div className="btn-group mt-2 mb-4">
                        {Object.keys(guildDetail.socialLinks).map((x) => {
                          const value = guildDetail.socialLinks[x];
                          return (
                            <Link
                              key={guildDetail.id + x}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn"
                            >
                              <SVG
                                src={
                                  SocialPlatformMapping(
                                    x.toLowerCase() as PlatformType
                                  ).icon || ""
                                }
                                fill="#121212"
                                width={20}
                                height={20}
                              />
                              <span className="ml-1">
                                {
                                  SocialPlatformMapping(
                                    x.toLowerCase() as PlatformType
                                  ).label
                                }
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="panel-widget">
                  <div className="panel-widget-title">Guild Info</div>
                  <div className="panel-widget-content">
                    <div className="panel-widget-list">
                      <div className="widget-list-item">
                        <div className="list-item-left">Guild Create</div>
                        <div className="list-item-right text-bold">
                          {guildDetail.createdAt}
                        </div>
                      </div>

                      <div className="widget-list-item">
                        <div className="list-item-left">Member Count</div>
                        <div className="list-item-right text-bold">
                          {guildDetail.memberCount}
                        </div>
                      </div>

                      {guildDetail.guildPin?.chain && (
                        <div className="widget-list-item">
                          <div className="list-item-left">Chain</div>
                          <div className="list-item-right text-bold text-uppercase">
                            {guildDetail.guildPin.chain}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {guildDetail.roles?.length > 0 && (
                  <div className="panel-widget">
                    <div className="panel-widget-title">Roles</div>
                    <div className="panel-widget-content">
                      <div className="panel-widget-list">
                        {guildDetail.roles.map((x) => {
                          return (
                            <div key={x.name} className="widget-list-item">
                              <div className="list-item-left text-bold">
                                {x.name}
                              </div>
                              <div className="list-item-right">
                                <Avatar
                                  width={36}
                                  height={36}
                                  src={
                                    x.imageUrl.includes("/guildLogos/")
                                      ? "https://guild.xyz/" + x.imageUrl
                                      : x.imageUrl
                                  }
                                  alt={x.name}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
