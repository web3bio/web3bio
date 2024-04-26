"use client";
import { useEffect, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTallyDAOWidget } from "../state/widgets/action";
import { useQuery } from "@apollo/client";
import { QUERY_DAO_DELEGATORS } from "../apis/tally";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";
import Link from "next/link";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { formatText, formatBalance } from "../utils/utils";
import { WidgetTypes } from "../utils/widgets";

const RenderWidgetTally = ({ address }) => {
  // 0:delegators  1:delegating to
  const [activeTab, setActiveTab] = useState(0);
  const queryVar = {
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
  };
  const { data, loading, error } = useQuery(QUERY_DAO_DELEGATORS, {
    variables: {
      delegate: queryVar,
      delegatee: queryVar,
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
          isEmpty:
            !data?.delegates?.nodes?.length && !data?.delegatees?.nodes?.length,
          initLoading: false,
        })
      );
    }
    if (data && !data?.delegates?.nodes?.length) {
      setActiveTab(1);
    }
  }, [data, loading, dispatch]);

  if (
    !(data?.delegates?.nodes?.length > 0 || data?.delegatees?.nodes?.length > 0)
  )
    return null;

  return (
    <div className="profile-widget-full" id={WidgetTypes.tally}>
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
                Delegating To
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Error />
        ) : (
          <div className="profile-widget-body">
            {activeTab === 0 &&
              (data?.delegates?.nodes.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>DAO</th>
                      <th>Voting Power</th>
                      <th>Received Delegations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.delegates?.nodes.map((x, idx) => {
                      const votesCount = formatBalance(x.votesCount, 18, 2);
                      return (
                        Number(x.organization?.delegatesVotesCount) !== 0 && (
                          <tr key={"td" + idx}>
                            <td>
                              <div className="table-item">
                                <Image
                                  className="dao-icon"
                                  src={x.organization.metadata?.icon || ""}
                                  height={24}
                                  width={24}
                                  alt={x.organization.name}
                                />
                                {x.organization.name}
                              </div>
                            </td>
                            <td>
                              {votesCount} (
                              {(
                                Math.abs(
                                  Number(x.votesCount) /
                                    Number(x.organization?.delegatesVotesCount)
                                ) * 100
                              ).toFixed(2) + "%"}
                              )
                            </td>
                            <td>
                              <div className="badge">
                                <strong>{x.delegatorsCount}</strong> addresses
                                delegating
                              </div>
                            </td>
                          </tr>
                        )
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <Empty
                  title={`No delegations`}
                  text={`Please switch to Delegating To tab`}
                />
              ))}
            {activeTab === 1 &&
              (data?.delegatees?.nodes.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>DAO</th>
                      <th>Voting Power</th>
                      <th>Delegating To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.delegatees?.nodes.map((x, idx) => {
                      return (
                        <tr key={"td" + idx}>
                          <td>
                            <div className="table-item">
                              <Image
                                className="dao-icon"
                                src={
                                  x.governor.organization.metadata?.icon || ""
                                }
                                height={24}
                                width={24}
                                alt={x.governor.organization.name}
                              />
                              <div
                                className="dao-content text-ellipsis"
                                title={
                                  x.governor.organization.name +
                                  " - " +
                                  x.governor.name
                                }
                              >
                                {x.governor.organization.name}{" "}
                                <small className="label">
                                  {x.governor.name}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            {formatBalance(x.votes, x.token.decimals, 2)}{" "}
                            {x.token?.symbol}
                          </td>
                          <td>
                            <div className="table-item">
                              {x.delegator.ens ? (
                                <Link
                                  className="feed-token"
                                  href={`${
                                    process.env.NEXT_PUBLIC_BASE_URL ||
                                    "https://web3.bio"
                                  }/${x.delegator.ens}`}
                                  title={x.delegator.name}
                                  target="_blank"
                                >
                                  <span className="feed-token-value">
                                    {x.delegator.name}
                                  </span>
                                  <small className="feed-token-meta">
                                    {formatText(x.delegator?.address || "")}
                                  </small>
                                </Link>
                              ) : (
                                <div
                                  className="feed-token"
                                  title={x.delegator.name}
                                >
                                  <span className="feed-token-value">
                                    {x.delegator.name}
                                  </span>
                                  <small className="feed-token-meta">
                                    {formatText(x.delegator?.address || "")}
                                  </small>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <Empty
                  title={`Not delegating to anyone`}
                  text={`Please switch to Delegators tab`}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const WidgetTally = memo(RenderWidgetTally);
