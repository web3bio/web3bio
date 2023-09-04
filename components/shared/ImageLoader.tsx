import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import ImagePlaceholder from "./ImgPlaceholder";

export function ImageLoader(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  const handleError = () => {
    setError(true);
  };
  useEffect(() => {
    if (!loaded && image.current) {
      setLoaded(image.current.complete);
    }
  }, []);
  const handleLoad = () => {
    setLoaded(true);
  };
  if (error) {
    return <ImagePlaceholder alt={props.alt} />;
  }

  return (
    <div
      className={
        typeof window === undefined
          ? "img-container loaded"
          : loaded
          ? "img-container loaded"
          : "img-container"
      }
      style={{ width: props.width, height: props.height }}
    >
      <img
        ref={image}
        onLoad={handleLoad}
        onError={handleError}
        className="img-responsive"
        loading="lazy"
        {...props}
      />
    </div>
  );
}
