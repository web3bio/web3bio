"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis/degenscore";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { updateDegenWidget } from "../../state/widgets/action";
import { useDispatch } from "react-redux";

function useDegenInfo(address: string) {
  const { data, error } = useSWR(
    `${DEGENSCORE_ENDPOINT}${address}`,
    DegenFetcher,
    {
      suspense: true,
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderWidgetDegenScore = ({ address }) => {
  const { data, isLoading } = useDegenInfo(address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(updateDegenWidget({ isEmpty: !data?.name, initLoading: false }));
    }
  }, [data, isLoading, dispatch]);

  if (!data || !data.name) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("DegenScore Data:", data);
  // }

  return (
    <div className="profile-widget-full" id="degenscore">
      <div className="profile-widget profile-widget-degenscore">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">👾 </span>
            DegenScore{" "}
            <span className="label ml-2">{data.properties?.DegenScore}</span>
          </h2>
          <h3 className="text-assistive">
            The DegenScore Beacon is an Ethereum soulbound token that highlights
            your on-chain skills & traits across one or more wallets.\nUse it to
            leverage your on-chain reputation in the DegenScore Cafe and across
            web3.
          </h3>
          <div className="widget-action">
            <div className="action-icon">
              <Link
                className="btn btn-sm"
                title="More on DegenScore"
                href={`https://degenscore.com/beacon/${address}`}
                target={"_blank"}
              >
                <SVG src="icons/icon-open.svg" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>

        {data.traits.actions?.metadata.actions.actions && (
          <div className="widget-trait-list">
            {(data.traits.actions?.metadata.actions.actions).map(
              (item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`trait-item ${item.actionTier?.toLowerCase()}`}
                    title={item.description}
                  >
                    <div className="trait-item-bg">
                      <div className="trait-label">
                        {item.actionTier == "ACTION_TIER_LEGENDARY" && (
                          <div className="value">💎</div>
                        )}
                        {item.actionTier == "ACTION_TIER_EPIC" && (
                          <div className="value">&#127942;</div>
                        )}
                      </div>
                      <div className="trait-name">{item.name}</div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const WidgetDegenScore = memo(RenderWidgetDegenScore);
