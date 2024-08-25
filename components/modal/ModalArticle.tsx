import { useMemo } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

export default function ArticleModalContent({ title, content, baseURL, platform, link, published, onClose }) {
  const resolvedContent = useMemo(() => {
    if (!baseURL) return content;
    const imageInMarkdownRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
    return content.replace(imageInMarkdownRegex, (match, relativePath) => {
      return match.replace(relativePath, new URL(relativePath || "", baseURL));
    });
  }, [content, baseURL]);

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <div
        className="modal-header"
        style={{
          ["--widget-primary-color" as string]: SocialPlatformMapping(
            platform as PlatformType
          )?.color,
        }}
      >
        <div className="modal-cover article"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(platform as PlatformType)?.icon}`}
            fill="#fff"
            width={14}
            height={14}
          />
        </div>
        <span className="modal-header-title">{SocialPlatformMapping(platform as PlatformType)?.label}</span>
      </div>
      <div className="modal-body">
        <h1 className="article-title">{title}</h1>
        <div className="article-meta text-gray">
          Published on {new Date(published).toLocaleDateString()}
        </div>
        <Markdown>
          {resolvedContent}
        </Markdown>
        
      </div>
      <div className="modal-footer">
        <div className="btn-group btn-group-block">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            <SVG src={"icons/icon-open.svg"} width={20} height={20} />
            View Original
          </Link>
        </div>
      </div>
    </>
  );
}
