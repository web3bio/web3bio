import { ImgHTMLAttributes, useState } from "react";
import ImagePlaceholder from "./ImgPlaceholder";

export function ImageLoader(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  if (error) {
    return <ImagePlaceholder alt={props.alt} />;
  }

  return (
    <div
      className={`img-container ${!error && loaded ? "loaded" : ""}`}
      style={{ width: props.width, height: props.height }}
    >
      <img
        src={props.src}
        alt={props.alt}
        onLoad={handleLoad}
        onError={handleError}
        className="img-responsive"
        loading="lazy"
      />
    </div>
  );
}
