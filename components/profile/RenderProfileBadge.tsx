import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ProfileFetcher } from "../apis/profile";
import Image from "next/image";
import Link from "next/link";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { formatText } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";
import { Avatar } from "../shared/Avatar";
import Trigger from "@rc-component/trigger";

interface RenderProfileBadgeProps {
  identity: string;
  platform?: PlatformType;
  remoteFetch?: boolean;
  parentRef?: Element;
}

export default function RenderProfileBadge(props: RenderProfileBadgeProps) {
  const {
    parentRef,
    identity,
    platform = PlatformType.ens,
    remoteFetch,
  } = props;
  const [visible, setVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef(null);
  const { data, isValidating, error } = useSWR(
    !fetched && remoteFetch && visible && identity && platform
      ? process.env.NEXT_PUBLIC_PROFILE_END_POINT +
          `/ns/${platform.toLowerCase()}/${identity}`
      : null,
    ProfileFetcher,
    { keepPreviousData: true }
  );
  const relatedPath = `${identity}${
    platform === PlatformType.farcaster ? ".farcaster" : ""
  }`;

  useEffect(() => {
    const element = ref?.current;
    const options = {
      // parent element or window
      root: parentRef,
      rootMargin: "0px",
      threshold: 0.6,
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
        targetOffset: [0, 80],
      }}
      popupStyle={{
        display: showPopup && data ? "block" : "none",
        position: "absolute",
      }}
      autoDestroy
      onPopupVisibleChange={(visible) => setShowPopup(visible)}
      popup={
        <div className="profile-card">
          <div className="profile-card-action">
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/${relatedPath}`}
              target="_blank"
              className="btn btn-sm"
            >
              <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
            </Link>
          </div>
          <div className="profile-card-avatar">
            {(data?.avatar || data?.identity) && (
              <Avatar
                src={data?.avatar}
                identity={data?.identity}
                className="avatar"
                alt={`${data?.displayName} Profile Photo`}
                height={40}
                width={40}
              />
            )}
          </div>
          <div className="profile-card-name">
            {data?.displayName || formatText(identity)}
          </div>
          <Clipboard
            component="div"
            className="profile-card-address c-hand"
            data-clipboard-text={data?.address}
            title="Copy the wallet address"
          >
            {formatText(data?.address)}
            <SVG
              src="../icons/icon-copy.svg"
              width={20}
              height={20}
              className="action"
            />
          </Clipboard>
          <div className="profile-card-description">{data?.description}</div>
        </div>
      }
    >
      <div ref={ref} className="feed-token">
        {data?.avatar && (
          <Image
            className="feed-token-icon"
            src={data.avatar}
            alt={data.displayName}
            height={20}
            width={20}
            loading="lazy"
          />
        )}

        <span
          className="feed-token-value"
          title={data?.displayName || identity}
        >
          {data?.displayName || formatText(identity)}
        </span>
      </div>
    </Trigger>
  );
}
