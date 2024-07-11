import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useCurrencyAllowance, useCurrencyBalance } from "../hooks/useCurrency";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import { erc20Abi, formatEther, parseEther } from "viem";
import { tipsTokenMapping } from "../utils/tips";
import { Network, NetworkMapping, chainIdToNetwork } from "../utils/network";
import { Loading } from "../shared/Loading";
import toast from "react-hot-toast";
import CurrencyInput from "./CurrencyInput";

export default function TipModalContent(props) {
  const { onClose, profile } = props;
  const [amount, setAmount] = useState(0.01);
  const chainId = useChainId();
  const defaultToken = useMemo(() => {
    const network = chainIdToNetwork(chainId);
    if (network) return tipsTokenMapping[network][0];
    return tipsTokenMapping[Network.ethereum][0];
  }, [chainId]);

  const [token, setToken] = useState(defaultToken);
  const [nickName, setNickName] = useState(profile.displayName);
  const [message, setMessage] = useState("");
  const { openChainModal } = useChainModal();
  const { address } = useAccount();
  useEffect(() => {
    if (defaultToken) {
      setToken(defaultToken);
    }
  }, [defaultToken]);
  const { data: balance } = useCurrencyBalance(token.address!);
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
    if (approveStatus === "success") {
      toast.success(`Successfully approved ${amount} ${token.symbol}`);
    }
    if (txStatus === "success") {
      toast.success(
        `Successfully tipped ${profile.displayName} for ${amount} ${token.symbol}`
      );
    }
  }, [txStatus, txPrepareError, approveStatus, contractPrepareError]);
  const { data: allowance } = useCurrencyAllowance(token.address!);

  const RenderButton = useMemo(() => {
    const isBalanceLow = amount >= Number(formatEther(balance?.value || 0n));
    const isAllowanceLow = Number(formatEther(allowance || 0n)) < amount;
    const isButtonLoading =
      txLoading || txPrepareLoading || approveLoading || contractPrepareLoading;
    contractPrepareLoading;
    const buttonHandle = () => {
      if (isBalanceLow) return null;
      if (token.isNativeToken)
        return sendTransaction({
          to: profile.address,
          value: parseEther(amount.toString()),
        });
      if (isAllowanceLow)
        return onCallContract({
          abi: erc20Abi,
          address: token.address!,
          functionName: "approve",
          args: [token.address!, parseEther(amount.toString())],
        });

      return onCallContract({
        abi: erc20Abi,
        address: token.address!,
        functionName: "transfer",
        args: [profile.address, parseEther(amount.toString())],
      });
    };
    const ButtonText = (() => {
      if (isBalanceLow) return "Insufficient Balance";
      if (isButtonLoading) return "Loading...";
      if (!token.isNativeToken && isAllowanceLow)
        return `Approve ${amount} ${token.symbol}`;

      return `Donate ${amount} ${token.symbol}`;
    })();
    return (
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
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
                      isBalanceLow || isButtonLoading ? "disabled" : ""
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
    balance,
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
      <div className="modal-tip-body">
        <CurrencyInput
          selected={token}
          value={amount}
          disabled={txLoading || txPrepareLoading}
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
          <div onClick={openChainModal} className="btn btn-primary">
            Switch Network
          </div>
        </div>

    
      </div>
      <div className="network-badge" >
           <span className="green-dot"></span> {chainIdToNetwork(chainId)}
        </div>
    </>
  );
}
