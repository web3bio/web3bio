import { memo, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { formatText, isWeb3Address } from "../utils/utils";
import { PlatformType } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
import Trigger from "@rc-component/trigger";
import ProfileCard from "../profile/ProfileCard";
import { ProfileFetcher, profileAPIBaseURL } from "../utils/api";

interface RenderProfileBadgeProps {
  identity: string;
  platform?: PlatformType;
  remoteFetch?: boolean;
  parentRef?: Element;
  fullProfile?: boolean;
  offset?: Array<number>;
}

function RenderProfileBadge(props: RenderProfileBadgeProps) {
  const {
    parentRef,
    identity,
    platform = PlatformType.ens,
    remoteFetch,
    fullProfile = false,
    offset,
  } = props;

  const [visible, setVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef(null);
  const { data } = useSWR(
    !fetched && remoteFetch && visible && identity && platform
      ? `${profileAPIBaseURL}/ns/${platform.toLowerCase()}/${identity}`
      : null,
    ProfileFetcher,
    { keepPreviousData: true }
  );

  useEffect(() => {
    const element = ref?.current;
    const options = {
      // parent element or window
      root: parentRef,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);

    if (element) {
      observer.observe(element);
    }

    if (data) {
      setFetched(true);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [parentRef, data]);
  return (
    <Trigger
      action={["hover", "focus"]}
      popupVisible={showPopup}
      popupAlign={{
        points: ["bc", "tc"],
        offset: offset || [0, -5],
      }}
      popupStyle={{
        display: showPopup && data ? "block" : "none",
        position: "absolute",
        zIndex: 9999,
      }}
      autoDestroy
      onPopupVisibleChange={(visible) => setShowPopup(visible)}
      popup={<ProfileCard data={data} />}
    >
      <div ref={ref} className="feed-token c-hand">
        {data?.identity && (
          <Avatar
            className="feed-token-icon"
            src={data?.avatar}
            alt={data?.displayName}
            identity={data?.identity}
            height={20}
            width={20}
          />
        )}
        <span
          className="feed-token-value"
          title={
            data?.displayName ? `${data?.displayName} (${identity})` : identity
          }
        >
          {data?.displayName ||
            (isWeb3Address(identity) ? formatText(identity) : identity)}
        </span>
        {data?.identity && fullProfile && (
          <span className="feed-token-meta">
            {isWeb3Address(data?.identity)
              ? formatText(data?.identity) === data?.displayName
                ? ""
                : formatText(data?.identity)
              : data?.identity === data?.displayName
              ? ""
              : data?.identity}
          </span>
        )}
      </div>
    </Trigger>
  );
}

export default memo(RenderProfileBadge);
