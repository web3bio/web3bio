"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { updateGuildWidget } from "../state/widgets/action";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { GUILD_XYZ_ENDPOINT, GuildFetcher } from "../apis/guild";

function useGuildMemberships(address: string) {
  const { data, error, isValidating } = useSWR(
    `${GUILD_XYZ_ENDPOINT}/guilds?user=${address}`,
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

export default function WidgetGuild({ address, onShowDetail }) {
  const { data, isLoading } = useGuildMemberships(address);
  const [render, setRender] = useState(false);
  const dispatch = useDispatch();
  const getBoundaryRender = useCallback(() => {
    if (isLoading)
      return (
        <div className="widget-loading">
          <Loading />
        </div>
      );
    return null;
  }, [isLoading]);
  useEffect(() => {
    setRender(true);
    if (!isLoading) {
      dispatch(
        updateGuildWidget({ isEmpty: !data?.length, initLoading: false })
      );
    }
  }, [data, isLoading, dispatch]);

  if (!data || !data.length || !render) {
    return null;
  }

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Guild Data:", data);
  // }

  return (
    render && (
      <div className="profile-widget-full" id={WidgetTypes.guild}>
        <div className="profile-widget profile-widget-poap">
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
            <div className="widget-action">
              <div className="action-icon">
                <Link
                  className="btn btn-sm btn-action"
                  title="More on Guild.xyz"
                  href={`https://guild.xyz/explorer`}
                  target={"_blank"}
                >
                  <SVG src="icons/icon-open.svg" width={20} height={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className="widget-poap-list noscrollbar">
            {getBoundaryRender() ||
              data.map((x, idx) => {
                return (
                  <div
                    onClick={() => {
                      onShowDetail(x);
                    }}
                    key={idx}
                    className="poap-item c-hand"
                  >
                    <NFTAssetPlayer
                      className="img-container"
                      src={x.imageUrl}
                      alt={x.id}
                      height={64}
                      width={64}
                      placeholder={true}
                    />
                    <div>{x.name}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    )
  );
}
