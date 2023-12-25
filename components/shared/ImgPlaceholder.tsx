export default function ImagePlaceholder(props) {
  const { alt } = props;
  return (
    <div className="img-placeholder img-responsive bg-dark">
      {alt && (
        <div className="initial text-pride">{alt?.substring(0, 1)}</div>
      )}
    </div>
  );
}
