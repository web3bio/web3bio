import Link from "next/link";
import SVG from "react-inlinesvg";

export const Footer = () => {
  return (
    <div className="web3bio-footer">
      <div className="text-center container grid-lg">
        <div className="columns">
          <div className="column col-12">
            <>
              <div className="mt-4 mb-4">
                <Link
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
                </Link>
                <Link
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
                </Link>
                <Link
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
                </Link>
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
                <span className="text-pride">&hearts;</span>
              </div>
              <div className="text-assistive">
                <div className="sitemap-result-body"><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 1" href="/sitemaps/1">Sitemaps Page 1</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 2" href="/sitemaps/2">Sitemaps Page 2</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 3" href="/sitemaps/3">Sitemaps Page 3</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 4" href="/sitemaps/4">Sitemaps Page 4</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 5" href="/sitemaps/5">Sitemaps Page 5</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 6" href="/sitemaps/6">Sitemaps Page 6</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 7" href="/sitemaps/7">Sitemaps Page 7</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 8" href="/sitemaps/8">Sitemaps Page 8</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 9" href="/sitemaps/9">Sitemaps Page 9</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 10" href="/sitemaps/10">Sitemaps Page 10</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 11" href="/sitemaps/11">Sitemaps Page 11</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 12" href="/sitemaps/12">Sitemaps Page 12</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 13" href="/sitemaps/13">Sitemaps Page 13</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 14" href="/sitemaps/14">Sitemaps Page 14</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 15" href="/sitemaps/15">Sitemaps Page 15</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 16" href="/sitemaps/16">Sitemaps Page 16</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 17" href="/sitemaps/17">Sitemaps Page 17</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 18" href="/sitemaps/18">Sitemaps Page 18</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 19" href="/sitemaps/19">Sitemaps Page 19</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 20" href="/sitemaps/20">Sitemaps Page 20</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 21" href="/sitemaps/21">Sitemaps Page 21</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 22" href="/sitemaps/22">Sitemaps Page 22</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 23" href="/sitemaps/23">Sitemaps Page 23</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 24" href="/sitemaps/24">Sitemaps Page 24</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 25" href="/sitemaps/25">Sitemaps Page 25</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 26" href="/sitemaps/26">Sitemaps Page 26</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 27" href="/sitemaps/27">Sitemaps Page 27</Link><Link className="btn btn-sm" target="_blank" title="Sitemaps Page 28" href="/sitemaps/28">Sitemaps Page 28</Link></div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
