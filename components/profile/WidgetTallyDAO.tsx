"use client";
import { useEffect, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTallyDAOWidget } from "../../state/widgets/action";
import { useQuery } from "@apollo/client";
import { QUERY_DAO_DELEGATORS } from "../apis/tally";

const RenderWidgetTallyDAO = ({ address }) => {
  const [currentQuery, setCurrentQuery] = useState(QUERY_DAO_DELEGATORS);
  const { data, loading, error } = useQuery(currentQuery, {
    variables: {
      input: {
        filters: {
          address,
        },
        page: {
          limit: 10,
        },
        sort: {
          isDescending: true,
          sortBy: "VOTES",
        },
      },
    },
    context: {
      clientName: "tally",
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading) {
      dispatch(
        updateTallyDAOWidget({
          isEmpty: !data?.items?.length,
          initLoading: false,
        })
      );
    }
  }, [data, loading, dispatch]);

  if (!data) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("RSS Data:", data);
  // }

  return (
    <div className="profile-widget-full" id="DAO">
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2"> 🏛️</span>
            DAO Memberships
          </h2>
          {/* {data.description && (
            <h3 className="text-assistive">{data.description}</h3>
          )} */}
        </div>

        <div className="widget-rss-list noscrollbar">widget tally dao</div>
      </div>
    </div>
  );
};

export const WidgetTallyDAO = memo(RenderWidgetTallyDAO);
