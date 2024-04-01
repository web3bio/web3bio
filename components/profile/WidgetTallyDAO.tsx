"use client";
import { useEffect, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTallyDAOWidget } from "../../state/widgets/action";
import { useQuery } from "@apollo/client";
import { QUERY_DAO_DELEGATORS } from "../apis/tally";
import LoadingSkeleton from "./LoadingSkeleton";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { formatEther } from "ethers";
import { formatText } from "../../utils/utils";
import { Avatar } from "../shared/Avatar";

const RenderWidgetTallyDAO = ({ address }) => {
  // 0: delegators 1:delegating to
  const [activeTab, setActiveTab] = useState(0);
  const [queryVariable, setQueryVariable] = useState({
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
  });
  const { data, loading, error } = useQuery(QUERY_DAO_DELEGATORS, {
    variables: {
      delegate: queryVariable.input,
      delegatee: queryVariable.input,
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
  }, [data, loading, dispatch, activeTab]);

  if (
    !(data?.delegates?.nodes?.length > 0 || data?.delegatees?.nodes?.length > 0)
  )
    return null;

  const renderData =
    activeTab === 0 ? data?.delegates?.nodes : data?.delegatees?.nodes;

  return (
    <div className="profile-widget-full" id="DAO">
      <div className="profile-widget profile-widget-tally">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2"> 🏛️</span>
            DAO Memberships
          </h2>
          <div className="widget-action">
            <div className="btn-group">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(0);
                }}
                className={`btn btn-sm${(activeTab === 0 && " active") || ""}`}
              >
                Delegators
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(1);
                }}
                className={`btn btn-sm${(activeTab === 1 && " active") || ""}`}
              >
                Delegating to
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Error />
        ) : !renderData.length ? (
          <Empty
            text={`Please try tab "${
              activeTab === 0 ? "Delegating to" : "Delegators"
            }"`}
          />
        ) : (
          <div className="profile-widget-body">
            <table className="table">
              <tr>
                <th>DAO</th>
                <th>Voting Power</th>
                <th>% of Delegated Votes</th>
                <th>Received Delegations</th>
              </tr>
              {renderData.map((x, idx) => {
                const votesCount = Number(
                  Number(formatEther(x.votesCount || "0")).toFixed(2)
                );
                const delegatesVotesCount = Number(
                  Number(
                    formatEther(x.organization?.delegatesVotesCount || "0")
                  ).toFixed(2)
                );
                return activeTab === 0 ? (
                  <tr key={"td" + idx}>
                    <td>
                      <div className="dao-organization">
                        <NFTAssetPlayer
                          className="dao-icon"
                          src={x.organization.metadata?.icon}
                          alt={x.organization.name}
                        />
                        {x.organization.name}
                      </div>
                    </td>
                    <td>{Number(formatEther(x.votesCount || "0")).toFixed(2)}</td>
                    <td>
                      {((votesCount / delegatesVotesCount) * 100).toFixed(2) +
                        "%"}
                    </td>
                    <td>
                      <div className="badge">
                        {x.delegatorsCount} addresses delegating
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={"td" + idx}>
                    <td>
                      <div className="dao-organization">
                        <NFTAssetPlayer
                          className="dao-icon"
                          src={x.governor.organization.metadata?.icon}
                          alt={x.governor.organization.name}
                        />
                        {x.governor.organization.name}
                      </div>
                    </td>
                    <td>0</td>
                    <td>0.00%</td>
                    <td className="dao-organization">
                      <div className="badge">
                        Delegating to {formatText(x.delegator?.address || "")}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const WidgetTallyDAO = memo(RenderWidgetTallyDAO);
