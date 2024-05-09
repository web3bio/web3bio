import SVG from "react-inlinesvg";
import useSWR from "swr";
import { waprcastFetcher } from "../apis/farcaster";
import { Loading } from "../shared/Loading";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";

export default function FarcasterProfileCard(props) {
  const { handle, link } = props;
  const [fid, setFid] = useState(null);
  const { data, isLoading, error } = useSWR(
    handle ? `v2/user-by-username?username=${handle}` : null,
    waprcastFetcher
  );

  const {
    data: channelsData,
    trigger,
    isMutating,
  } = useSWRMutation(
    `v2/user-following-channels?fid=${fid}`,
    waprcastFetcher,
    {}
  );

  useEffect(() => {
    if (data?.result?.user?.fid) {
      setFid(data.result.user.fid);
    }
    if (fid) {
      trigger();
    }
  }, [data, fid, trigger]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="modal-profile-header">
        <div className="modal-profile-id">#{fid}</div>
        <Link href={link} target="_blank" className="btn btn-action">
          <SVG src={"icons/icon-open.svg"} width={20} height={20} />
        </Link>
      </div>
      <div className="modal-profile-body">
        <Avatar alt={handle} src={""} identity={handle} />
      </div>
    </>
  );
}
