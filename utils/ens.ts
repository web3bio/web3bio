import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";

const EthereumRPC = "https://rpc.ankr.com/eth";

export const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ens = new ENS();

const globalRecordKeys = [
  "description",
  "url",
  "com.github",
  "com.twitter",
  "org.telegram",
  "com.discord",
  "com.reddit",
  "vnd.twitter",
  "vnd.github",
];

// todo: to checkout
export const preFetchENSList = [
  "brantly.eth",
  "xiabing.eth",
  "sujiyan.eth",
  "wagmisabi.eth",
  "cdixon.eth",
  "niconico.eth",
  "nykma.eth",
  "yisiliu.eth",
  "binrui.eth",
  "nottoobad.eth",
  "dengdeng.eth",
  "liuguo.eth",
  "davidhoffman.eth",
  "bradgao.eth",
  "happymelma.eth",
  "0xluckman.eth",
  "wijuwiju.eth",
  "joshuameteora.eth",
  "jackzora.eth",
  "rubato.eth",
  "guoyu.eth",
  "taoli.eth",
  "681.eth",
];

export const preftchEtuereumAddresses = [
  "0x0bd793ea8334a77b2bfd604dbaedca11ea094306",
  "0x141721F4D7Fd95541396E74266FF272502Ec8899",
  "0x790116d0685eB197B886DAcAD9C247f785987A4a",
  "0x90474E58d0194bEF808eCb8D8cD7345a3642209F",
  "0x2467ee73bb0c5acdeedf4e6cc5aa685741126872",
  "0x7241DDDec3A6aF367882eAF9651b87E1C7549Dff",
  "0x3ddfa8ec3052539b6c9549f12cea2c295cff5296",
  "0x176F3DAb24a159341c0509bB36B833E7fdd0a132T",
];

export const prefetchLensList = [
  "suji_yan",
  "happymelma",
  "wijuwiju0x",
  "noneptr",
];

export const preftchTwitterList = [
  "sujiyan.lens",
  "jackzora.lens",
  "stani.lens",
  "hazelstar.lens",
];

export const preftchBitList = ["mitchatmask.bit", "test0920.bit"];

export { ens, globalRecordKeys };
