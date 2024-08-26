"use client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { updateGuildWidget } from "../state/widgets/reducer";
import { GUILD_XYZ_ENDPOINT, GuildFetcher } from "../utils/api";

function useGuildMemberships(address: string) {
  const { data, error, isLoading } = useSWR(
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
    isLoading: isLoading,
    isError: error,
  };
}

export default function WidgetGuild({ profile, openModal }) {
  const { data, isLoading } = useGuildMemberships(profile?.address);
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

  if (!data || !data.length) {
    return null;
  }

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Guild Data:", guilds);
  // }

  return (
    <div className="profile-widget-full" id={WidgetType.guild}>
      <div className="profile-widget profile-widget-guild">
        <div className="profile-widget-header">
          <h2
            className="profile-widget-title"
            title="Build communities onchain - Guild.xyz"
          >
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetType.guild).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetType.guild).title}
          </h2>
          <h3 className="text-assistive">
            {WidgetInfoMapping(WidgetType.guild).description}
          </h3>
        </div>

        <div className="widget-guild-list noscrollbar">
          {getBoundaryRender() ||
            guilds.map((x) => {
              const imageURL = x?.imageUrl.includes("/guildLogos/")
                ? "https://guild.xyz" + x.imageUrl
                : x.imageUrl;
              return (
                <div
                  onClick={() => {
                    openModal({
                      guild: {
                        ...x,
                        imageUrl: imageURL,
                      },
                      profile,
                    });
                  }}
                  key={x.guildId}
                  className="guild-item c-hand"
                >
                  <NFTAssetPlayer
                    className={
                      x?.imageUrl?.includes("/guildLogos/")
                        ? "img-container dark-img"
                        : "img-container"
                    }
                    src={imageURL}
                    alt={x.name}
                    height={64}
                    width={64}
                    placeholder={true}
                  />
                  <div className="text-assistive">{x.name}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
