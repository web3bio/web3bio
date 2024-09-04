"use client";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { useRouter } from "next/navigation";
import SearchInput from "../search/SearchInput";
import { useRef } from "react";

export default function SearchModalContent(props) {
  const { domain, onClose } = props;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (value, platform?) => {
    const queryParams = new URLSearchParams();
    if (platform === "domain") {
      queryParams.set("domain", value);
    } else if (value) {
      queryParams.set("s", value);
      if (platform) {
        queryParams.set("platform", platform);
      }
    }
    router.push(`/?${queryParams.toString()}`);
    onClose();
  };

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
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
          <h1 className="text-conic-pride">
            WEB3
            <br />
            BIO
          </h1>
        </Link>
        <div className="form-input-group">
          <SearchInput
            inputRef={inputRef}
            key={domain}
            defaultValue={""}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
