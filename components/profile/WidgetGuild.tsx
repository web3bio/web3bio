"use client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { updateGuildWidget } from "../state/widgets/action";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { GUILD_XYZ_ENDPOINT, GuildFetcher } from "../apis/guild";

function useGuildMemberships(address: string) {
  const { data, error, isValidating } = useSWR(
    `${GUILD_XYZ_ENDPOINT}/users/${address}/memberships`,
    GuildFetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data: data || [],
    isLoading: isValidating,
    isError: error,
  };
}

export default function WidgetGuild({ profile, onShowDetail }) {
  const { data, isLoading } = useGuildMemberships(profile?.address);
  const [render, setRender] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [guilds, setGuilds] = useState(new Array());
  const dispatch = useDispatch();
  const getBoundaryRender = useCallback(() => {
    if (isLoading || infoLoading)
      return (
        <div className="widget-loading">
          <Loading />
        </div>
      );
    return null;
  }, [isLoading, infoLoading]);
  useEffect(() => {
    setRender(true);
    if (!isLoading) {
      dispatch(
        updateGuildWidget({ isEmpty: !data?.length, initLoading: false })
      );
    }
    const fetchGuildsBatch = async () => {
      const res = await fetch(
        `${GUILD_XYZ_ENDPOINT}/guilds?guildIds=${data
          .map((x) => x.guildId)
          ?.join(",")}`
      ).then((res) => res.json());
      setGuilds(
        res.reduce((pre, cur) => {
          const _guildBase = data?.find((i) => i.guildId === cur.id);
          pre.push({
            ..._guildBase,
            ...cur,
          });
          return pre;
        }, new Array())
      );
      setInfoLoading(false);
    };
    if (data?.length > 0 && !infoLoading && !guilds?.length) {
      setInfoLoading(true);
      fetchGuildsBatch();
    }
  }, [data, isLoading, dispatch, infoLoading]);

  if (!data || !data.length || !render) {
    return null;
  }

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Guild Data:", data);
  // }

  return (
    render && (
      <div className="profile-widget-full" id={WidgetTypes.guild}>
        <div className="profile-widget profile-widget-guild">
          <div className="profile-widget-header">
            <h2
              className="profile-widget-title"
              title="Build communities onchain - Guild.xyz"
            >
              <span className="emoji-large mr-2">
                {WidgetInfoMapping(WidgetTypes.guild).icon}{" "}
              </span>
              {WidgetInfoMapping(WidgetTypes.guild).title}
            </h2>
            <h3 className="text-assistive">
              {WidgetInfoMapping(WidgetTypes.guild).description}
            </h3>
          </div>

          <div className="widget-guild-list noscrollbar">
            {getBoundaryRender() ||
              guilds.map((x, idx) => {
                const imageURL = x?.imageUrl.includes("/guildLogos/")
                  ? "https://guild.xyz" + x.imageUrl
                  : x.imageUrl;
                return (
                  <div
                    onClick={() => {
                      onShowDetail({
                        guild: {
                          ...x,
                          imageUrl: imageURL,
                        },

                        profile,
                      });
                    }}
                    key={idx}
                    className="guild-item c-hand"
                  >
                    <NFTAssetPlayer
                      className={
                        x?.imageUrl?.includes("/guildLogos/")
                          ? "img-container dark-img"
                          : "img-container"
                      }
                      src={imageURL}
                      alt={x.id}
                      height={64}
                      width={64}
                      placeholder={true}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    )
  );
}
