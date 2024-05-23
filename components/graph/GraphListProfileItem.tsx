import { useEffect, useRef, useState } from "react";
import { fetchProfile } from "../hooks/fetchProfile";
import { useDispatch } from "react-redux";
import { updateUniversalBatchedProfile } from "../state/universal/actions";
import ProfileCard from "../profile/ProfileCard";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { SocialRelationMapping } from "./utils";
import Link from "next/link";

export function GraphListProfileItem(props) {
  const { identity, platform, profile, uuid, relations } = props;
  const ref = useRef(null);
  const [fetched, setFetched] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
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
        identity: identity,
        platform: platform,
      }).then((x) => ({
        ...x,
        uuid: uuid,
      }));
      if (response) {
        await dispatch(
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
  }, [fetched, identity, visible, dispatch, platform]);
  return (
    <div ref={ref} className="graph-list-item-wrapper">
      <div className="graph-list-item">
        <Link
          onClick={(e) => {
            e.stopPropagation();
            return false;
          }}
          className="graph-header-action btn btn-link btn-sm"
          href={`https://web3.bio/${identity}`}
          target="_blank"
        >
          <SVG width={20} height={20} src={"icons/icon-open.svg"} />
        </Link>

        <ProfileCard
          classNames={{
            container: "profile-badge",
          }}
          simple
          data={profile}
        />
        <div className="divider" />
        <div className="social-relations">
          {relations.map((x, idx) => {
            return (
              <div key={idx} className="social-relations-item">
                <SVG
                  width={20}
                  fill={SocialPlatformMapping(x.key)?.color}
                  src={SocialPlatformMapping(x.key)?.icon || ""}
                />
                {SocialPlatformMapping(x.key)?.label}
                <div>{SocialRelationMapping(x.action).label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
