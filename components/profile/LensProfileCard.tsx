import SVG from "react-inlinesvg";
import { Loading } from "../shared/Loading";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import { useQuery } from "@apollo/client";
import { GET_PROFILE_LENS } from "../utils/lens";
import { useEffect, useState } from "react";

export default function LensProfileCard(props) {
  const { handle, link, avatar } = props;
  const [heyScore, setHeyScore] = useState(null);
  const { data, loading, error } = useQuery(GET_PROFILE_LENS, {
    variables: {
      request: { forHandle: "lens/" + handle.replace(".lens", "") },
    },
    context: {
      clientName: "lens",
    },
  });
  useEffect(() => {
    const getHeyScore = async () => {
      // const res = await fetch(
      //   "https://api.hey.xyz/score/get?id=" + data.profile.id,
      // )
      //   .then((res) => res.json())
      //   .catch((e) => null);
      // if (res?.success) {
      //   setHeyScore(res.score);
      // }
    };
    // if (data?.profile?.id) {
    //   getHeyScore();
    // }
  }, [data]);

  return loading || !data?.profile ? (
    <Loading />
  ) : (
    <>
      <div className="modal-profile-header">
        <div className="modal-profile-id">#{data.profile.id}</div>
        <Link href={link} target="_blank" className="btn btn-action">
          <SVG src={"icons/icon-open.svg"} width={20} height={20} />
        </Link>
      </div>
      <div className="modal-profile-body">
        <Avatar
          width={150}
          className="avatar"
          alt={handle}
          src={avatar}
          identity={handle}
        />
        <div className="modal-profile-name">
          <strong>{data.profile.metadata.displayName} </strong>/
          <span>{data.profile.handle.suggestedFormatted.localName}</span>
        </div>
        <div className="modal-profile-follows">
          <div>{data.profile.stats.following} Following</div> ·{" "}
          <div>{data.profile.stats.followers} Followers</div>
        </div>
        <div className="modal-profile-location">
          {
            data.profile.metadata.attributes?.find((x) => x.key === "location")
              ?.value
          }
        </div>
        <div className="divider"></div>
        <div className="modal-profile-bio">{data.profile.metadata.bio}</div>
        <div>Posts: {data.profile.stats.posts}</div>
        <div>Mirrors: {data.profile.stats.mirrors}</div>
        <div>Publications: {data.profile.stats.publications}</div>
        <div>Quotes: {data.profile.stats.quotes}</div>
        <div>
          Proof of human:{" "}
          {data.profile.onchainIdentity.proofOfHumanity.toString()}
        </div>
        <div>
          SybilDotOrg:{" "}
          {data.profile.onchainIdentity.sybilDotOrg.source?.twitter?.handle}
        </div>
        <div>
          World Coin is Humain:{" "}
          {data.profile.onchainIdentity.worldcoin.isHuman.toString()}
        </div>
        <div>
          Hey Score:
          {heyScore}
        </div>
        <div>
          Interests:{" "}
          {data.profile.interests.map((x) => {
            return (
              <>
                <strong key={x}>{x}</strong>
                <br />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
