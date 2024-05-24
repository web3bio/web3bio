import useSWR from "swr";
import {
  WALLET_LABELS_END_POINT,
  walletLabelsFetcher,
} from "../apis/walletLabels";
import { regexSolana } from "../utils/regexp";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Loading } from "../shared/Loading";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";

function useWalletLabelsInfo(address: string) {
  const { data, error, isLoading } = useSWR(
    `${WALLET_LABELS_END_POINT}/${
      regexSolana.test(address) ? "solana" : "ethereum"
    }/label?address=${address}`,
    walletLabelsFetcher,
    {
      suspense: true,
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data,
    error,
    loading: isLoading,
  };
}
export function WidgetWalletLabels(props) {
  const { address } = props;
  const { data, error, loading } = useWalletLabelsInfo(address);
  console.log(data, "wallet labels");
  return (
    <div className="rss-item">
      <div className="rss-item-tag">
        <span className="label text-dark">
          <SVG
            fill={"#121212"}
            src={SocialPlatformMapping(PlatformType.walletLabels).icon || ""}
            height={18}
            width={18}
            className="mr-1"
          />
          {SocialPlatformMapping(PlatformType.walletLabels).label}
        </span>
      </div>
      <div className="rss-item-title">
        {loading ? (
          <Loading />
        ) : (
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.walletLabels).icon}{" "}
            </span>
            Wallet Labels{" "}
          </h2>
        )}
      </div>
      {data?.length > 0 && (
        <div className="widget-trait-list">
          {data.map((item, idx) => {
            return (
              <div key={idx} title={item.label}>
                <div className="trait-name">{item.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
