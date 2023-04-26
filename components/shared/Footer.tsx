import SVG from "react-inlinesvg";

export const Footer = () => {
  return (
    <>
      <div className="mt-4 mb-4">
        <a
          href="https://twitter.com/web3bio"
          className="btn-link text-dark ml-2 mr-2"
          target="_blank"
          rel="noopener noreferrer"
          title="Web3.bio Twitter"
        >
          <SVG
            src="icons/icon-twitter.svg"
            width={20}
            height={20}
            className="icon"
          />
        </a>
        <a
          href="https://github.com/web3bio/web5bio"
          className="btn-link ml-2 mr-2"
          target="_blank"
          rel="noopener noreferrer"
          title="Web5.bio GitHub"
        >
          <SVG
            src="icons/icon-github.svg"
            width={20}
            height={20}
            className="icon"
          />
        </a>
        <a
          href="https://t.me/web5bio"
          className="btn-link ml-2 mr-2"
          target="_blank"
          rel="noopener noreferrer"
          title="Web5.bio Telegram Group"
        >
          <SVG
            src="icons/icon-telegram.svg"
            width={20}
            height={20}
            className="icon"
          />
        </a>
      </div>
      <div className="mt-2">
        A{" "}
        <a
          href="https://web3.bio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web3.bio
        </a>{" "}
        project crafted with{" "}
        <span className="text-pride">&hearts;</span> · Built with{" "}
        <a
          href="https://next.id"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.ID
        </a>
      </div>
    </>
  );
};
