import { memo } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { ProfileInterface } from "../../utils/profile";
import { PlatformType } from "../../utils/platform";
import Modal from "../modal/Modal";
import useModal, { ModalType } from "../../hooks/useModal";
import { SocialPlatformMapping } from "../../utils/utils";

const getENSAddress = (ensItem) => {
  return (
    ensItem.resolveAddress?.find((x) => x.chain === PlatformType.ethereum)
      ?.address ||
    ensItem.resolveAddress?.[0].address ||
    ensItem.ownerAddress?.find((x) => x.chain === PlatformType.ethereum)
      ?.address ||
    ensItem.ownerAddress?.[0]?.address ||
    ensItem.identity
  );
};

const RenderAccount = (props) => {
  const { identityGraph, graphTitle, platform } = props;
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const { isOpen, modalType, closeModal, openModal, params } = useModal();
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  const resolvedListData = (() => {
    if (!identityGraph?.nodes) return [];
    const _identityGraph = JSON.parse(JSON.stringify(identityGraph));
    const _resolved = _identityGraph.nodes
      .filter((x) => x.platform !== PlatformType.ens)
      .map((x) => {
        return {
          ...x,
          profile: profiles.find((i) => i?.uuid === x.uuid),
        };
      });
    if (
      platform === PlatformType.ens &&
      !_resolved.some((x) => x.displayName === graphTitle)
    ) {
      const ensItem = identityGraph.nodes
        .filter((x) => x.platform === PlatformType.ens)
        .find((x) => x.identity === graphTitle);
      if (ensItem) {
        _resolved.unshift({
          ...ensItem,
          platform: PlatformType.ens,
          displayName: ensItem.identity,
          identity: getENSAddress(ensItem),
          reverse: false,
        });
      }
    } else {
      const index = _resolved.findIndex((x) => {
        return platform === PlatformType.ens
          ? x.displayName === graphTitle && x.platform === PlatformType.ethereum
          : x.identity === graphTitle && x.platform === platform;
      });

      if (index !== -1) {
        const firstItem = JSON.parse(JSON.stringify(_resolved[index]));
        _resolved.splice(index, 1);
        _resolved.unshift(firstItem);
      }
    }
    return _resolved;
  })();

  const resolveSources = (id: string) => {
    let res: string[] = [];
    identityGraph.edges.forEach((x) => {
      if (x.target === id) {
        const label = SocialPlatformMapping(x.dataSource)?.label;
        if (label && !res.includes(label)) {
          res.push(label);
        }
      }
    });
    return res;
  };
  return (
    <>
      {isOpen && (
        <Modal params={params} onDismiss={closeModal} modalType={modalType} />
      )}
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {identityGraph?.nodes.length > 0 && (
            <div
              className="btn btn-link btn-sm"
              onClick={() => {
                openModal(ModalType.graph, {
                  disableBack: true,
                  data: {
                    nodes: identityGraph.nodes?.map((x) => ({
                      ...x,
                      profile: profiles.find((i) => i?.uuid === x.uuid),
                    })),
                    edges: identityGraph.edges,
                  },
                  root: resolvedListData?.[0],
                  title: graphTitle,
                });
              }}
            >
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
              Visualize
            </div>
          )}
        </div>
        <div className="search-result-body">
          {resolvedListData.map((avatar, idx) => (
            <ResultAccountItem
              identity={avatar}
              sources={resolveSources(`${avatar.platform},${avatar.identity}`)}
              profile={avatar?.profile}
              key={avatar.uuid + idx}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
