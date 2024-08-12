import { useEffect, useRef, useState } from "react";
import { fetchProfile } from "../hooks/fetchProfile";
import { updateUniversalBatchedProfile } from "../state/universal/actions";
import { useDispatch } from "react-redux";
import ProfileCard from "../profile/ProfileCard";
import SVG from "react-inlinesvg";
import { formatText } from "../utils/utils";
import { PlatformType } from "../utils/platform";
import Link from "next/link";

export default function PoapNFTOwner({ address, profile }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [fetched, setFetched] = useState(false);

  const dispatch = useDispatch();
  const relatedPath = `${profile?.identity}${
    profile?.platform?.toLowerCase() === PlatformType.farcaster
      ? ".farcaster"
      : ""
  }`;

  useEffect(() => {
    const element = ref?.current;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);

    if (element) {
      observer.observe(element);
    }

    const fetchProfileData = async () => {
      const response = await fetchProfile({
        identity: address,
        platform: PlatformType.ethereum,
      }).then((x) => ({
        ...x,
        uuid: x.address,
      }));
      if (response) {
        dispatch(
          updateUniversalBatchedProfile({
            profiles: [response],
          })
        );
        setFetched(true);
      }
    };
    if (!fetched && visible) {
      fetchProfileData();
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [fetched, address, visible, dispatch]);
  return (
    <div ref={ref} className="widget-list-item">
      <div className="list-item-left">
        {(profile && (
          <ProfileCard
            classNames={{
              container: "profile-badge",
            }}
            simple
            data={profile}
          />
        )) ||
          formatText(address)}
      </div>
      {profile && (
        <Link
          href={`/${relatedPath}`}
          target="_blank"
          className="list-item-right btn btn-link btn-sm"
        >
          <SVG width={20} height={20} src="icons/icon-open.svg" />
        </Link>
      )}
    </div>
  );
}
