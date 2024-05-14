import { useEffect, useRef, useState } from "react";
import { fetchProfile } from "../hooks/fetchProfile";
import { useDispatch } from "react-redux";
import { updateUniversalBatchedProfile } from "../state/universal/actions";
import ProfileCard from "../profile/ProfileCard";

export function GraphListProfileItem(props) {
  const { key, identity, platform, profile, uuid } = props;
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
    <div ref={ref} key={key} className="graph-list-item">
      <ProfileCard
        classNames={{
          container: "profile-badge",
        }}
        simple
        data={profile}
      />
      <div className="divider" />
      <div className="social-relations" >
        mutal Follows
      </div>
    </div>
  );
}
