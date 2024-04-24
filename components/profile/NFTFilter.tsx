import { NFTFilterMapping } from "../utils/network";

export default function NFTFilter({ value, onChange }) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="form-select select-sm mr-2"
    >
      {Object.keys(NFTFilterMapping).map((x) => {
        return (
          <option key={x} value={NFTFilterMapping[x].filters}>
            {NFTFilterMapping[x].label}
          </option>
        );
      })}
    </select>
  );
}
