export default function NFTSort({ value, onChange, orders }) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="form-select select-sm mr-2"
      title="Sort NFT Collections"
    >
      {orders.map((x) => {
        return (
          <option key={x.key} value={x.key}>
            {x.label}
          </option>
        );
      })}
    </select>
  );
}
