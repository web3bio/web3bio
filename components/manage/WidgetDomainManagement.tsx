import Link from "next/link";
import { ResultAccountItem } from "../search/ResultAccountItem";
import SVG from "react-inlinesvg";
import { PlatformType } from "../utils/platform";
export default function WidgetDomainManagement(props) {
  const { data, setCurProfile } = props;

  return (
    <div className="domain-list search-result">
      {data?.map((x, idx) => {
        return (
          <ResultAccountItem
            onClick={() => setCurProfile(x)}
            resolvedIdentity={x.identity}
            expiredAt={x.expiredAt}
            identity={{
              identity: x.identity,
              platform: x.platform,
              displayName: x.displayName,
            }}
            profile={x}
            key={idx + x}
            customAction={
              !x.expiredAt || x.expiredAt * 1000 <= new Date().getTime()
                ? () => {
                    return (
                      <div className="actions active">
                        <Link
                          title="Extend the Domain"
                          className="btn btn-sm action"
                          href={
                            x.platform === PlatformType.ens
                              ? `https://app.ens.domains/${x.identity}?tab=ownership`
                              : `https://d.id/data/${x.identity}?action=renew`
                          }
                          target="_blank"
                        >
                          <SVG
                            src="icons/icon-open.svg"
                            width={20}
                            height={20}
                          />
                          <span className="hide-xs">Extend</span>
                        </Link>
                      </div>
                    );
                  }
                : null
            }
            disableAction
          />
        );
      })}
    </div>
  );
}
