import useSWR from "swr";
import {
  WALLET_LABELS_END_POINT,
  walletLabelsFetcher,
} from "../apis/walletLabels";
import { regexSolana } from "../utils/regexp";

function useWalletLabelsInfo(address: string) {
  const { data, error, isLoading } = useSWR(
    `${WALLET_LABELS_END_POINT}/${
      regexSolana.test(address) ? "solana" : "ethereum"
    }/label?address=${address}`,
    walletLabelsFetcher
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
  return <div>wallet labels</div>;
}
