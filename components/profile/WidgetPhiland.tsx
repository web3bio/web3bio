"use client";
import { useEffect, memo } from "react";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updatePhilandWidget } from "../../state/widgets/action";
import { QUERY_PHILAND_INFO } from "../apis/philand";
import { useQuery } from "@apollo/client";
import PhilandItem from "./PhilandItem";
import _ from "lodash";
import { isValidURL } from "../../utils/utils";

const RenderWidgetPhiland = ({ address, domain, onShowDetail }) => {
  const { data, loading, error } = useQuery(QUERY_PHILAND_INFO, {
    variables: {
      address: address,
      name: domain,
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
    console.log(
      "Phi List:",
      data?.philandList?.data,
      "Phi Rank:",
      data?.phiRank?.data
    );
  }

  return (
    <div className="profile-widget-full" id="philand">
      {/* TODO: className here to modify */}
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🧩 </span>
            Phi Land
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
          {_.sortBy(
            data?.philandList?.data.filter((x) => isValidURL(x.imageurl)),
            (d) => d.name !== domain
          )?.map((x, idx) => (
            <PhilandItem
              onShowDetail={(v) =>
                onShowDetail({
                  ...v,
                  links: data?.philandLink?.data?.filter(
                    (x) => x.title && x.url
                  ),
                  rank: data?.phiRank?.data,
                })
              }
              data={x}
              key={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const WidgetPhiland = memo(RenderWidgetPhiland);
