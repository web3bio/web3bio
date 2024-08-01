import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useCurrencyAllowance } from "../hooks/useCurrency";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import { erc20Abi, formatEther, parseEther } from "viem";
import { chainIdToNetwork } from "../utils/network";
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
  const [amount, setAmount] = useState(0.01);
  const chainId = useChainId();
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [nickName, setNickName] = useState(profile.displayName);
  const [message, setMessage] = useState("");
  const { openChainModal } = useChainModal();
  const [status, setStatus] = useState(TipsStatus.common);
  const { address } = useAccount();
  const { data: tokenList, isLoading } = useTokenList(address);

  const [token, setToken] = useState<Token | any>(tokenList?.[0]);
  useEffect(() => {
    if (tokenList?.length > 0) {
      setToken(tokenList[0]);
    }
  }, [tokenList?.[0]?.chain]);

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
      txLoading || txPrepareLoading || approveLoading || contractPrepareLoading;
    contractPrepareLoading;
    const buttonHandle = () => {
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
          if (chain?.unsupported) {
            setWrongNetwork(true);
          } else {
            setWrongNetwork(false);
          }
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
    txLoading,
    txPrepareLoading,
    contractPrepareLoading,
    approveLoading,
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
          <CurrencyInput
            isLoading={isLoading}
            selected={wrongNetwork ? null : token}
            list={wrongNetwork ? [] : tokenList}
            value={amount}
            disabled={txLoading || txPrepareLoading || !tokenList?.length}
            onChange={(v) => {
              let value = v;
              if (!/^[0-9]*\.?[0-9]*$/.test(v)) {
                value = value.slice(0, -1);
              }
              setAmount(value);
            }}
            onSelect={(v) => setToken(v)}
          />

          <input
            className="common-input"
            type="text"
            placeholder="Text your nickname here"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
          <textarea
            className="common-input message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Text your message here"
            rows={4}
            maxLength={300}
          />
          <div className="btn-group">
            {RenderButton}
            {address && !wrongNetwork && (
              <div onClick={openChainModal} className="btn btn-primary">
                Switch Network
              </div>
            )}
          </div>
        </div>
      ) : (
        // Tips status
        <div className="modal-tip-body">
          {status === TipsStatus.success
            ? `Tipped ${profile.displayName} with ${amount} ${token.symbol} Successfully!`
            : `Error Occurs`}
        </div>
      )}
      {address && !wrongNetwork && (
        <div className="network-badge">
          <span className="green-dot"></span> {chainIdToNetwork(chainId)}
        </div>
      )}
    </>
  );
}
