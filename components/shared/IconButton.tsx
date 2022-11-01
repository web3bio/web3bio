import SVG from "react-inlinesvg";
export const IconButton = (props) => {
  const { width, height, src } = props;
  return (
    <button className="form-button btn " style={{ position: "relative" }}>
      <SVG
        src={src}
        width={width ?? 24}
        height={height ?? 24}
        className="icon"
      />
    </button>
  );
};
