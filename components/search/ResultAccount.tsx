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
import { ProfileInterface } from "../../utils/profile";
import { PlatformType } from "../../utils/platform";

const RenderAccount = (props) => {
  const { graphData, resultNeighbor, graphTitle } = props;
  const [open, setOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const dispatch = useDispatch();
  const cached = useSelector<
    AppState,
    { [address: string]: Record<PlatformType, ProfileInterface> }
  >((state) => state.universal.profiles);
  const profiles = _.flatten(
    Object.values(cached).map((x) => Object.values(x))
  );
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
      try {
        const promises = arr.map((data) => {
          if (
            data.identity &&
            !profiles.some((x) =>
              [x.identity, x.address].includes(data.identity.identity)
            )
          ) {
            return fetchProfile(data.identity).then(x=>({
              ...x,
              uuid: data.identity.uuid
            }));
          }
        });

        const fetchResults = await Promise.all(promises).then((resArr) =>
          resArr.filter((x) => x)
        );
        await dispatch(
          updateUniversalBatchedProfile({
            profiles: fetchResults,
          })
        );
      } catch (error) {
        // do nothing
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfileData(resultNeighbor);
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
                profile: _.find(profiles, (i) => i.uuid == cur.to.uuid),
              },
              from: {
                ...cur.from,
                profile: _.find(profiles, (i) => i.uuid == cur.from.uuid),
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
