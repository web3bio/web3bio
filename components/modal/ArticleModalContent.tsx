import Markdown from "react-markdown";

export default function ArticleModalContent({ title, content, baseURL, link }) {
  const imageInMarkdownRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
  const resolveImageWithMarkdown = (content) => {
    return content.replaceAll(imageInMarkdownRegex, (x) => {
      const relativePath = imageInMarkdownRegex.exec(x)?.[1];
      return x.replace(relativePath, new URL(relativePath || "", baseURL));
    });
  };
  return (
    <div className="modal-article-container">
      <h1 className="modal-article-title">{title}</h1>
      <Markdown>{resolveImageWithMarkdown(content)}</Markdown>
    </div>
  );
}
