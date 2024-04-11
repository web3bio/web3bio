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

const getNSAddress = (item) => {
  const _chain =
    item.platform === PlatformType.ens
      ? PlatformType.ethereum
      : PlatformType.solana;
  return (
    item.resolveAddress?.find((x) => x.chain === _chain)?.address ||
    item.resolveAddress?.[0].address ||
    item.ownerAddress?.find((x) => x.chain === _chain)?.address ||
    item.ownerAddress?.[0]?.address ||
    item.identity
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
    const domainSkipMap = [
      {
        network: PlatformType.ethereum,
        ns: PlatformType.ens,
      },
      {
        network: PlatformType.solana,
        ns: PlatformType.sns,
      },
    ];
    const _identityGraph = JSON.parse(JSON.stringify(identityGraph));
    _identityGraph.nodes
      .filter((x) => domainSkipMap.some((i) => i.ns === x.platform))
      .forEach((domain) => {
        const networkIdentity = identityGraph.nodes.find(
          (x) =>
            x.identity === domain.ownerAddress[0]?.address &&
            x.platform ===
              domainSkipMap.find((i) => i.ns === domain.platform)?.network
        );
        if (
          networkIdentity?.id &&
          !networkIdentity?.nft.some((i) => i.id === domain.identity)
        ) {
          networkIdentity.nft = [
            ...networkIdentity.nft,
            {
              ...domain,
              id: domain.identity,
            },
          ];
        }
      });

    const _resolved = _identityGraph.nodes
      .filter((x) => {
        return !domainSkipMap.some((i) => i.ns === x.platform);
      })
      .map((x) => {
        return {
          ...x,
          profile: profiles.find((i) => i?.uuid === x.uuid),
        };
      });
    if (
      domainSkipMap.some((x) => x.ns === platform) &&
      !_resolved.some((x) => x.displayName === graphTitle)
    ) {
      const item = identityGraph.nodes
        .filter((x) => domainSkipMap.some((i) => i.ns === x.platform))
        .find((x) => x.identity === graphTitle);
      if (item) {
        _resolved.unshift({
          ...item,
          platform: item.platform,
          displayName: item.identity,
          identity: getNSAddress(item),
          reverse: false,
        });
      }
    } else {
      const index = _resolved.findIndex((x) => {
        return platform === PlatformType.ens
          ? x.displayName === graphTitle && x.platform === PlatformType.ethereum
          : platform === PlatformType.sns
          ? [x.displayName, x.profile?.displayName].includes(graphTitle) &&
            x.platform === PlatformType.solana
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
