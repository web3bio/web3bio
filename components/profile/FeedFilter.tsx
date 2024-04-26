import { TagsFilterMapping } from "../utils/activity";

export default function FeedFilter({ value, onChange }) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="form-select select-sm mr-2"
    >
      {Object.keys(TagsFilterMapping).map((x) => {
        return (
          <option key={x} value={x}>
            {TagsFilterMapping[x].label}
          </option>
        );
      })}
    </select>
  );
}
