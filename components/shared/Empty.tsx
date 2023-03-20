
export const Empty = (props) => {
  const { text = "Please try different identity keyword." } = props;
  return (
    <div className="empty">
      <div className="empty-icon h1">🤖</div>
      <p className="empty-title h4">No results found</p>
      <p className="empty-subtitle">{text}</p>
    </div>
  );
};
