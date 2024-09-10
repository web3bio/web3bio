"use client";
import { useEffect, memo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { updatePhilandWidget } from "../state/widgets/reducer";
import { QUERY_PHILAND_INFO } from "../utils/queries";
import Link from "next/link";

export default function WidgetPhiland({ profile, openModal }) {
  const { data, loading, error } = useQuery(QUERY_PHILAND_INFO, {
    variables: {
      name: profile.identity,
      address: profile.address,
    },
    context: {
      clientName: WidgetType.philand,
    },
  });
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!loading) {
      dispatch(
        updatePhilandWidget({
          isEmpty: !data?.philandImage?.imageurl,
          initLoading: false,
        })
      );
    }
  }, [data, loading, dispatch]);
  if (!data || !data?.philandImage?.imageurl) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Phi:", data);
  // }

  return (
    !loading && (
      <Link
        href={`https://land.philand.xyz/${profile.address}`}
        className="profile-widget profile-widget-webacy"
        target="_blank"
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetType.philand).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetType.philand).title}{" "}
          </h2>
        </div>

        <div className="profile-widget-body"></div>

        <div className="profile-widget-footer">
          <div className="widget-score-title">
            {Number(data?.overallRisk).toFixed(2)}
            <div
              className={`widget-score-label ${
                data?.high > 0
                  ? "high-risk"
                  : data?.medium > 0
                  ? "medium-risk"
                  : "low-risk"
              }`}
            >
              {data?.high > 0
                ? "High Risk"
                : data?.medium > 0
                ? "Medium Risk"
                : "Low Risk"}
            </div>
          </div>
          <div className="widget-score-subtitle">Phi Rank </div>
        </div>
      </Link>
    )
  );
}
