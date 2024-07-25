"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useDispatch } from "react-redux";
import {
  updateTalentWidget,
} from "../state/widgets/reducer";
import { TALENT_API_ENDPOINT, talentFetcher } from "../apis/talent";

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

const RenderWidgetTalent = ({ address }) => {
  const { data, isLoading } = useTalentPassportInfo(address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateTalentWidget({
          isEmpty: !data.score,
          initLoading: false,
        })
      );
    }
  }, [data, dispatch, isLoading]);
  if (!isLoading && !data?.score) return null;

  //   if (process.env.NODE_ENV !== "production") {
  //     console.log("Talent Data:", data);
  //   }

  return isLoading ? (
    <></>
  ) : (
    <div className="profile-widget profile-widget-gitcoin">
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
        <div className="widget-gitcoin-number">{data.score}</div>
        <div
          className="widget-gitcoin-title"
          title="Humanity Score is based out of 100 and measures identity's uniqueness. The current passing threshold is 20."
        >
          Talent Passport Score
        </div>
      </div>

      {/* TODO: more for details*/}
    </div>
  );
};

export const WidgetTalent = memo(RenderWidgetTalent);
