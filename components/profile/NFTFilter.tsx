import { NFTFilterMapping } from "../utils/network";

export default function NFTFilter({ value, onChange }) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="form-select select-sm mr-2"
      title="Change NFT Network"
    >
      {Object.keys(NFTFilterMapping).map((x) => {
        return (
          <option key={x} value={NFTFilterMapping[x].filters} title={NFTFilterMapping[x].label}>
            {NFTFilterMapping[x].label}
          </option>
        );
      })}
    </select>
  );
}
