"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchInput from "../search/SearchInput";

export default function SearchModalContent(props) {
  const { domain, onClose } = props;
  const router = useRouter();
  return (
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
  );
}
