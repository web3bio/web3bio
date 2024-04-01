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
          <table className="table">
            <tr className="table-header">
              <th>DAO</th>
              <th>Votes</th>
              <th>% of Delegated Votes</th>
              <th> </th>
            </tr>
            {renderData.map((x, idx) => {
              return activeTab === 0 ? (
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
