import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, colorMod, formatText } from "../../utils/utils";
import SVG from "react-inlinesvg";
export default function WidgetDomainManagement(props) {
  const { data, setCurProfile } = props;

  return (
    <div className="domain-list">
      {data?.map((x, idx) => {
        return (
          <div
            key={x.platform + idx}
            onClick={() => setCurProfile(x)}
            className={`domain-item ${x.platform}${idx === 0 ? " active" : ""}`}
            style={{
              ["--badge-primary-color" as string]:
                SocialPlatformMapping(x.platform).color || "#000",
              ["--badge-bg-color" as string]:
                colorMod(SocialPlatformMapping(x.platform)?.color, 10) ||
                "rgba(#000, .04)",
            }}
          >
            <>
              <div className="domain-icon">
                <SVG
                  fill={SocialPlatformMapping(x.platform).color}
                  width={32}
                  src={SocialPlatformMapping(x.platform).icon || ""}
                />
              </div>
              <div className="domain-name">
                {x.platform === PlatformType.ethereum
                  ? formatText(x.identity)
                  : x.identity}
              </div>
            </>
            <div className="domain-expire-date">
              {/*todo: add expiredate here*/}
              Expire in:
              {x.expireDate || new Date().toUTCString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
