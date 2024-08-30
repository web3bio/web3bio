export default function NFTOrder({ value, onChange, orders }) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="form-select select-sm mr-2"
      title="Change NFT order"
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
