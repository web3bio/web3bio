"use client";
import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import useSWR from "swr";
import { BanklessFetcher } from "../utils/api";
import { Loading } from "../shared/Loading";
import BanklessItem from "./BanklessItem";

enum ClaimStatus {
  unclaimde = "unclaimed",
  claimed = "claimed",
  expired = "expired",
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function WidgetBankless({ address, openModal }) {
  const [expand, setExpand] = useState(false);
  const [activeTab, setActiveTab] = useState(ClaimStatus.unclaimde);
  const { data, isLoading, error } = useSWR(
    `/api/metadata/bankless/${address}`,
    BanklessFetcher
  );
  const resolvedItems = useMemo(() => {
    if(!data?.length) return []
    return data.filter((x) => x.claimStatus === activeTab);
  }, [data, activeTab]);
  useEffect(() => {
    if (resolvedItems.length >= 0 && resolvedItems.length < 5) {
      setExpand(true);
    }
  }, [resolvedItems]);

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("BankLess Data:", data);
  // }

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
          <div className="widget-action">
            <div className="btn-group">
              {["unclaimed", "claimed", "expired"].map((x) => (
                <button
                  key={x}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab(x as ClaimStatus);
                    setExpand(true);
                  }}
                  className={`btn btn-sm${
                    (activeTab === x && " active") || ""
                  }`}
                >
                  {capitalizeFirstLetter(x)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : error ? (
          <Error />
        ) : (
          <div className="profile-widget-body">
            {resolvedItems?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Worth</th>
                    <th>Expire Date</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedItems.map((x, idx) => {
                    return <BanklessItem key={"td" + x.title} data={x} />;
                  })}
                </tbody>
              </table>
            ) : (
              <Empty
                title={`No Airdrops Detected`}
                text={`Please switch to another account`}
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
