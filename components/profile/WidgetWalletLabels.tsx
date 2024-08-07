import useSWR from "swr";
import { regexSolana } from "../utils/regexp";
import { Loading } from "../shared/Loading";
// import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { WALLET_LABELS_END_POINT, walletLabelsFetcher } from "../apis";
// import { updateWalletLabels } from "../state/widgets/action";

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
  const dispatch = useDispatch();
  useEffect(() => {
    // if (!!data?.data) {
    //   dispatch(
    //     updateWalletLabels({
    //       isEmpty: !data?.data?.length,
    //       initLoading: false,
    //     })
    //   );
    // }
  }, [data, dispatch]);
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("WalletLabels Data:", data?.data);
  // }
  return (
    <div className="rss-item">
      <div className="rss-item-title">
        {loading ? (
          <Loading />
        ) : (
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🏷️ </span>
            WalletLabels{" "}
          </h2>
        )}
      </div>
      {data?.data?.length > 0 && (
        <div className="widget-trait-list">
          {data.data.map((item, idx) => {
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
