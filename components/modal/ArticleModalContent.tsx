import Markdown from "react-markdown";

export default function ArticleModalContent({ ctx, title }) {
  return (
    <div className="modal-article-container">
      <Markdown>{`### ${title} ` + ctx}</Markdown>
    </div>
  );
}
