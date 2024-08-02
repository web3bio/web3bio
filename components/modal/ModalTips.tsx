import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSwitchChain,
} from "wagmi";
import { useCurrencyAllowance } from "../hooks/useCurrency";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { erc20Abi, formatEther, parseEther } from "viem";
import { chainIdToNetwork, NetworkData } from "../utils/network";
import { Loading } from "../shared/Loading";
import toast from "react-hot-toast";
import CurrencyInput from "./CurrencyInput";
import { Token } from "../utils/types";
import useSWR from "swr";
import { FIREFLY_PROXY_DEBANK_ENDPOINT } from "../apis/firefly";
import { ProfileFetcher } from "../apis/profile";
import { formatText } from "../utils/utils";

enum TipsStatus {
  success = 1,
  common = 0,
  failed = 2,
}

const donateSuggest = [
  {
    key: 1,
    text: "$ 1",
  },
  {
    key: 3,
    text: "$ 3",
  },
  {
    key: 5,
    text: "$ 5",
  },
];

const isNativeToken = (id: string) => {
  return !id.startsWith("0x");
};

const useTokenList = (address) => {
  const { data, isLoading } = useSWR(
    address
      ? `${FIREFLY_PROXY_DEBANK_ENDPOINT}/v1/user/all_token_list?id=${address}&chain_ids=eth,matic,op,arb,base,zora`
      : null,
    ProfileFetcher
  );
  return {
    data:
      data
        ?.sort(
          (a, b) => Number(isNativeToken(b.id)) - Number(isNativeToken(a.id))
        )
        .filter((x) => x.is_verified) || [],
    isLoading: isLoading,
  };
};

