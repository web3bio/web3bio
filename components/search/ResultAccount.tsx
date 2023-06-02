import { memo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import { fetchProfile } from "../../hooks/api/fetchProfile";
import { ResultGraph } from "../graph/ResultGraph";
import _ from "lodash";

const RenderAccount = (props) => {
  const { graphData, resultNeighbor, graphTitle, onItemClick } = props;
  const [open, setOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
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
          return fetchProfile(data.identity).then((res) => {
            return {
              uuid: data.identity.uuid,
              ...res,
            };
          });
        }
      });

      try {
        const results = await Promise.all(promises);
        setProfiles(results);
      } catch (error) {
        // do nothing
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData(resultNeighbor);
    return () => setProfiles([]);
  }, [graphTitle, resultNeighbor]);

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
          {resultNeighbor?.map((avatar) => (
            <ResultAccountItem
              onItemClick={onItemClick}
              profileLoading={profileLoading}
              identity={avatar.identity}
              sources={avatar.sources}
              profile={profiles.find((x) => x?.uuid === avatar.identity.uuid)}
              key={avatar.identity.uuid}
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
