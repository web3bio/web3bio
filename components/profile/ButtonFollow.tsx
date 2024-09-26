"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { EFP_ENDPOINT, ProfileFetcher } from "../utils/api";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { isSameAddress } from "../utils/utils";

export default function ButtonFollow(props) {
  const { profile, pageTitle } = props;
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { data: userStats } = useSWR(
    `${EFP_ENDPOINT}/v1/users/${profile.address}/stats`,
    ProfileFetcher
  );
  return (
    <>
      {!isSameAddress(profile.address, address) && (
        <button
          className={`profile-tip btn btn-lg btn-primary`}
          title={`Follow ${pageTitle}`}
          onClick={() => {
            if (!address) {
              openConnectModal?.();
            }
          }}
        >
          <span className="btn-emoji mr-1">😊</span>
          Follow
        </button>
      )}
      <strong>Followers: {userStats?.followers_count}</strong>{" "}
      <strong>Following: {userStats?.following_count}</strong>
    </>
  );
}
