export default function ImagePlaceholder(props) {
  const { alt } = props;
  return (
    <div
      className="img-placeholder img-responsive bg-pride"
      data-initial={alt?.substring(0, 2)}
    ></div>
  );
}
