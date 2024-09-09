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
import { emojiBlast } from "emoji-blast";

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
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const [status, setStatus] = useState(TipStatus.common);
  const { address } = useAccount();
  const { data: tokenList, isLoading } = useTokenList(address);
  const [token, setToken] = useState<Token | any>(null);
  const amount = useMemo(() => {
    const donatePrice = customPrice || selectPrice;
    if (!token?.price) return 0;
    return Number((Number(donatePrice) / Number(token.price)).toFixed(5));
  }, [token, customPrice, selectPrice]);
  const customInput = useRef<HTMLInputElement>(null);

  // config ---------- start
  const {
    sendTransaction,
    data: donateTx,
    isPending: donatePrepareLoading,
    error: donatePrepareError,
  } = useSendTransaction();

  const {
    writeContract: onCallApprove,
    data: approveTx,
    isPending: approvePrepareLoading,
    error: ApprovePrepareError,
  } = useWriteContract();

  const { data: approveData, isLoading: approveLoading } =
    useWaitForTransactionReceipt({
      hash: approveTx,
    });

  const { data: donateData, isLoading: donateLoading } =
    useWaitForTransactionReceipt({
      hash: donateTx,
    });
  // config ---------- end

  // status ---------- start
  useEffect(() => {
    if (donatePrepareError || ApprovePrepareError) {
      toast.custom(
        <div className="toast">
          <SVG
            src="../icons/icon-wallet.svg"
            width={24}
            height={24}
            className="action mr-2"
          />
          Transaction rejected
        </div>
      );
    }
  }, [donatePrepareError, ApprovePrepareError]);

  useEffect(() => {
    if (status !== TipStatus.common) return;
    if (approveData?.status === "success") {
      toast.custom(
        <div className="toast">
          <SVG
            src="../icons/icon-wallet.svg"
            width={24}
            height={24}
            className="action mr-2"
          />
          Successfully approved {amount} {token.symbol}
        </div>
      );
    }
    if (approveData?.status === "reverted") {
      toast.custom(
        <div className="toast">
          <SVG
            src="../icons/icon-wallet.svg"
            width={24}
            height={24}
            className="action mr-2"
          />
          Approve {amount} {token.symbol} failed
        </div>
      );
    }
    if (donateData?.status === "success") {
      toast.custom(
        <div className="toast">
          <SVG
            src="../icons/icon-wallet.svg"
            width={24}
            height={24}
            className="action mr-2"
          />
          Successfully tipped {profile.displayName} with {amount} {token.symbol}
        </div>
      );
      setStatus(TipStatus.success);

      emojiBlast({
        emojis: [tipEmoji],
        physics: {
          fontSize: { max: 36, min: 24 },
          gravity: 0.3,
          initialVelocities: {
            rotation: { max: -14, min: -20 },
          },
          rotationDeceleration: 1.01,
        },
        position: {
          x: innerWidth / 2,
          y: innerHeight / 2,
        },
      });
    }
    if (donateData?.status === "reverted") {
      toast.custom(
        <div className="toast">
          <SVG
            src="../icons/icon-wallet.svg"
            width={24}
            height={24}
            className="action mr-2"
          />
          Tip to {profile.displayName} for {amount} {token.symbol} failed
        </div>
      );
      setStatus(TipStatus.failed);
    }
  }, [status, donateData, approveData]);
  // status ---------- end

  const { data: allowance } = useCurrencyAllowance(token?.id!);
  const RenderButton = useMemo(() => {
    const isBalanceLow = amount >= Number(token?.amount);
    const isAllowanceLow =
      Number(formatUnits(allowance || 0n, token?.decimals || 18)) < amount;
    const isButtonLoading =
      donateLoading ||
      donatePrepareLoading ||
      approveLoading ||
      approvePrepareLoading ||
      isSwitchingChain;

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
      if (donateLoading || approveLoading) return "Waiting for Transaction...";
      if (donatePrepareLoading || approvePrepareLoading)
        return "Confirm in Your Wallet...";
      if (!tokenList?.length) return "No Tokens Detected";
      if (!isNativeToken(token?.id) && isAllowanceLow)
        return `Approve ${amount} ${token?.symbol}`;

      return `Pay ${formatText(amount?.toString(), 8)} ${token?.symbol}`;
    })();
    return (
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          const isButtonDisabled = (() => {
            if (shouldChangeNetwork) {
              return isSwitchingChain;
            } else {
              return (
                isBalanceLow ||
                isButtonLoading ||
                !tokenList?.length ||
                amount <= 0
              );
            }
          })();

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
                    className={`btn btn-primary connect-btn ${
                      isButtonDisabled ? "disabled" : ""
                    }`}
                  >
                    {isButtonLoading && <Loading />}
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
    donateLoading,
    donatePrepareLoading,
    approvePrepareLoading,
    onCallApprove,
    sendTransaction,
    switchChainAsync,
    approveLoading,
    isSwitchingChain,
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

                <div className="input-price">
                  <input
                    ref={customInput}
                    type="text"
                    id="input-price-custom"
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
                  <label className="input-price-label" htmlFor="input-price-custom">$</label>
                </div>
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
                      donateLoading ||
                      donatePrepareLoading ||
                      !tokenList?.length
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
          <div className="empty">
            <div className="empty-icon h1" style={{ fontSize: "64px", lineHeight: "64px" }}>
              {tipEmoji}
            </div>
            <p className="empty-title h4">
              {status === TipStatus.success
              ? `Apperiate your ${tipObject}`
              : `Something Went Wrong! `}
            </p>
            <p className="empty-subtitle">
              {status === TipStatus.success
              ? `Successfully tipped ${profile.displayName} with ${amount} ${token?.symbol}!`
              : `Please try again.`}
            </p>
          </div>
          
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
