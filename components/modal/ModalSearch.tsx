"use client";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { useRouter } from "next/navigation";
import SearchInput from "../search/SearchInput";

export default function SearchModalContent(props) {
  const { domain, onClose } = props;
  const router = useRouter();
  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div className="web3bio-search">
        <Link
          href={{
            pathname: "/",
            query: {},
          }}
          className="web3bio-logo"
          title="Web3.bio"
        >
          <h1 className="text-pride">
            WEB3
            <br />
            BIO
          </h1>
        </Link>
        <div className="form-input-group">
          <SearchInput
            key={domain}
            defaultValue={""}
            handleSubmit={(value, platform) => {
              router.push(
                `/?s=${value}${platform ? `&platform=${platform}` : ""}`
              );
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}
