import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { PHI_AUTH, PHI_GRAPHQL_END_POINT } from "../components/apis/philand";

const defaultLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
});

const philandLink = new HttpLink({
  uri: PHI_GRAPHQL_END_POINT,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": PHI_AUTH
  },
});

const client = new ApolloClient({
  link: ApolloLink.split(
    (o) => o.getContext().clientName === "philand",
    philandLink,
    defaultLink
  ),
  cache: new InMemoryCache(),
});

export default client;
