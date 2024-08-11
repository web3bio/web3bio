"use client";
import { memo, useEffect, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useDispatch } from "react-redux";
import { updateTalentWidget } from "../state/widgets/reducer";
import { TALENT_API_ENDPOINT, talentFetcher } from "../apis";

function useTalentPassportInfo(address: string) {
  const { data, error } = useSWR(
    TALENT_API_ENDPOINT + `passports/${address}`,
    talentFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data: data?.passport,
    isLoading: !error && !data,
    isError: error,
  };
}

const getBuilderLevel = (score: number) => {
  if (score > 80) return "Expert";
  if (score > 60) return "Proficient";
  if (score > 40) return "Competent";
  if (score > 20) return "Beginner";
  return "Newbie";
};

const RenderWidgetTalent = ({ address }) => {
  const { data, isLoading } = useTalentPassportInfo(address);
  const dispatch = useDispatch();
  const builderLevel = useMemo(() => getBuilderLevel(data?.score || 0), [data?.score]);
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateTalentWidget({
          isEmpty: !data?.score,
          initLoading: false,
        })
      );
    }
  }, [data, dispatch, isLoading]);

  if (!isLoading && !data?.score) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Talent Data:", data);
  // }

  return isLoading ? (
    <></>
  ) : (
    <Link
      href={"https://passport.talentprotocol.com/profile/" + data.passport_id}
      className="profile-widget profile-widget-talent"
      target="_blank"
    >
      <div className="profile-widget-header">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">
            {WidgetInfoMapping(WidgetTypes.talent).icon}{" "}
          </span>
          {WidgetInfoMapping(WidgetTypes.talent).title}{" "}
        </h2>
      </div>
      <div className="profile-widget-body"></div>

      <div className="profile-widget-footer">
        <div className="widget-score-title">
          {data.score}
          <div className={`widget-score-label ${builderLevel.toLowerCase()}`}>
            {builderLevel}
          </div>
        </div>
        <div
          className="widget-score-subtitle"
          title="Talent Protocol leverage technological infrastructure that evaluate data points based on weighted parameters and assign a Builder Score to create a holistic representation of a person's reputation. "
        >
          Builder Score
        </div>
      </div>
    </Link>
  );
};

export const WidgetTalent = memo(RenderWidgetTalent);
