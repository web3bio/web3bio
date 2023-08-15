import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_RELATION_API_KEY ?? "",
  },
  cache: new InMemoryCache(),
});

export default client;
