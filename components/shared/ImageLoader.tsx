import { ImgHTMLAttributes, SyntheticEvent, useState } from "react";
import ImagePlaceholder from "./ImgPlaceholder";

export function ImageLoader(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const onErrorHandle = () => {
    setError(true);
  };
  return (
    <>
      {error ? (
        <ImagePlaceholder alt={props.alt} />
      ) : (
        <img
          src={props.src}
          data-src={props.src}
          onLoad={() => setLoaded(Boolean(props.src))}
          onError={onErrorHandle}
          width={props.width as number}
          height={props.height as number}
          alt={props.alt}
          className="img-responsive"
          loading="lazy"
        />
      )}
    </>
  );
}
