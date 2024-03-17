import SVG from "react-inlinesvg";

export const Footer = () => {
  return (
    <div className="web3bio-footer">
      <div className="text-center container grid-lg">
        <div className="columns">
          <div className="column col-12">
            <>
              <div className="mt-4 mb-4">
                <a
                  href="https://twitter.com/web3bio"
                  className="btn-link text-dark ml-2 mr-2"
                  target="_blank"
                  title="Web3.bio Twitter (X)"
                >
                  <SVG
                    fill="#000"
                    src="icons/icon-twitter.svg"
                    width={20}
                    height={20}
                    className="icon"
                  />
                </a>
                <a
                  href="https://github.com/web3bio"
                  className="btn-link ml-2 mr-2"
                  target="_blank"
                  title="Web3.bio GitHub"
                >
                  <SVG
                    fill="#000"
                    src="icons/icon-github.svg"
                    width={20}
                    height={20}
                    className="icon"
                  />
                </a>
                <a
                  href="https://t.me/web3dotbio"
                  className="btn-link ml-2 mr-2"
                  target="_blank"
                  title="Web3.bio Telegram Group"
                >
                  <SVG
                    fill="#000"
                    src="icons/icon-telegram.svg"
                    width={20}
                    height={20}
                    className="icon"
                  />
                </a>
              </div>
              <div className="mt-4 mb-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};
