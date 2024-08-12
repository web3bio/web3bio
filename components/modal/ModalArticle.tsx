import Link from "next/link";
import Markdown from "react-markdown";
import SVG from "react-inlinesvg";

export default function ArticleModalContent({ title, content, baseURL, link, onClose }) {
  const imageInMarkdownRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
  const resolveImageWithMarkdown = (content) => {
    return content.replaceAll(imageInMarkdownRegex, (x) => {
      const relativePath = imageInMarkdownRegex.exec(x)?.[1];
      return x.replace(relativePath, new URL(relativePath || "", baseURL));
    });
  };
  return (
    <>
      <div className="modal-actions">
        {link && (
          <Link href={link} target={"_blank"} className="btn">
            <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
            View Original
          </Link>
        )}
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <div className="modal-article-container">
        <h1 className="modal-article-title">{title}</h1>
        <Markdown>
          {!baseURL ? content : resolveImageWithMarkdown(content)}
        </Markdown>
      </div>
    </>
  );
}
