import { forwardRef, useMemo, useRef } from "react";
import { useAsync } from "react-use";
import { Loading } from "./Loading";

export interface VideoRef {
  video?: HTMLVideoElement | null;
}

export interface VideoProps {
  src: string | Blob;
  component?: "video";
  VideoProps?: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >;
}

export async function _fetch(url: string): Promise<Blob> {
  const res = await globalThis.fetch(url);
  return res.blob();
}

export const Video = forwardRef<VideoRef, VideoProps>(function Video(
  props,
  outgoingRef
) {
  const { src, component = "video", VideoProps } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  const { loading, error, value } = useAsync(async () => {
    if (typeof src !== "string") return src;
    return _fetch(src);
  }, [src]);

  const blobURL = useMemo(() => {
    if (!value) return "";
    return URL.createObjectURL(value);
  }, [value]);

  if (component !== "video") return null;
  if (loading || loading) {
    return <Loading style={{ margin: 0 }} />;
  }
  return (
    <video
      style={{ borderRadius: 12 }}
      width={"100%"}
      height={"100%"}
      ref={videoRef}
      muted
      {...VideoProps}
    >
      {blobURL ? <source src={blobURL} type="video/mp4" /> : null}
    </video>
  );
});
