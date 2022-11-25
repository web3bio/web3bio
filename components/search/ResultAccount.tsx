import React, { memo, useEffect, useState } from "react";
import { ResultAccountItem } from "./ResultAccountItem";
import { ResultGraph } from "../graph/ResultGraph";
import SVG from "react-inlinesvg";
import { IdentityPanel, TabsMap } from "../panel/IdentityPanel";
import { useRouter } from "next/router";

const RenderAccount = (props) => {
  const { searchTerm, resultNeighbor, graphData } = props;
  const [open, setOpen] = useState(false);
  const [showPanbel, setShowPanel] = useState(false);
  const [identity, setIdentity] = useState(undefined);
  const [panelTab, setPanelTab] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.s && router.query.d) {
      const cachedIentity = localStorage.getItem("cur_identity");
      if (!cachedIentity) return;
      setIdentity(JSON.parse(cachedIentity));
      setShowPanel(true);
    }
  }, [router.isReady, router.query]);

  const resolveShowPanel = (item) => {
    if (!router.isReady || !router.query.s) return;
    router.replace({
      pathname: "",
      query: {
        s: router.query.s,
        d: item.identity,
        t: panelTab,
      },
    });
    localStorage.setItem("cur_identity", JSON.stringify(item));
    setIdentity(item);
    setShowPanel(true);
  };
  return (
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
        {resultNeighbor.length > 0 ? (
          <>
            {resultNeighbor.map((avatar) => (
              <ResultAccountItem
                identity={avatar.identity}
                sources={avatar.sources}
                key={avatar.identity.uuid}
                showPanel={(item) => resolveShowPanel(item)}
              />
            ))}
          </>
        ) : null}
      </div>
      {open && (
        <ResultGraph
          onClose={() => setOpen(false)}
          data={graphData}
          title={searchTerm}
        />
      )}
      {showPanbel && (
        <IdentityPanel
          onTabChange={(v) => {
            router.replace({
              pathname: "",
              query: {
                s: router.query.s,
                d: router.query.d,
                t: v,
              },
            });
            setPanelTab(v);
          }}
          curTab={panelTab}
          identity={identity}
          onShowDetail={(n) => {}}
          onClose={() => {
            setShowPanel(false);
            router.replace({
              pathname: "",
              query: {
                s: router.query.s,
              },
            });
          }}
        />
      )}
    </div>
  );
};

export const ResultAccount = memo(RenderAccount);
