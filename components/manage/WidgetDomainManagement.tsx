import Link from "next/link";
import { ResultAccountItem } from "../search/ResultAccountItem";
import { PlatformType } from "../../utils/platform";
import SVG from "react-inlinesvg";
export default function WidgetDomainManagement(props) {
  const { data, setCurProfile } = props;

  return (
    <div className="domain-list search-result">
      {data?.map((x, idx) => {
        return (
          <ResultAccountItem
            onClick={() => setCurProfile(x)}
            resolvedIdentity={x.identity}
            identity={{
              identity: x.identity,
              platform: x.platform,
              displayName: x.displayName,
            }}
            sources={["Universal Profile API"]}
            profile={x}
            key={idx + x}
            customAction={() =>
              x.platform === PlatformType.ens && (
                <div className="actions active">
                  <Link
                    title="Open Profile"
                    className="btn btn-sm action"
                    href={`https://app.ens.domains/${x.identity}?tab=ownership`}
                    target="_blank"
                  >
                    <SVG src="icons/icon-open.svg" width={20} height={20} />
                    <span className="hide-xs">Extend</span>
                  </Link>
                </div>
              )
            }
            disableAction
          />
        );
      })}
    </div>
  );
}
