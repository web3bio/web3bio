import { ApolloProvider } from "@apollo/client";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "../styles/web3bio.scss";
import client from "../utils/apollo";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
      <GoogleAnalytics strategy="lazyOnload" />
    </ApolloProvider>
  );
}
