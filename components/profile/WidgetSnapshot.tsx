"use client";
import { useCallback, useEffect } from "react";
import { Loading } from "../shared/Loading";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { useDispatch } from "react-redux";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { updateSnapshotWidget } from "../state/widgets/reducer";
import { useQuery } from "@apollo/client";
import { QUERY_SPACES_FOLLOWED_BY_USR } from "../utils/queries";

export default function WidgetSnapshot({ profile, openModal }) {
  const { data, loading, error } = useQuery(QUERY_SPACES_FOLLOWED_BY_USR, {
    variables: {
      address: profile.address,
    },
    context: {
      clientName: WidgetType.snapshot,
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
    <div className="profile-widget-full" id={WidgetType.snapshot}>
      <div className="profile-widget profile-widget-guild">
        <div className="profile-widget-header">
          <h2
            className="profile-widget-title"
            title="Snapshot - Where decisions get made."
          >
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetType.snapshot).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetType.snapshot).title}
          </h2>
          <h3 className="text-assistive">
            {WidgetInfoMapping(WidgetType.snapshot).description}
          </h3>
        </div>

        <div className="widget-guild-list noscrollbar">
          {getBoundaryRender() ||
            data?.follows?.map(({space}) => {
              const imageUrl = `https://cdn.stamp.fyi/space/${space.id}?s=160`;
              return (
                <div
                  onClick={() => {
                    openModal({
                      space: {
                        ...space,
                        avatar: imageUrl,
                      },
                      profile,
                    });
                  }}
                  key={space.id}
                  className="space-item guild-item c-hand"
                >
                  <NFTAssetPlayer
                    className={"img-container"}
                    src={imageUrl}
                    alt={space.name}
                    height={64}
                    width={64}
                    placeholder={true}
                  />
                  <div className="text-assistive">{space.name}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
