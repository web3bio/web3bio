"use client";
import { useCallback, useEffect } from "react";
import { Loading } from "../shared/Loading";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { updateSnapshotWidget } from "../state/widgets/reducer";
import { useQuery } from "@apollo/client";
import { QUERY_SPACES_FOLLOWED_BY_USR } from "../apis";

export default function WidgetSnapshot({ profile, onShowDetail }) {
  const { data, loading, error } = useQuery(QUERY_SPACES_FOLLOWED_BY_USR, {
    variables: {
      address: profile.address,
    },
    context: {
      clientName: WidgetTypes.snapshot,
    },
  });

  const dispatch = useDispatch();
  const getBoundaryRender = useCallback(() => {
    if (loading)
      return (
        <div className="widget-loading">
          <Loading />
        </div>
      );
    return null;
  }, [loading]);
  useEffect(() => {
    if (!loading) {
      dispatch(
        updateSnapshotWidget({
          isEmpty: !data?.follows?.length,
          initLoading: false,
        })
      );
    }
  }, [data, loading, dispatch]);

  if (!data || !data?.follows?.length) {
    return null;
  }

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Snapshot Data:", data);
  // }

  return (
    <div className="profile-widget-full" id={WidgetTypes.snapshot}>
      <div className="profile-widget profile-widget-guild">
        <div className="profile-widget-header">
          <h2
            className="profile-widget-title"
            title="Snapshot - Where decisions get made."
          >
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.snapshot).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetTypes.snapshot).title}
          </h2>
          <h3 className="text-assistive">
            {WidgetInfoMapping(WidgetTypes.snapshot).description}
          </h3>
        </div>

        <div className="widget-guild-list noscrollbar">
          {getBoundaryRender() ||
            data?.follows?.map((x, idx) => {
              const imageUrl = `https://cdn.stamp.fyi/space/${x.space.id}?s=160`;
              return (
                <div
                  onClick={() => {
                    onShowDetail({
                      space: {
                        ...x.space,
                        avatar: imageUrl,
                      },
                      profile,
                    });
                  }}
                  key={idx}
                  className="space-item guild-item c-hand"
                >
                  <NFTAssetPlayer
                    className={"img-container"}
                    src={imageUrl}
                    alt={x.space.name}
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
