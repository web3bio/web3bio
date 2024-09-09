import { useEffect, useMemo, useRef, useState } from "react";
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
import { erc20Abi, formatUnits, parseEther, parseUnits } from "viem";
import { chainIdToNetwork, networkByIdOrName } from "../utils/network";
import { Loading } from "../shared/Loading";
import { Avatar } from "../shared/Avatar";
import toast from "react-hot-toast";
import TokenSelector from "./TipTokenSelector";
import { Token } from "../utils/types";
import useSWR from "swr";
import { formatText } from "../utils/utils";
import { FIREFLY_PROXY_DEBANK_ENDPOINT, ProfileFetcher } from "../utils/api";
import WalletChip from "./TipWalletChip";

enum TipStatus {
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
      ? `${FIREFLY_PROXY_DEBANK_ENDPOINT}/v1/user/all_token_list?id=${address}&chain_ids=eth,matic,op,arb,base,zora&is_all=false`
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
  const { onClose, profile, tipEmoji, tipObject } = props;
  const [disablePriceBtn, setDisablePriceBtn] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const [selectPrice, setSelectPrice] = useState(3);
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();
  const [status, setStatus] = useState(TipStatus.common);
  const { address } = useAccount();
  const { data: tokenList, isLoading } = useTokenList(address);
  const [token, setToken] = useState<Token | any>();
  const amount = useMemo(() => {
    const donatePrice = customPrice || selectPrice;
    if (!token?.price) return 0;
    return Number((Number(donatePrice) / Number(token.price)).toFixed(5));
  }, [token, customPrice, selectPrice]);
  const customInput = useRef<HTMLInputElement>(null);

  // config ---------- start
  const {
    sendTransaction,
    data: txData,
    isPending: txPrepareLoading,
    error: txPrepareError,
  } = useSendTransaction();

  const {
    writeContract: onCallApprove,
    data: approveTx,
    isPending: approvePrepareLoading,
    error: ApprovePrepareError,
  } = useWriteContract();

  const { isLoading: approveLoading, status: approveStatus } =
    useWaitForTransactionReceipt({
      hash: approveTx,
    });

  const { isLoading: txLoading, status: txStatus } =
    useWaitForTransactionReceipt({
      hash: txData,
    });
  // config ---------- end

  // status ---------- start
  useEffect(() => {
    if (txPrepareError || ApprovePrepareError) {
      toast.error("Transaction Rejected");
    }
  }, [txPrepareError, ApprovePrepareError]);
  useEffect(() => {
    if (status !== TipStatus.common) {
      setTimeout(() => {
        setStatus(TipStatus.common);
      }, 3000);
    }

    if (!tokenList?.length) {
      setToken(null);
    }
  }, [status, tokenList]);

  useEffect(() => {
    if (approveStatus === "success") {
      toast.success(`Successfully approved ${amount} ${token.symbol}`);
    } else if (approveStatus === "error") {
      toast.error(`Approve ${amount} ${token.symbol} failed`);
    }
    if (txStatus === "success") {
      toast.success(
        `Successfully tipped ${profile.displayName} for ${amount} ${token.symbol}`
      );
      setStatus(TipStatus.success);
    } else if (txStatus === "error") {
      toast.success(
        `Tip ${profile.displayName} for ${amount} ${token.symbol} failed`
      );
      setStatus(TipStatus.failed);
    }
  }, [txStatus, approveStatus]);

