import { ResultAccountItem } from "../search/ResultAccountItem";
export default function WidgetDomainManagement(props) {
  const { data, setCurProfile } = props;

  return (
    <div className="domain-list search-result">
      {data?.map((x, idx) => {
        return (
          <ResultAccountItem
            onClick={()=>setCurProfile(x)}
            resolvedIdentity={x.identity}
            identity={{
              identity: x.identity,
              platform: x.platform,
              displayName: x.displayName,
            }}
            sources={["Universal Profile API"]}
            profile={x}
            key={idx + x}
            disableAction
          />
        );
      })}
    </div>
  );
}
