"use client";
import { useEffect, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { formatText, formatBalance } from "../utils/utils";
import { WidgetType } from "../utils/widgets";
import { updateTallyDAOWidget } from "../state/widgets/reducer";
import { QUERY_TALLY_DAOS } from "../utils/queries";

const RenderWidgetTally = ({ address }) => {
  // 0:delegators  1:delegating to
  const [activeTab, setActiveTab] = useState(0);
  const [expand, setExpand] = useState(false);
  const queryVar = {
    filters: {
      address,
    },
    page: {
      limit: 20,
    },
    sort: {
      isDescending: true,
      sortBy: "votes",
    },
  };
  const { data, loading, error } = useQuery(QUERY_TALLY_DAOS, {
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
    if (
      (data?.delegates?.nodes?.length > 0 &&
        data?.delegates?.nodes?.length < 4) ||
      (!data?.delegates?.nodes?.length && data?.delegatees?.nodes?.length < 4)
    ) {
      setExpand(true);
    }
  }, [data, loading, dispatch]);

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Tally Data:", data);
  // }

  if (
    !(data?.delegates?.nodes?.length > 0 || data?.delegatees?.nodes?.length > 0)
  )
    return null;

  return (
    <div className="profile-widget-full" id={WidgetType.tally}>
      <div
        className={`profile-widget profile-widget-tally${
          expand ? " active" : ""
        }`}
      >
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
                  setExpand(true);
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
                  setExpand(true);
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
                                {x.organization.metadata?.icon ? (
                                  <Image
                                    className="dao-icon"
                                    src={x.organization.metadata?.icon || ""}
                                    height={24}
                                    width={24}
                                    alt={x.organization.name}
                                  />
                                ) : (
                                  <div className="dao-icon"></div>
                                )}
                                <div
                                  className="dao-content text-ellipsis"
                                  title={
                                    x.organization.name +
                                    " - " +
                                    x.organization.slug
                                  }
                                >
                                  {x.organization.name}{" "}
                                  <small className="label">
                                    {x.organization.slug}
                                  </small>
                                </div>
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
                      const delegateeId =
                        x.delegate?.id?.replace("eip155:1:", "") || "";
                      return (
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
                              <div
                                className="dao-content text-ellipsis"
                                title={
                                  x.organization.name +
                                  " - " +
                                  x.organization.slug
                                }
                              >
                                {x.organization.name}{" "}
                                <small className="label">
                                  {x.organization.slug}
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
                              {delegateeId === x.delegator.address ? (
                                <Link
                                  className="feed-token"
                                  href={`${
                                    process.env.NEXT_PUBLIC_BASE_URL ||
                                    "https://web3.bio"
                                  }/${
                                    x.delegator?.ens || x.delegator?.address
                                  }`}
                                  title={
                                    x.delegator?.ens || x.delegator?.address
                                  }
                                  target="_blank"
                                >
                                  <div className="feed-token-value">
                                    {x.delegator?.ens}
                                  </div>
                                  <small className="feed-token-meta">
                                    {formatText(
                                      x.delegator?.address
                                    ).toLowerCase()}
                                  </small>
                                </Link>
                              ) : (
                                <Link
                                  className="feed-token"
                                  href={`${
                                    process.env.NEXT_PUBLIC_BASE_URL ||
                                    "https://web3.bio"
                                  }/${delegateeId}`}
                                  title={x.delegator.id}
                                  target="_blank"
                                >
                                  <div className="feed-token-value">
                                    {formatText(delegateeId.toLowerCase())}
                                  </div>
                                </Link>
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

        {!loading && !expand && (
          <div
            className="btn-widget-more"
            onClick={() => {
              setExpand(true);
            }}
          >
            <button className="btn btn-sm">
              <SVG
                src="../icons/icon-expand.svg"
                width={18}
                height={18}
              />
              View More
            </button>
          </div>
        )}
        {expand && (
          <div className="profile-widget-about">
            Powered by <strong>Tally</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RenderWidgetTally);
