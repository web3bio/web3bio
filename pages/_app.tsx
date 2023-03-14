import { ApolloProvider } from "@apollo/client";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "../styles/scss/panel/_panel.scss";
import "../styles/scss/web3bio.scss";
import client from "../utils/apollo";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
      <GoogleAnalytics strategy="lazyOnload" />
    </ApolloProvider>
  );
}
