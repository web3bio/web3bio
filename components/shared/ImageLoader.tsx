import { ImgHTMLAttributes, useState, SyntheticEvent } from "react";
import { DefaultIcon } from "./Default";
// import { Loading } from "./Loading";

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
        width={props.width}
        height={props.height}
        alt={props.alt}
        className="img-responsive"
        loading="lazy"
      />
      {/* {!loaded && Boolean(props.src) ? <Loading style={{ margin: 0 }} /> : null} */}
    </>
  );
}
