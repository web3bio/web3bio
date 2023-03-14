import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
    cache: new InMemoryCache(),
});

export default client