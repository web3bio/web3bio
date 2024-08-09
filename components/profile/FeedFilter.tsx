import { useMemo } from "react";
import { TagsFilterMapping } from "../utils/activity";

const FeedFilter = ({ value, onChange }) => {
  const options = useMemo(
    () =>
      Object.entries(TagsFilterMapping).map(([key, { label }]) => (
        <option key={key} value={key}>
          {label}
        </option>
      )),
    []
  );

  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="form-select select-sm mr-2"
    >
      {options}
    </select>
  );
};

export default FeedFilter;
