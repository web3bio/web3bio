import { memo, useMemo, useCallback } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import { PlatformType } from "../utils/platform";
import Modal from "../modal/Modal";
import useModal, { ModalType } from "../hooks/useModal";
import { useProfiles } from "../hooks/useReduxProfiles";

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
  const { isOpen, type, closeModal, openModal, params } = useModal();
  const profiles = useProfiles();

  const resolvedListData = useMemo(() => {
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
            x.identity === domain.ownerAddress?.[0].address &&
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

    let _resolved = _identityGraph.nodes.filter((x) => {
      return !domainSkipMap.some((i) => i.ns === x.platform);
    });
    // Clusters resolution
    if (
      _resolved.filter((x) => x.platform === PlatformType.clusters).length > 1
    ) {
      const _res = [
        ..._resolved.map((x) => {
          if (
            x.platform === PlatformType.clusters &&
            !x.identity.includes("/")
          ) {
            const child = _resolved.filter(
              (i) =>
                i.platform === PlatformType.clusters &&
                i.identity.includes("/") &&
                i.identity.split("/")[0] === x.identity
            );
            return { ...x, child: child };
          }
          return x;
        }),
      ];

      _resolved = _res.filter(
        (x) =>
          !(x.platform === PlatformType.clusters && x.identity.includes("/"))
      );
    }

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
          ? x.displayName === graphTitle && x.platform === PlatformType.solana
          : graphTitle.includes(x.identity) && x.platform === platform;
      });

      if (index !== -1) {
        const firstItem = JSON.parse(JSON.stringify(_resolved[index]));
        _resolved.splice(index, 1);
        _resolved.unshift(firstItem);
      }
    }

    return _resolved;
  }, [identityGraph, platform, graphTitle]);

  const resolveSources = useCallback((id) => {
    return identityGraph.edges.reduce((pre, x) => {
      if (x.target === id && x.dataSource && !pre.includes(x.dataSource)) {
        pre.push(x.dataSource);
      }
      return pre;
    }, []);
  }, [identityGraph.edges]);

  const handleVisualize = useCallback(() => {
    openModal(ModalType.graph, {
      disableBack: true,
      data: {
        nodes: identityGraph.nodes?.map(x => ({
          ...x,
          profile: profiles.find(i => i?.uuid === x.uuid),
        })),
        edges: identityGraph.edges,
      },
      root: resolvedListData[0],
      title: graphTitle,
    });
  }, [identityGraph, resolvedListData, graphTitle, profiles, openModal]);
  
  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {identityGraph?.nodes.length > 0 && (
            <button
              className="btn btn-link btn-sm"
              onClick={handleVisualize}
            >
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
              Visualize
            </button>
          )}
        </div>
        <div className="search-result-body">
          {resolvedListData.map((avatar, idx) => (
            <ResultAccountItem
              idx={idx}
              identity={avatar}
              sources={resolveSources(`${avatar.platform},${avatar.identity}`)}
              key={`${avatar.uuid}-${idx}`}
            />
          ))}
        </div>
      </div>
      {isOpen && (
        <Modal params={params} onDismiss={closeModal} modalType={type} />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
