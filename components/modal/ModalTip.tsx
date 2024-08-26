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
import {
  chainIdToNetwork,
  networkByIdOrName,
} from "../utils/network";
import { Loading } from "../shared/Loading";
import { Avatar } from "../shared/Avatar";
import toast from "react-hot-toast";
import TokenSelector from "./TokenSelector";
import { Token } from "../utils/types";
import useSWR from "swr";
import { formatText } from "../utils/utils";
import { FIREFLY_PROXY_DEBANK_ENDPOINT, ProfileFetcher } from "../utils/api";

enum TipStatus {
  success = 1,
  common = 0,
  failed = 2,
}

const donateSuggest = [
  {
    key: 1,
    text: "1",
  },
  {
    key: 3,
    text: "3",
  },
  {
    key: 5,
    text: "5",
  },
];

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
      setStatus(TipStatus.success);
    }
    if (txStatus === "error") {
      setStatus(TipStatus.failed);
    }

    if (status !== TipStatus.common) {
      setTimeout(() => {
        setStatus(TipStatus.common);
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
      if (shouldChangeNetwork) return `Change Network`;
      if (!amount || amount <= 0) return "Invalid Amount";
      if (isBalanceLow) return "Insufficient Balance";
      if (isButtonLoading) return "Loading...";
      if (!tokenList?.length) return "No Token Detected";
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
    contractPrepareLoading,
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
                {donateSuggest.map((x) => (
                  <div
                    key={x?.text}
                    className={`btn btn-text btn-price ${
                      x?.key === selectPrice && !disablePriceBtn
                        ? "btn-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setDisablePriceBtn(false);
                      setSelectPrice(x.key);
                      setCustomPrice("");
                    }}
                  >
                    {x.text}
                  </div>
                ))}

                <input
                  type="text"
                  className="form-input"
                  value={customPrice}
                  placeholder="Custom"
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
                      value = value.slice(0, -1);
                    }
                    if (!disablePriceBtn) {
                      setDisablePriceBtn(true);
                    }
                    setCustomPrice(value);
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
                <div className="chip chip-full">
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
              <div className="col-12 col-sm-12">
                <label className="form-label">Pay with</label>
              </div>
              <div className="col-12 col-sm-12">
                <TokenSelector
                  isLoading={isLoading}
                  selected={token}
                  list={tokenList}
                  value={amount}
                  disabled={txLoading || txPrepareLoading || !tokenList?.length}
                  onSelect={(v) => setToken(v)}
                />
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
      <div className="modal-footer">
        <div className="btn-group btn-group-block">{RenderButton}</div>
      </div>
    </>
  );
}
