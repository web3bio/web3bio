import { ImgHTMLAttributes, SyntheticEvent, useState } from "react";
import { DefaultIcon } from "./Default";

export function ImageLoader(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const onErrorHandle = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = DefaultIcon;
  };
  return (
    <>
      <img
        src={props.src}
        data-src={props.src}
        onLoad={() => setLoaded(Boolean(props.src))}
        onError={onErrorHandle}
        width={(props.width as number)}
        height={(props.height as number) }
        alt={props.alt}
        className="img-responsive"
        loading="lazy"
      />
    </>
  );
}