  // status ---------- end
  const { data: allowance } = useCurrencyAllowance(token?.id!);
  const RenderButton = useMemo(() => {
    const isBalanceLow = amount >= Number(token?.amount);
    const isAllowanceLow =
      Number(formatUnits(allowance || 0n, token?.decimals || 18)) < amount;
    const isButtonLoading =
      txLoading ||
      txPrepareLoading ||
      approveLoading ||
      approvePrepareLoading ||
      isPending;

    const shouldChangeNetwork =
      chainIdToNetwork(chainId, true) !== token?.chain;

    const buttonHandle = () => {
      if (chainIdToNetwork(chainId, true) !== token?.chain) {
        return switchChainAsync({
          chainId: networkByIdOrName(0, token.chain)?.chainId || 1,
        });
      }
      if (isBalanceLow) return null;
      if (isNativeToken(token?.id))
        return sendTransaction({
          to: profile.address,
          value: parseEther(amount.toString()),
        });
      if (isAllowanceLow)
        return onCallApprove({
          chainId: chainId,
          abi: erc20Abi,
          address: token?.id!,
          functionName: "approve",
          args: [token?.id!, parseEther(amount.toString())],
        });

      return onCallApprove({
        chainId: chainId,
        abi: erc20Abi,
        address: token?.id!,
        functionName: "transfer",
        args: [
          profile.address,
          parseUnits(amount.toString(), token?.decimals || 18),
        ],
      });
    };
    const ButtonText = (() => {
      if (shouldChangeNetwork) return `Change Network`;
      if (!amount || amount <= 0) return "Invalid Amount";
      if (isBalanceLow) return "Insufficient Balance";
      if (txLoading || approveLoading) return "Waiting For Transaction...";
      if (txPrepareLoading || approvePrepareLoading)
        return "Confirm In Your Wallet...";
      if (!tokenList?.length) return "No Tokens Detected";
      if (!isNativeToken(token?.id) && isAllowanceLow)
        return `Approve ${amount} ${token?.symbol}`;

      return `Pay ${formatText(amount?.toString(), 8)} ${token?.symbol}`;
    })();
    return (
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          const isButtonDisabled =
            !shouldChangeNetwork &&
            (isBalanceLow ||
              isButtonLoading ||
              !tokenList?.length ||
              amount <= 0);
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
    approvePrepareLoading,
    onCallApprove,
    sendTransaction,
    switchChainAsync,
    approveLoading,
    isPending,
  ]);

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <div className="modal-header">
        <div className="modal-header-title">Buy Me a {tipObject}</div>
      </div>
      {status === TipStatus.common ? (
        <div className="modal-body">
          <div className="form">
            <div className="form-group form-hero">
              <label style={{ fontSize: "64px", lineHeight: "64px" }}>
                {tipEmoji}
              </label>
              <div className="amount-selector">
                {[1, 3, 5].map((x) => (
                  <div
                    key={x}
                    className={`btn btn-text btn-price ${
                      x === selectPrice && !disablePriceBtn ? "btn-primary" : ""
                    }`}
                    onClick={() => {
                      setDisablePriceBtn(false);
                      setSelectPrice(x);
                      setCustomPrice("");
                    }}
                  >
                    {x}
                  </div>
                ))}

                <input
                  ref={customInput}
                  type="text"
                  className="form-input"
                  value={customPrice}
                  placeholder="Custom"
                  pattern="^\d*\.?\d*$"
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
                      value = value.slice(0, -1);
                    }
                    if (!disablePriceBtn) {
                      setDisablePriceBtn(true);
                    }
                    setCustomPrice(e.target.value);
                  }}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="col-12 col-sm-12">
                <label className="form-label">To</label>
              </div>
              <div className="col-12 col-sm-12">
                <div className="chip chip-full chip-button">
                  <div className="chip-icon">
                    <Avatar
                      src={profile?.avatar}
                      className="avatar"
                      alt={`Profile Photo`}
                      height={"1.6rem"}
                      width={"1.6rem"}
                      itemProp="image"
                    />
                  </div>
                  <div className="chip-content">
                    <div className="chip-title">{profile?.displayName}</div>
                    <div className="chip-subtitle text-gray hide-sm">
                      {profile?.address}
                    </div>
                    <div
                      className="chip-subtitle text-gray show-sm"
                      title={profile?.address}
                    >
                      {formatText(profile?.address)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="col-12 col-sm-12 justify-between">
                <label className="form-label">Pay with</label>
                <WalletChip />
              </div>
              <div className="col-12 col-sm-12">
                {address ? (
                  <TokenSelector
                    isLoading={isLoading}
                    selected={token}
                    list={tokenList}
                    value={amount}
                    disabled={
                      txLoading || txPrepareLoading || !tokenList?.length
                    }
                    onSelect={(v) => setToken(v)}
                  />
                ) : (
                  <div className="chip chip-full chip-button">
                    <div className="chip-icon">
                      <div className="avatar">
                        <SVG
                          title={"Change Token"}
                          height={20}
                          width={20}
                          color={"#121212"}
                          src={"/icons/icon-wallet.svg"}
                        />
                      </div>
                    </div>
                    <div className="chip-content">
                      <div className="chip-title">...</div>
                      <div className="chip-subtitle text-gray">
                        Connect wallet to select token
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Tips status
        <div className="modal-body">
          {status === TipStatus.success
            ? `Tipped ${profile.displayName} with ${amount} ${token.symbol} Successfully!`
            : `Error Occurs`}
        </div>
      )}
      {status === TipStatus.common && (
        <div className="modal-footer">
          <div className="btn-group btn-group-block">{RenderButton}</div>
        </div>
      )}
    </>
  );
}
