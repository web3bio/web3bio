import { useRouter } from "next/navigation";
import SearchInput from "../search/SearchInput";

export default function SearchModalContent(props) {
  const { domain, onClose } = props;
  const router = useRouter();
  return (
    <div className="web3bio-search modal-search-container">
      <div className="form-input-group">
        <SearchInput
          key={domain}
          defaultValue={domain}
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
