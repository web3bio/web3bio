import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ProfileFetcher } from "../apis/profile";
import Image from "next/image";
import { formatText } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";

interface RenderProfileBadgeProps {
  identity: string;
  platform?: PlatformType;
  remoteFetch?: boolean;
  parentRef?: Element;
}

export default function RenderProfileBadge(props: RenderProfileBadgeProps) {
  const { parentRef, identity, platform, remoteFetch } = props;
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const { data, isValidating, error } = useSWR(
    remoteFetch && visible && identity && platform
      ? process.env.NEXT_PUBLIC_PROFILE_END_POINT +
          `/ns/${platform.toLowerCase()}/${identity}`
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
      threshold: 0.6,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);

    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [parentRef]);

  return (
    <div ref={ref} className="feed-token">
      {visible ? (
        <>
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
            {formatText(data?.displayName || identity)}
          </span>
        </>
      ) : null}
    </div>
  );
}
