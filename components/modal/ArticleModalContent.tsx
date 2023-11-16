import Markdown from "react-markdown";

export default function ArticleModalContent({ ctx, baseURL }) {
  const imageInMarkdownRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
  const resolveImageWithMarkdown = (ctx) => {
    return ctx.replaceAll(imageInMarkdownRegex, (x) => {
      const relativePath = imageInMarkdownRegex.exec(x)?.[1];
      return x.replace(relativePath, new URL(relativePath || "", baseURL));
    });
  };
  return (
    <div className="modal-article-container">
      <Markdown>{resolveImageWithMarkdown(ctx)}</Markdown>
    </div>
  );
}
