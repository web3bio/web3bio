"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { updatePhilandWidget } from "../state/widgets/reducer";
import { QUERY_PHILAND_INFO } from "../utils/queries";
import { ModalType } from "../hooks/useModal";

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
    !loading &&
    !error && (
      <div
        className="profile-widget profile-widget-philand profile-widget-hover"
        onClick={(e) => {
          openModal(ModalType.philand, {
            profile,
            data,
          });
        }}
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
          <div className="widget-score-title">{data?.phiRank?.data?.rank}</div>
          <div className="widget-score-subtitle">PhiRank</div>
        </div>
      </div>
    )
  );
}
