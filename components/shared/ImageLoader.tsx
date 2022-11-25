import { ImgHTMLAttributes, useState, SyntheticEvent } from "react";
import { DefaultIcon } from "./Default";
import { Loading } from "./Loading";

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
    
        width={"100%"}
        height={"100%"}
        style={{
          display: loaded || !props.src ? "block" : "none",
          objectFit: "fill",
        }}
        alt={props.alt || 'img'}
      />
      {!loaded && Boolean(props.src) ? <Loading style={{ margin: 0 }} /> : null}
    </picture>
  );
}
