import SVG from "react-inlinesvg";
import useSWR from "swr";
import { WEBACY_API_ENDPOINT, webacyFetcher } from "../apis/webacy";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { regexSolana } from "../utils/regexp";
import { Loading } from "../shared/Loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateWebacyWidget } from "../state/widgets/action";

export function WidgetWebacy({ address }) {
  const { data, error, isLoading } = useSWR(
    `${WEBACY_API_ENDPOINT}/addresses/${address}?chain=${
      regexSolana.test(address) ? "sol" : "eth"
    }`,
    webacyFetcher
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!!data) {
      dispatch(
        updateWebacyWidget({
          isEmpty: isNaN(data?.overallRisk),
          initLoading: false,
        })
      );
    }
  }, [data, dispatch]);
  return (
    <div className="rss-item">
      <div className="rss-item-title">
        {isLoading ? (
          <Loading />
        ) : (
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.webacy).icon}{" "}
            </span>
            WebacyScore{" "}
            <span className="label ml-2">
              {Number(data?.overallRisk).toFixed(2)}
            </span>
          </h2>
        )}
      </div>
    </div>
  );
}
