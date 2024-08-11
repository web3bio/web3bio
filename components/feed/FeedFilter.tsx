import { FC } from "react";
import { TagsFilterMapping } from "../utils/activity";

interface FeedFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const FeedFilter: FC<FeedFilterProps> = ({ value, onChange }) => {
  const options = Object.entries(TagsFilterMapping).map(([key, { label }]) => (
    <option key={key} value={key}>
      {label}
    </option>
  ));

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