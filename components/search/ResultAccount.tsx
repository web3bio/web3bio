import { memo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import { fetchProfile } from "../../hooks/api/fetchProfile";
import { ResultGraph } from "../graph/ResultGraph";
import _ from "lodash";
import { regexEns } from "../../utils/regexp";
import { useDispatch } from "react-redux";
import { updateUniversalBatchedProfile } from "../../state/universal/actions";
import { useSelector } from "react-redux";
import { AppState } from "../../state";

interface Profile {
  uuid: string;
}

const RenderAccount = (props) => {
  const { graphData, resultNeighbor, graphTitle } = props;
  const [open, setOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const dispatch = useDispatch();
  const cached = useSelector<AppState, any>(
    (state) => state.universal.profiles
  );
  console.log(cached, "cached");
  useEffect(() => {
    setProfileLoading(true);
    if (
      !resultNeighbor?.length ||
      !resultNeighbor.some((x) => {
        return [x.identity.displayName, x.identity.identity].includes(
          graphTitle
        );
      })
    )
      return;
    const fetchProfileData = async (arr) => {
      const promises = arr.map((data) => {
        if (data.identity) {
          const res = fetchProfile(data.identity).then((res) => {
            const profile = {
              uuid: data.identity.uuid,
              ...res,
            };
            return profile;
          });
          return res;
        }
      });

      try {
        const results = await Promise.all(promises);
        await dispatch(
          updateUniversalBatchedProfile({
            profiles: results.filter((x) => x.platform && x.address),
          })
        );
        setProfiles(results);
      } catch (error) {
        // do nothing
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData(resultNeighbor);
    return () => setProfiles([]);
  }, [graphTitle, resultNeighbor, dispatch]);
  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {graphData.length > 0 && (
            <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
              Visualize
            </div>
          )}
        </div>
        <div className="search-result-body">
          {resultNeighbor?.map((avatar, idx) => (
            <ResultAccountItem
              canSkipProfile={regexEns.test(avatar.identity.displayName)}
              profileLoading={profileLoading}
              identity={avatar.identity}
              sources={avatar.sources}
              profile={profiles.find((x) => x?.uuid === avatar.identity.uuid)}
              key={avatar.identity.uuid + idx}
            />
          ))}
        </div>
      </div>
      {open && (
        <ResultGraph
          profileLoading={profileLoading}
          onClose={() => setOpen(false)}
          data={graphData.reduce((pre, cur) => {
            pre.push({
              ...cur,
              to: {
                ...cur.to,
                profile: _.find(
                  resultNeighbor,
                  (i) => i.identity.uuid == cur.to.uuid
                )?.identity.profile,
              },
              from: {
                ...cur.from,
                profile: _.find(
                  resultNeighbor,
                  (i) => i.identity.uuid == cur.from.uuid
                )?.identity.profile,
              },
            });
            return pre;
          }, [])}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
