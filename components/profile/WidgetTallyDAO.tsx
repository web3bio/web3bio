"use client";
import { useEffect, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTallyDAOWidget } from "../../state/widgets/action";
import { useQuery } from "@apollo/client";
import { QUERY_DAO_DELEGATING_TO, QUERY_DAO_DELEGATORS } from "../apis/tally";
import LoadingSkeleton from "./LoadingSkeleton";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { formatEther } from "ethers";
import { formatText } from "../../utils/utils";

const RenderWidgetTallyDAO = ({ address }) => {
  const [currentQuery, setCurrentQuery] = useState(QUERY_DAO_DELEGATORS);
  const { data, loading, error } = useQuery(currentQuery, {
    variables: {
      input: {
        filters: {
          address,
        },
        page: {
          limit: 20,
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
          isEmpty: !data?.delegates?.nodes?.length,
          initLoading: false,
        })
      );
    }
  }, [data, loading, dispatch]);

  if (!data) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("RSS Data:", data);
  // }

  const _data =
    currentQuery === QUERY_DAO_DELEGATORS
      ? data?.delegates?.nodes
      : data?.delegatees?.nodes;

  return (
    <div className="profile-widget-full" id="DAO">
      <div className="profile-widget profile-widget-tally">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2"> 🏛️</span>
            DAO Memberships
          </h2>
          {/* {data.description && (
            <h3 className="text-assistive">{data.description}</h3>
          )} */}
        </div>
        <div className=""></div>
        <ul className="tab tab-block">
          <li
            className={`tab-item ${
              (currentQuery === QUERY_DAO_DELEGATORS && "active") || ""
            }`}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentQuery !== QUERY_DAO_DELEGATORS)
                  setCurrentQuery(QUERY_DAO_DELEGATORS);
              }}
              href="#"
            >
              Delegators
            </a>
          </li>

          <li
            className={`tab-item ${
              (currentQuery === QUERY_DAO_DELEGATING_TO && "active") || ""
            }`}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentQuery !== QUERY_DAO_DELEGATING_TO)
                  setCurrentQuery(QUERY_DAO_DELEGATING_TO);
              }}
              href="#"
            >
              Delegating to
            </a>
          </li>
        </ul>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Error />
        ) : !_data.length ? (
          <Empty />
        ) : (
          <table className="table">
            <tr className="table-header">
              <th>DAO</th>
              <th>Votes</th>
              <th>% of Delegated Votes</th>
              <th> </th>
            </tr>
            {_data.map((x, idx) => {
              return currentQuery === QUERY_DAO_DELEGATORS ? (
                <tr key={"td" + idx}>
                  <td className="name-wrapper">
                    {x.organization.name}
                    {
                      <NFTAssetPlayer
                        className="dao-icon"
                        src={x.organization.metadata?.icon}
                        alt={x.organization.name}
                      />
                    }
                  </td>
                  <td>{Number(formatEther(x.votesCount || "0")).toFixed(2)}</td>
                  <td>{x.delegatorsCount}</td>
                  <td>{x.delegatorsCount}</td>
                </tr>
              ) : (
                <tr key={"td" + idx}>
                  <td className="name-wrapper">
                    {x.governor.organization.name}
                    {
                      <NFTAssetPlayer
                        className="dao-icon"
                        src={x.governor.organization.metadata?.icon}
                        alt={x.governor.organization.name}
                      />
                    }
                  </td>
                  <td>text1</td>
                  <td>text2</td>
                  <td className="name-wrapper">
                    Delegating to{" "}
                    <NFTAssetPlayer
                      className="dao-icon"
                      src={x.delegator?.picture}
                      alt={x.delegator?.ens}
                    />{" "}
                    {formatText(x.delegator?.address || "")}
                  </td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
    </div>
  );
};

export const WidgetTallyDAO = memo(RenderWidgetTallyDAO);