export default function TipModalContent(props) {
  const { onClose, profile } = props;

  const [selected, setSelected] = useState(0);
  const [disablePriceBtn, setDisablePriceBtn] = useState(false);
  const [donatePrice, setDonatePrice] = useState(1);
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();
  const [status, setStatus] = useState(TipsStatus.common);
  const { address } = useAccount();
  const { data: tokenList, isLoading } = useTokenList(address);
  const [token, setToken] = useState<Token | any>();
  const amount = useMemo(() => {
    if (!token?.price) return 0;
    return Number((Number(donatePrice) / Number(token.price)).toFixed(5));
  }, [token, donatePrice]);
  const {
    sendTransaction,
    data: txData,
    isPending: txPrepareLoading,
    error: txPrepareError,
  } = useSendTransaction();

  const {
    writeContract: onCallContract,
    data: contractTx,
    isPending: contractPrepareLoading,
    error: contractPrepareError,
  } = useWriteContract();

  const { isLoading: approveLoading, status: approveStatus } =
    useWaitForTransactionReceipt({
      hash: contractTx,
    });

  const { isLoading: txLoading, status: txStatus } =
    useWaitForTransactionReceipt({
      hash: txData,
    });
  useEffect(() => {
    if (txPrepareError || contractPrepareError) {
      toast.error("Transaction Rejected");
    }
  }, [txPrepareError, contractPrepareError]);
  useEffect(() => {
    if (approveStatus === "success") {
      toast.success(`Successfully approved ${amount} ${token.symbol}`);
    }
    if (txStatus === "success") {
      toast.success(
        `Successfully tipped ${profile.displayName} for ${amount} ${token.symbol}`
      );
      setStatus(TipsStatus.success);
    }
    if (txStatus === "error") {
      setStatus(TipsStatus.failed);
    }

    if (status !== TipsStatus.common) {
      setTimeout(() => {
        setStatus(TipsStatus.common);
      }, 3000);
    }

    if (!tokenList?.length) {
      setToken(null);
    }
  }, [txStatus, approveStatus, status, tokenList]);
  const { data: allowance } = useCurrencyAllowance(token?.id!);

  const RenderButton = useMemo(() => {
    const isBalanceLow = amount >= Number(token?.amount);
    const isAllowanceLow = Number(formatEther(allowance || 0n)) < amount;
    const isButtonLoading =
      txLoading ||
      txPrepareLoading ||
      approveLoading ||
      contractPrepareLoading ||
      isPending;
    contractPrepareLoading;
    const buttonHandle = () => {
      if (chainIdToNetwork(chainId, true) !== token?.chain) {
        return switchChainAsync({
          chainId:
            Object.values(NetworkData)?.find((x) => x.short === token?.chain)
              ?.chainId || 1,
        });
      }
      if (isBalanceLow) return null;
      if (isNativeToken(token?.id))
        return sendTransaction({
          to: profile.address,
          value: parseEther(amount.toString()),
        });
      if (isAllowanceLow)
        return onCallContract({
          abi: erc20Abi,
          address: token?.id!,
          functionName: "approve",
          args: [token?.id!, parseEther(amount.toString())],
        });

      return onCallContract({
        abi: erc20Abi,
        address: token?.id!,
        functionName: "transfer",
        args: [profile.address, parseEther(amount.toString())],
      });
    };
    const ButtonText = (() => {
      if (chainIdToNetwork(chainId, true) !== token?.chain)
        return `Switch to ${token?.chain}`;
      if (!amount || amount <= 0) return "Invalid Amount";
      if (isBalanceLow) return "Insufficient Balance";
      if (isButtonLoading) return "Loading...";
      if (!tokenList?.length) return "No Token Detected";
      if (!isNativeToken(token?.id) && isAllowanceLow)
        return `Approve ${amount} ${token?.symbol}`;

      return `Donate ${formatText(amount?.toString(), 8)} ${token?.symbol}`;
    })();
    return (
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          const isButtonDisabled =
            isBalanceLow ||
            isButtonLoading ||
            !tokenList?.length ||
            amount <= 0;
          return (
            <>
              {(() => {
                if (!connected) {
                  return (
                    <div
                      onClick={openConnectModal}
                      className="btn btn-primary connect-btn"
                    >
                      Connect Wallet
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div
                      onClick={openChainModal}
                      className="btn btn-primary connect-btn wrong-network"
                    >
                      Wrong Network
                    </div>
                  );
                }
                return (
                  <div
                    onClick={buttonHandle}
                    className={`btn btn-primary donate-btn ${
                      isButtonDisabled ? "disabled" : ""
                    }`}
                  >
                    {isButtonLoading && (
                      <div className="loading-btn">
                        <Loading />
                      </div>
                    )}
                    {ButtonText}
                  </div>
                );
              })()}
            </>
          );
        }}
      </ConnectButton.Custom>
    );
  }, [
    address,
    amount,
    token,
    allowance,
    chainId,
    txLoading,
    txPrepareLoading,
    contractPrepareLoading,
    approveLoading,
    isPending,
  ]);

  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      {status === TipsStatus.common ? (
        <div className="modal-tip-body">
          <div className="price-selector">
            {donateSuggest.map((x) => (
              <div
                key={x?.text}
                className={`btn btn-text ${
                  x?.key === selected && !disablePriceBtn ? "btn-primary" : ""
                }`}
                onClick={() => {
                  setDisablePriceBtn(false);
                  setSelected(x.key);
                  setDonatePrice(x.key)
                }}
              >
                {x.text}
              </div>
            ))}

            <input
              type="text"
              className="form-input"
              value={donatePrice}
              onChange={(e) => {
                let value = e.target.value;
                if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
                  value = value.slice(0, -1);
                }
                if (!disablePriceBtn) {
                  setDisablePriceBtn(true);
                }
                setDonatePrice(Number(value));
              }}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <CurrencyInput
            isLoading={isLoading}
            selected={token}
            list={tokenList}
            value={amount}
            disabled={txLoading || txPrepareLoading || !tokenList?.length}
            onSelect={(v) => setToken(v)}
          />

          <div className="btn-group">{RenderButton}</div>
        </div>
      ) : (
        // Tips status
        <div className="modal-tip-body">
          {status === TipsStatus.success
            ? `Tipped ${profile.displayName} with ${amount} ${token.symbol} Successfully!`
            : `Error Occurs`}
        </div>
      )}
    </>
  );
}
