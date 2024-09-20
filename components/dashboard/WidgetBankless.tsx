"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { formatBalance } from "../utils/utils";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";

import useSWR from "swr";
import {  BanklessFetcher } from "../utils/api";
import { Loading } from "../shared/Loading";

export default function WidgetBankless({ address, openModal }) {
  const [expand, setExpand] = useState(false);

  const { data, isLoading, error } = useSWR(
    `/api/metadata/bankless/${address}`,
    BanklessFetcher
  );
  //   useEffect(() => {

  //     if (
  //       (data?.delegates?.nodes?.length > 0 &&
  //         data?.delegates?.nodes?.length < 4) ||
  //       (!data?.delegates?.nodes?.length && data?.delegatees?.nodes?.length < 4)
  //     ) {
  //       setExpand(true);
  //     }
  //   }, [data, loading, dispatch]);

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("BankLess Data:", data);
  // }

  if (!data?.length) return null;

  return (
    <div className="profile-widget-full" id={WidgetType.bankless}>
      <div
        className={`profile-widget profile-widget-bankless${
          expand ? " active" : ""
        }`}
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {" "}
              {WidgetInfoMapping(WidgetType.bankless).icon}
            </span>
            Available Vaults
          </h2>
        </div>

        {isLoading ? (
          <Loading />
        ) : error ? (
          <Error />
        ) : (
          <div className="profile-widget-body">
            {data?.delegates?.nodes.length > 0 ? (
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
            )}
          </div>
        )}

        {!isLoading && !expand && (
          <div
            className="btn-widget-more"
            onClick={() => {
              setExpand(true);
            }}
          >
            <button className="btn btn-sm">
              <SVG src="../icons/icon-expand.svg" width={18} height={18} />
              View More
            </button>
          </div>
        )}
        {expand && (
          <div className="profile-widget-about">
            Powered by <strong>Bankless</strong>
          </div>
        )}
      </div>
    </div>
  );
}
