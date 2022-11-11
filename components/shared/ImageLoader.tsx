import { ImgHTMLAttributes, useState, SyntheticEvent } from "react";
import { Loading } from "./Loading";

const DefaultIcon = new URL(
  "./assets/defaultIcon.png",
  import.meta.url
).toString();

export function ImageLoader(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const onErrorHandle = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = DefaultIcon;
  };
  return (
    <picture>
      <img
        {...props}
        onLoad={() => setLoaded(Boolean(props.src))}
        onError={onErrorHandle}
        loading="lazy"
        decoding="async"
        width={'100%'}
        height={'100%'}
        style={{ display: loaded || !props.src ? "block" : "none" , objectFit:'fill' }}
        alt=""
      />
      {!loaded && Boolean(props.src) ? <Loading /> : null}
    </picture>
  );
}
