import { ApolloProvider } from "@apollo/client";
import client from "../utils/apollo";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "../styles/scss/web3bio.scss";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
      <GoogleAnalytics strategy="lazyOnload" />
    </ApolloProvider>
  );
}

export default App;
