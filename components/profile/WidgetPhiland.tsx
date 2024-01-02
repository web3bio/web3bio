"use client";
import { useEffect, memo } from "react";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updatePhilandWidget } from "../../state/widgets/action";
import { QUERY_PHILAND_LIST, QUERY_PHILAND_RANK } from "../apis/philand";
import { useQuery } from "@apollo/client";
import PhilandItem from "./PhilandItem";

const RenderWidgetPhiland = ({ address }) => {
  const { data, loading, error } = useQuery(QUERY_PHILAND_LIST, {
    variables: {
      address,
    },
    context: {
      clientName: "philand",
    },
  });
  const {
    data: rankData,
    loading: rankLoading,
    error: rankError,
  } = useQuery(QUERY_PHILAND_RANK, {
    variables: {
      address,
    },
    context: {
      clientName: "philand",
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading) {
      dispatch(
        updatePhilandWidget({
          isEmpty: !data?.philandList?.data?.length,
          initLoading: false,
        })
      );
    }
  }, [data, loading, dispatch]);
  if (!data || !data?.philandList?.data?.length) return null;

  if (process.env.NODE_ENV !== "production") {
    console.log("Phi List:", data, "Phi Rank:", rankData);
  }

  return (
    <div className="profile-widget-full" id="philand">
      {/* TODO: className here to modify */}
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🧩 </span>
            Philand
          </h2>

          <div className="widget-action">
            <div className="action-icon">
              <Link
                className="btn btn-sm"
                title="More on Phi Land"
                href={"https://philand.xyz/"}
                target={"_blank"}
              >
                <SVG src="icons/icon-open.svg" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>
        {/* TODO: className here to modify */}
        <div className="widget-rss-list noscrollbar">
          {data?.philandList?.data?.map((x, idx) => (
            <PhilandItem data={x} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const WidgetPhiland = memo(RenderWidgetPhiland);
