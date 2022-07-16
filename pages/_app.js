import { ApolloProvider } from "@apollo/client";
import client from "../utils/apollo";
import "../styles/scss/web3bio.scss";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
